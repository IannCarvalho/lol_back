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
// - `slug`: usado em GET /champion/:slug via findOne({ slug }) — match EXATO
//   sensível a caixa, então o índice simples é aproveitado. NÃO é `unique`: a
//   semeadura dos dados é externa (data_retrival/*) e nada neste código garante
//   unicidade; um índice único poderia quebrar o seed caso surjam duplicatas.
// - `nationality`: usado em GET /nationality/champions/:nationality via
//   find({ nationality }) com collation case-insensitive. A query trocou o
//   $regex /i por igualdade + collation, que USA o índice; o índice declara a
//   mesma collation (locale 'en', strength 2) para ser aproveitado.
championSchema.index({ slug: 1 });
championSchema.index({ nationality: 1 }, { collation: { locale: 'en', strength: 2 } });

const Champion = db.model('Champion', championSchema);

export default Champion;
