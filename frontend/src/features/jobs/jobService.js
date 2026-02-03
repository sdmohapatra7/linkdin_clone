import axios from 'axios';

const API_URL = 'http://localhost:5000/api/jobs/';

// Get all jobs
const getJobs = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL, config);

    return response.data;
};

// Create new job
const createJob = async (jobData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL, jobData, config);

    return response.data;
};

// Apply for a job
const applyJob = async (jobId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + 'apply/' + jobId, {}, config);

    return response.data;
};

const jobService = {
    getJobs,
    createJob,
    applyJob,
};

export default jobService;
