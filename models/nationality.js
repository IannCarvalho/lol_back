import { Schema } from 'mongoose';
import db from '../lib/database.js';

const nationalitySchema = new Schema({
    name: String,
    description: String,
    img: String,
    splash: String,
});

// Índice no campo consultado pela API (GET /nationality/:name via
// findOne({ name }) com collation case-insensitive). A collation do índice
// precisa casar com a da query para ser aproveitado; por isso o índice é
// declarado com a mesma collation (locale 'en', strength 2) usada no service.
nationalitySchema.index({ name: 1 }, { collation: { locale: 'en', strength: 2 } });

const Nationality = db.model('Nationality', nationalitySchema);

export default Nationality;