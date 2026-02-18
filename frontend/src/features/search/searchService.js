import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/search/';

const search = async (filters, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {}
    };

    if (typeof filters === 'string') {
        config.params.q = filters;
    } else {
        if (filters.q) config.params.q = filters.q;
        if (filters.role) config.params.role = filters.role;
        if (filters.location) config.params.location = filters.location;
        if (filters.skills) config.params.skills = filters.skills;
    }

    const response = await axios.get(API_URL, config);

    return response.data;
};

const searchService = {
    search,
};

export default searchService;
