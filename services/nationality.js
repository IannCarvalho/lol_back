import Nationality from '../models/nationality.js';
import Champion from '../models/champion.js';
import { checkNotFound, catchFormatValidation } from '../util.js';

// Collation case-insensitive: compara ignorando caixa (strength 2) mantendo a
// semântica da busca antiga ($regex /i), mas por IGUALDADE, o que permite ao
// MongoDB usar o índice do campo (o $regex sem âncora com /i varria a coleção).
// Os índices em models/*.js declaram a mesma collation para serem aproveitados.
const CI_COLLATION = { locale: 'en', strength: 2 };

const getNationality = async (name) => {
    const nationality = await Nationality
        .findOne({ name })
        .collation(CI_COLLATION)
        .catch(catchFormatValidation);
    checkNotFound(nationality, 'Nationality');
    return nationality;
};

const getAllNationalities = async () => {
    const nationalities = await Nationality.find()
        .catch(catchFormatValidation);
    checkNotFound(nationalities, 'Nationality');
    return nationalities;
};

const getAllChampionsByNationality = async (nationality) => {
    const champions = await Champion
        .find({ nationality })
        .collation(CI_COLLATION)
        .catch(catchFormatValidation);
    checkNotFound(champions, 'Champion');
    return champions;
};

export {
    getNationality,
    getAllNationalities,
    getAllChampionsByNationality,
};
