// Middlewares Express compartilhados: cache HTTP e o tratador de erros central.
//
// NOTA: nao ha mais um asyncHandler. No Express 5 o router ja encaminha
// promises rejeitadas de um handler `async` para o error handler
// automaticamente, entao o wrapper era redundante — os handlers usam `async`
// direto e o try/catch some.

import { getErrorCode } from './util.js';

// Fabrica de middleware de cache HTTP. Os dados (campeoes/nacionalidades) sao
// estaticos entre re-seeds do banco, entao um Cache-Control conservador deixa
// o browser/CDN reaproveitar as respostas sem bater no backend a cada request.
// Aplicado so nas rotas GET de dados — NUNCA no /status (health check), que
// precisa refletir o estado atual do servico. maxAge em segundos.
export const cacheControl = (maxAge = 600) => (req, res, next) => {
    res.set('Cache-Control', `public, max-age=${maxAge}`);
    next();
};

// Tratador de erro central. Deriva o status do proprio erro (AppError traz
// statusCode; inesperados viram 500) e responde sempre com { message }.
// Para 5xx: loga o erro completo no servidor e responde uma mensagem generica
// (nao vaza stack/mensagem interna). Para 4xx: devolve a message do erro.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, req, res, next) => {
    // Guard padrao do Express: se a resposta ja comecou, delega ao handler
    // default (que fecha a conexao) em vez de tentar reescrever os headers.
    if (res.headersSent) {
        return next(error);
    }

    const code = getErrorCode(error);

    if (code >= 500) {
        console.error(error);
        return res.status(code).send({ message: 'Internal server error.' });
    }

    const message = error && error.message ? error.message : 'Unexpected error.';
    return res.status(code).send({ message });
};
