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

// Índices para os campos consultados pela API.
// - `slug`: usado em GET /champion/:slug via findOne({ slug }) — match EXATO,
//   então o índice é efetivamente aproveitado. NÃO é `unique`: a semeadura dos
//   dados é externa (data_retrival/*) e nada neste código garante unicidade;
//   um índice único poderia quebrar o seed caso surjam duplicatas. Fica como
//   índice simples (não-único) por segurança.
// - `nationality`: usado em GET /nationality/champions/:nationality. A query
//   atual é um $regex case-insensitive, que NÃO consegue usar o índice de forma
//   plena (sem âncora ^ e com /i o Mongo tende a varrer); o índice é mantido
//   mesmo assim por ser barato e por beneficiar eventuais consultas por
//   igualdade, documentando o trade-off.
championSchema.index({ slug: 1 });
championSchema.index({ nationality: 1 });

const Champion = db.model('Champion', championSchema);

export default Champion;
