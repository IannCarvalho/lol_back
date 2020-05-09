import axios from 'axios';
require('dotenv').config();

const createInstance = () => {

    const lolApiUrl = 'https://br1.api.riotgames.com/lol/';

    const axiosInstance = axios.create({
        baseURL: lolApiUrl,
        headers: { 'X-Riot-Token': process.env.LOL_API_KEY }
    });

    return axiosInstance;
}

export default createInstance;
