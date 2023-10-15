import * as _ from 'lodash';
import Champion from '../models/champion';
import { checkNotFound, catchFormatValidation } from '../util';

const getChampion = async (name) => {
    const champion = await Champion.findOne({ name: name })
        .catch(catchFormatValidation);
    checkNotFound(champion, 'Champion');
    return champion;
}

export { getChampion };