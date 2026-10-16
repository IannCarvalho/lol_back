import Nationality from '../models/nationality.js';
import Champion from '../models/champion.js';
import { checkNotFound, mapMongooseError } from '../util.js';

// Collation case-insensitive: compara ignorando caixa (strength 2) mantendo a
// semantica da busca antiga ($regex /i), mas por IGUALDADE, o que permite ao
// MongoDB usar o indice do campo (o $regex sem ancora com /i varria a colecao).
// Os indices em models/*.js declaram a mesma collation para serem aproveitados.
const CI_COLLATION = { locale: 'en', strength: 2 };

// .lean() em todas as queries: rotas sao so leitura, nao precisa hidratar
// documento Mongoose; o JSON serializado e identico.
const getNationality = async (name) => {
    const nationality = await Nationality
        .findOne({ name })
        .collation(CI_COLLATION)
        .lean()
        .catch(mapMongooseError);
    checkNotFound(nationality, 'Nationality');
    return nationality;
};

// Lista: find() nunca retorna null (array vazio e um resultado valido), entao
// NAO ha checkNotFound aqui — regiao sem nacionalidades cadastradas responde
// 200 [] e o frontend conta com isso.
const getAllNationalities = async () => {
    const nationalities = await Nationality.find()
        .lean()
        .catch(mapMongooseError);
    return nationalities;
};

// Lista: idem acima — regiao sem campeoes responde 200 [], nao 404. O front
// depende disso para regioes vazias.
const getAllChampionsByNationality = async (nationality) => {
    const champions = await Champion
        .find({ nationality })
        .collation(CI_COLLATION)
        .lean()
        .catch(mapMongooseError);
    return champions;
};

export {
    getNationality,
    getAllNationalities,
    getAllChampionsByNationality,
};
