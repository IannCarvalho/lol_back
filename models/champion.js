import { Schema } from 'mongoose';
import db from '../lib/database';

const championSchema = new Schema({
    version: String,
    id: String,
    key: String,
    name: String,
    title: String,
    blurb: String,
    info: Object,
    tags: [String],
    partype: String,
    stats: Object,
    nationality: String,
    img: String,
    splash: String,
});

const Champion = db.model('Champion', championSchema);

export default Champion;