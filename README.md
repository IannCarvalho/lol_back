# LoL Back

API em Node.js/Express que serve dados de League of Legends (campeões e facções/regiões) a partir de um MongoDB previamente populado pelo script `data_retrival/setup_database.py` do [lol_front](https://github.com/IannCarvalho/lol_front).

## Stack

- Node.js + Express 4
- Mongoose (MongoDB)
- Babel (`@babel/node`) para suporte a ESM

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
# desenvolvimento (hot reload)
npm run dev

# produção
npm start
```

> `start` roda a aplicação com `babel-node` (transpila em tempo de execução). O `.gitignore` inclui `dist/` caso você adicione um step de build compilado no futuro.

Health check: `GET /status` → `Status: Running`.

## Endpoints

- `GET /nationality/` — lista todas as regiões/facções
- `GET /nationality/:name` — detalhe de uma região
- `GET /nationality/champions/:nationality` — campeões de uma região
- `GET /champion/:name` — detalhe de um campeão

## Populando o banco

Os dados de campeões e facções vêm do script `data_retrival/setup_database.py` (no repositório `lol_front`), que busca as informações nas APIs públicas da Riot (Universe) e DDragon e insere nas coleções `champions` e `nationalities`.
