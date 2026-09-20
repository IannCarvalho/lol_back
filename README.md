# LoL Back

API em Node.js/Express que serve dados de League of Legends (campeões e facções/regiões) a partir de um MongoDB previamente populado pelo script `data_retrival/setup_database.py` do [lol_front](https://github.com/IannCarvalho/lol_front).

## Stack

- Node.js (ESM nativo, requer Node 18+)
- Express 5
- Mongoose 9 (MongoDB)

## Estrutura

```
lol_back/
├── app.js              # bootstrap do Express
├── index.js            # agrega os routers (/champion, /nationality)
├── controllers/        # rotas HTTP (champion, nationality)
├── services/           # regras de negócio (champion, nationality)
├── models/             # schemas Mongoose
├── lib/database.js     # conexão com o MongoDB
└── util.js             # helpers (mapeamento de erro -> status HTTP)
```

## Setup

```bash
npm install
cp .env_template .env   # e preencha os valores
```

Variáveis de ambiente (`.env`):

| Variável    | Descrição                          |
|-------------|------------------------------------|
| `PORT`      | Porta do servidor (default 5000)   |
| `MONGO_URL` | Connection string do MongoDB       |

## Rodando

```bash
# desenvolvimento (hot reload via node --watch)
npm run dev

# produção
npm start
```

> O projeto usa ESM nativo do Node (`"type": "module"` no `package.json`), sem step de build. O `dotenv` carrega o `.env` automaticamente.

Health check: `GET /status` → `Status: Running`.

## Endpoints

- `GET /nationality/` — lista todas as regiões/facções
- `GET /nationality/:name` — detalhe de uma região
- `GET /nationality/champions/:nationality` — campeões de uma região
- `GET /champion/:name` — detalhe de um campeão

## Populando o banco

Os dados de campeões e facções vêm do script `data_retrival/setup_database.py` (no repositório `lol_front`), que busca as informações nas APIs públicas da Riot (Universe) e DDragon e insere nas coleções `champions` e `nationalities`.

## Testes

O projeto usa [Vitest](https://vitest.dev/) + [Supertest](https://github.com/ladjs/supertest). Os testes cobrem os helpers de `util.js` e as rotas de `champion`/`nationality` (com os services mockados, sem tocar o MongoDB).

```bash
# roda a suíte uma vez
npm test

# modo watch
npm run test:watch
```

Os testes ficam em `tests/`.
