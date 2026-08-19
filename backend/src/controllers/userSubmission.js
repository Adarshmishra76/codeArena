
const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

const submitCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.id;
        let { code, language } = req.body;

        if (!userId || !code || !problemId || !language) {
            return res.status(400).send("Some field missing");
        }

        // Normalize language
        if (language === 'cpp' || language === 'c++') {
            language = 'c++';
        } else if (language === 'py') {
            language = 'python';
        }

        console.log('Language:', language);

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).send("Problem not found");
        }

        // Create submission with all fields initialized
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: 'pending',
            testCasesTotal: problem.hiddenTestCases.length,
            testCasesPassed: 0,
            runtime: 0,
            memory: 0,
            errorMessage: ''
        });

        const languageId = getLanguageById(language);
        const submissions = problem.hiddenTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = null;

        for (const test of testResult) {
            console.log('Test result:', test);
            
            if (test.status_id === 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time) || 0;
                memory = Math.max(memory, test.memory || 0);
            } else if (test.status_id === 4) {
                status = 'error';
                errorMessage = test.stderr || test.message || 'Compilation/Runtime error';
            } else if (test.status_id === 5) {
                status = 'wrong';
                errorMessage = test.stderr || test.message || 'Wrong answer';
            } else {
                status = 'error';
                errorMessage = test.stderr || test.message || 'Unknown error';
            }
        }

        // Update submission
        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;
        await submittedResult.save();

        // Add to solved list if accepted
        if (status === 'accepted') {
            const user = await User.findById(userId);
            if (user && !user.problemSolved.includes(problemId)) {
                user.problemSolved.push(problemId);
                await user.save();
            }
        }

        res.status(201).json({
            accepted: status === 'accepted',
            totalTestCases: submittedResult.testCasesTotal,
            passedTestCases: testCasesPassed,
            runtime: runtime.toFixed(2),
            memory,
            status,
            errorMessage
        });

    } catch (err) {
        console.error('Submit Error:', err);
        res.status(500).send("Internal Server Error: " + err.message);
    }
}

const runCode = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.id;
        let { code, language } = req.body;

        if (!userId || !code || !problemId || !language) {
            return res.status(400).send("Some field missing");
        }

        if (language === 'cpp' || language === 'c++') {
            language = 'c++';
        } else if (language === 'py') {
            language = 'python';
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).send("Problem not found");
        }

        const languageId = getLanguageById(language);
        const submissions = problem.visibleTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let success = true;
        let errorMessage = null;
        let testResults = [];

        for (const test of testResult) {
            const testCaseResult = {
                input: test.stdin || '',
                expected: test.expected_output || '',
                output: test.stdout || '',
                passed: test.status_id === 3
            };

            if (test.status_id === 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time) || 0;
                memory = Math.max(memory, test.memory || 0);
            } else {
                success = false;
                errorMessage = test.stderr || test.message || 'Error';
                testCaseResult.error = errorMessage;
            }
            testResults.push(testCaseResult);
        }

        res.status(201).json({
            success,
            testCases: testResults,
            passedTestCases: testCasesPassed,
            totalTestCases: problem.visibleTestCases.length,
            runtime: runtime.toFixed(2),
            memory,
            errorMessage
        });

    } catch (err) {
        console.error('Run Error:', err);
        res.status(500).send("Internal Server Error: " + err.message);
    }
}

module.exports = { submitCode, runCode };