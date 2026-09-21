import { Schema } from 'mongoose';
import db from '../lib/database.js';

// Schema alinhado com os dados gravados por data_retrival/setup_database.py e
// consumidos pelo frontend. `slug` é a chave usada na busca por campeão
// (GET /champion/:slug); os campos de conteúdo (lore, image, background,
// title) são os efetivamente exibidos na UI.
const championSchema = new Schema({
    slug: String,
    name: String,
    title: String,
    lore: String,
    nationality: String,
    image: String,
    background: String,
});

const Champion = db.model('Champion', championSchema);

export default Champion;
