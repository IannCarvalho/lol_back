import Champion from '../models/champion.js';
import { checkNotFound, catchFormatValidation } from '../util.js';

const getChampion = async (slug) => {
    const champion = await Champion.findOne({ slug: slug })
        .catch(catchFormatValidation);
    checkNotFound(champion, 'Champion');
    return champion;
}

export { getChampion };