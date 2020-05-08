import axios from 'axios';

const createInstance = (apiKey) => {

    const lolApiUrl = 'https://br1.api.riotgames.com/lol/';

    const axiosInstance = axios.create({
        baseURL: lolApiUrl,
        headers: { 'X-Riot-Token': apiKey }
    });

    return axiosInstance;
}

export default createInstance;
