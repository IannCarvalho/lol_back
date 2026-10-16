import Champion from '../models/champion.js';
import { checkNotFound, mapMongooseError } from '../util.js';

// .lean() porque a rota e so leitura: devolve POJO em vez de documento
// Mongoose hidratado (menos custo), e o JSON resultante e o mesmo (_id
// serializa como string hex igual).
const getChampion = async (slug) => {
    const champion = await Champion.findOne({ slug })
        .lean()
        .catch(mapMongooseError);
    checkNotFound(champion, 'Champion');
    return champion;
};

export { getChampion };
