import * as _ from 'lodash';
import Champion from '../models/champion';
import { checkNotFound, catchFormatValidation } from '../util';

const getChampion = async (slug) => {
    const champion = await Champion.findOne({ slug: slug })
        .catch(catchFormatValidation);
    checkNotFound(champion, 'Champion');
    return champion;
}

export { getChampion };