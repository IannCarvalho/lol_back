import axios from 'axios';

const createInstance = (apiKey) => {

    const lolApiUrl = 'https://br1.api.riotgames.com/lol/';

    const axiosInstance = axios.create({
        baseURL: lolApiUrl,
        params: {
            api_key: apiKey
        }
    });

    return axiosInstance;
}

export default createInstance;
