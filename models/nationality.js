import { Schema } from 'mongoose';
import db from '../lib/database.js';

// Schema alinhado com os dados gravados por data_retrival/setup_database.py
// (no lol_front) e consumidos pelo frontend. Os documentos reais trazem
// `slug, name, image, background, overview` (confira o snapshot servido ao
// front) — NAO os antigos `description, img, splash`, que nao existem nos
// dados semeados. `name` e a chave usada em GET /nationality/:name.
const nationalitySchema = new Schema({
    slug: String,
    name: String,
    image: String,
    background: String,
    overview: String,
});

// Indice no campo consultado pela API (GET /nationality/:name via
// findOne({ name }) com collation case-insensitive). A collation do indice
// precisa casar com a da query para ser aproveitado; por isso o indice e
// declarado com a mesma collation (locale 'en', strength 2) usada no service.
nationalitySchema.index({ name: 1 }, { collation: { locale: 'en', strength: 2 } });

const Nationality = db.model('Nationality', nationalitySchema);

export default Nationality;
