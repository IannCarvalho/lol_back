// Middlewares Express compartilhados: wrapper de handlers assíncronos e o
// tratador de erros central.

import { getErrorCode } from './util.js';

// Envolve um handler assíncrono e encaminha qualquer rejeição para o
// middleware de erro (via next), eliminando o try/catch repetido em cada rota.
export const asyncHandler = (handler) => (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);

// Tratador de erro central. Deriva o status do próprio erro (AppError traz
// statusCode; inesperados viram 500) e responde sempre com { message }.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, req, res, next) => {
    const code = getErrorCode(error);
    const message = error && error.message ? error.message : 'Unexpected error.';
    res.status(code).send({ message });
};
