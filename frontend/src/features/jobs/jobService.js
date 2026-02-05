import axios from 'axios';

const API_URL = 'http://localhost:5000/api/jobs/';

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

// Get all jobs
const getJobs = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Apply for a job
const applyJob = async (jobId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + jobId + '/apply', {}, config);
    return response.data;
};

// Delete job
const deleteJob = async (jobId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.delete(API_URL + jobId, config);
    return response.data;
};

// Update job
const updateJob = async (jobId, jobData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(API_URL + jobId, jobData, config);
    return response.data;
};

const jobService = {
    createJob,
    getJobs,
    applyJob,
    deleteJob,
    updateJob,
};

export default jobService;
