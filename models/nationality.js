import { Schema } from 'mongoose';
import db from '../lib/database.js';

const nationalitySchema = new Schema({
    name: String,
    description: String,
    img: String,
    splash: String,
});

// Índice no campo consultado pela API (GET /nationality/:name via
// findOne({ name: $regex })). Como a busca é $regex case-insensitive, o índice
// não é usado de forma plena; é mantido por ser barato e por beneficiar
// consultas por igualdade. Trade-off documentado no PR.
nationalitySchema.index({ name: 1 });

const Nationality = db.model('Nationality', nationalitySchema);

export default Nationality;