import { Schema } from 'mongoose';
import db from '../lib/database';

const nationalitySchema = new Schema({
    name: String,
    description: String,
    img: String,
    splash: String,
});

const Nationality = db.model('Nationality', nationalitySchema);

export default Nationality;