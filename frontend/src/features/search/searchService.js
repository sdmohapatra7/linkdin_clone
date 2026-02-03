import axios from 'axios';

const API_URL = 'http://localhost:5000/api/search/';

const search = async (keyword, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            q: keyword
        }
    };

    const response = await axios.get(API_URL, config);

    return response.data;
};

const searchService = {
    search,
};

export default searchService;
