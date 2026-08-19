
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo");

const createProblem = async (req, res) => {
    const { title, description, difficulty, tags,
        visibleTestCases, hiddenTestCases, startCode,
        referenceSolution, problemCreator
    } = req.body;
        if (!title) {
        return res.status(400).json({ error: "Missing 'title' field" });
    }
    if (!referenceSolution || !Array.isArray(referenceSolution)) {
        return res.status(400).json({ error: "Missing 'referenceSolution' field" });
    }
    if (!visibleTestCases || !Array.isArray(visibleTestCases)) {
        return res.status(400).json({ error: "Missing 'visibleTestCases' field" });
    }
    try {
        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language);

            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            const submitResult = await submitBatch(submissions);
            const resultToken = submitResult.map((value) => value.token);
            const testResult = await submitToken(resultToken);

            console.log(testResult);

            for (const test of testResult) {
                // Piston API status: 3 = Accepted
                if (test.status_id !== 3) {
                    return res.status(400).send("Error Occured: " + (test.stderr || test.message));
                }
            }
        }

        const userProblem = await Problem.create({
            ...req.body,
            problemCreator: req.result._id
        });

        res.status(201).send("Problem Saved Successfully");
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
}

const updateProblem = async (req, res) => {
    const { id } = req.params;
    const { title, description, difficulty, tags,
        visibleTestCases, hiddenTestCases, startCode,
        referenceSolution, problemCreator
    } = req.body;

    try {
        if (!id) {
            return res.status(400).send("Missing ID Field");
        }

        const DsaProblem = await Problem.findById(id);
        if (!DsaProblem) {
            return res.status(404).send("ID is not present in server");
        }

        for (const { language, completeCode } of referenceSolution) {
            const languageId = getLanguageById(language);

            const submissions = visibleTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            const submitResult = await submitBatch(submissions);
            const resultToken = submitResult.map((value) => value.token);
            const testResult = await submitToken(resultToken);

            for (const test of testResult) {
                if (test.status_id !== 3) {
                    return res.status(400).send("Error Occured: " + (test.stderr || test.message));
                }
            }
        }

        const newProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });
        res.status(200).send(newProblem);
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
}

const deleteProblem = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id)
            return res.status(400).send("ID is Missing");

        const deletedProblem = await Problem.findByIdAndDelete(id);
        if (!deletedProblem)
            return res.status(404).send("Problem is Missing");

        res.status(200).send("Successfully Deleted");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
}



const getProblemById = async (req, res) => {
    const { id } = req.params;
    
    try {
        if (!id) {
            return res.status(400).send("ID is Missing");
        }

        const getProblem = await Problem.findById(id)
            .select('_id title description difficulty tags visibleTestCases startCode referenceSolution');

        if (!getProblem) {
            return res.status(404).send("Problem is Missing");
        }

        // Get video if exists
        const video = await SolutionVideo.findOne({ problemId: id });

        // If video exists, add video data to response
        if (video) {
            const responseData = {
                ...getProblem.toObject(),
                secureUrl: video.secureUrl,
                thumbnailUrl: video.thumbnailUrl,
                duration: video.duration
            };
            return res.status(200).send(responseData);
        }

        // If no video, return just the problem
        res.status(200).send(getProblem);
        
    } catch (err) {
        console.error('Error in getProblemById:', err);
        res.status(500).send("Error: " + err.message);
    }
}
const getAllProblem = async (req, res) => {
    try {
        const getProblem = await Problem.find({}).select('_id title difficulty tags');

        if (getProblem.length == 0)
            return res.status(404).send("Problem is Missing");

        res.status(200).send(getProblem);
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
}

const solvedAllProblembyUser = async (req, res) => {
    try {
        const userId = req.result._id;
        const user = await User.findById(userId).populate({
            path: "problemSolved",
            select: "_id title difficulty tags"
        });

        res.status(200).send(user.problemSolved);
    } catch (err) {
        res.status(500).send("Server Error");
    }
}


const submittedProblem = async (req, res) => {
    try {
        const userId = req.result._id;
        const problemId = req.params.pid;

        const ans = await Submission.find({ userId, problemId });

        // ✅ Add return here to stop execution
        if (ans.length == 0) {
            return res.status(200).send("No Submission is present");
        }

        // ✅ This will only run if there are submissions
        return res.status(200).send(ans);
        
    } catch (err) {
        return res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    createProblem,
    updateProblem,
    deleteProblem,
    getProblemById,
    getAllProblem,
    solvedAllProblembyUser,
    submittedProblem
};