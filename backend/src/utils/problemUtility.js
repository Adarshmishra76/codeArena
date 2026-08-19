
const axios = require('axios');




const getLanguageById = (lang) => {
    const language = {
        "python": "python",
        "py": "python",
        "java": "java",
        "c": "c",
        "c++": "c++",
        "cpp": "c++"
    }
    const result = language[lang.toLowerCase()];
    console.log(`Language mapping: ${lang} -> ${result}`);
    return result || "python";
}

const getVersion = (lang) => {
    const versions = {
        "python": "3.12.0",
        "java": "15.0.2",
        "c": "10.2.0",
        "c++": "10.2.0"
    }
    console.log(`Version: ${lang} -> ${versions[lang]}`);
    return versions[lang] || "*";
}


const submitBatch = async (submissions) => {
    try {
        const results = [];
        
        for (const submission of submissions) {
            const language = getLanguageById(submission.language_id);
            const version = getVersion(language);
            
            const payload = {
                language: language,
                version: version,
                files: [{ content: submission.source_code }],
                stdin: submission.stdin || ''
            };
            
            const response = await axios.post(process.env.PISTON_URL+'/api/v2/execute', payload);
            const data = response.data;
            
            let stdout = '';
            let stderr = '';
            let status_id = 3;
            let time = 0;
            let memory = 0;
            
            // Check compilation
            if (data.compile && data.compile.code !== 0) {
                stderr = data.compile.stderr || data.compile.output || 'Compilation error';
                status_id = 4;
            } 
            // Check runtime
            else if (data.run) {
                stdout = data.run.stdout || '';
                stderr = data.run.stderr || '';
                status_id = data.run.code === 0 ? 3 : 4;
                time = data.run.cpu_time || 0;
                memory = data.run.memory || 0;
            }
            
            results.push({
                status: status_id === 3 ? 'success' : 'error',
                stdout: stdout,
                stderr: stderr,
                output: stdout || stderr,
                expected_output: submission.expected_output || '',
                token: 'piston-' + Date.now(),
                time: time,
                memory: memory,
                status_id: status_id
            });
        }
        
        return results;
    } catch (error) {
        console.error('Piston Error:', error.response?.data || error.message);
        throw error;
    }
}


const submitToken = async (resultToken) => {
    return resultToken.map(token => ({
        status_id: token.status_id || 3,  // Use the status_id from the result
        stdout: token.stdout || '',
        stderr: token.stderr || '',
        message: token.message || '',
        time: token.time || 0,
        memory: token.memory || 0,
        expected_output: token.expected_output || ''
    }));
}

module.exports = { getLanguageById, submitBatch, submitToken };