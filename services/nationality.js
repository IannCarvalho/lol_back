import Nationality from '../models/nationality.js';
import Champion from '../models/champion.js';
import { checkNotFound, catchFormatValidation } from '../util.js';

const getNationality = async (name) => {
    const nationality = await Nationality.findOne({ name: { $regex: name, $options: 'i' } })
        .catch(catchFormatValidation);
    checkNotFound(nationality, 'Nationality');
    return nationality;
}

const getAllNationalites = async () => {
    const nationalities = await Nationality.find()
        .catch(catchFormatValidation);
    checkNotFound(nationalities, 'Nationality');
    return nationalities;
}

const getAllChampionsByNationality = async (nationality) => {
    const champions = await Champion.find({ nationality: { $regex: nationality, $options: 'i' } })
        .catch(catchFormatValidation);
    checkNotFound(champions, 'Champion');
    return champions;
}

export {
    getNationality,
    getAllNationalites,
    getAllChampionsByNationality
};