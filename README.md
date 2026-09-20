# LoL Back

API em Node.js/Express que serve dados de League of Legends. Tem duas responsabilidades:

1. **Dados de campeões/facções** (`champion`, `nationality`) — lidos de um MongoDB previamente populado pelo script `data_retrival/setup_database.py` do [lol_front](https://github.com/IannCarvalho/lol_front).
2. **Proxy da Riot API** (`summoner`, `match`) — encaminha chamadas para a API oficial da Riot usando uma API key.

## Stack

- Node.js + Express 4
- Mongoose (MongoDB)
- Babel (`@babel/node`) para suporte a ESM

## Estrutura

```
lol_back/
├── app.js              # bootstrap do Express
├── index.js            # agrega os routers (/summoner, /match, /champion, /nationality)
├── axios.js            # instância axios apontando para a Riot API
├── controllers/        # rotas HTTP
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

| Variável      | Descrição                                      |
|---------------|------------------------------------------------|
| `LOL_API_KEY` | API key da Riot (https://developer.riotgames.com) |
| `PORT`        | Porta do servidor (default 5000)               |
| `MONGO_URL`   | Connection string do MongoDB                   |

## Rodando

```bash
# desenvolvimento (hot reload)
npm run dev

# produção
npm run build
npm start
```

Health check: `GET /status` → `Status: Running`.

## Endpoints

### Champion / Nationality (MongoDB)
- `GET /nationality/` — lista todas as regiões/facções
- `GET /nationality/:name` — detalhe de uma região
- `GET /nationality/champions/:nationality` — campeões de uma região
- `GET /champion/:name` — detalhe de um campeão

### Summoner / Match (proxy Riot API)
- `GET /summoner/by_name/:summonerName`
- `GET /summoner/by_puuid/:encryptedPUUID`
- `GET /summoner/:encryptedSummonerId`
- `GET /summoner/champion_masteries/:encryptedSummonerId`
- `GET /match/match_general_details/:matchId`
- `GET /match/match_lists/:encryptedAccountId`

## ⚠️ Limitação conhecida: endpoints da Riot desatualizados

Os controllers `summoner` e `match` usam endpoints legados da Riot que **foram descontinuados**:

- `summoner-v4/by-name` foi removido (busca por nome não é mais suportada; use Riot ID via `account-v1`).
- `match-v4` foi substituído por `match-v5`, que usa `PUUID` e *regional routing* (`americas`/`asia`/`europe`) em vez do host de plataforma (`br1`).

As rotas de `champion`/`nationality` (baseadas no MongoDB) continuam funcionando normalmente. Para reativar as rotas de summoner/match é necessário migrar para a v5 da Riot API.
