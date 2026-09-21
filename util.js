// Utilitários compartilhados: erros tipados, tradução de erros do Mongoose,
// verificação de "não encontrado" e escape de entrada para regex.

// Erro de aplicação com código HTTP associado. Em vez de adivinhar o status a
// partir do texto da mensagem, cada erro carrega o seu próprio statusCode.
class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
    }
}

// 404: recurso não encontrado.
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

// 400: entrada inválida (ex.: erro de cast/validação do Mongoose).
class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}

// Traduz um erro do Mongoose em uma mensagem amigável. Retorna null quando não
// há erro (permite tratar "sem erro" sem lançar).
const formatError = (error) => {
    if (!error) {
        return null;
    }
    // Erros de cast do Mongoose (ex.: id/valor malformado) -> tratados como
    // requisição inválida.
    if (error.name === 'CastError') {
        return `Invalid value for field '${error.path}'.`;
    }
    if (error.name === 'ValidationError') {
        return 'Validation failed.';
    }
    return error.message || 'Unexpected error.';
};

// Usado em `.catch(...)` de uma query Mongoose: formata o erro e o re-lança
// como BadRequestError. Se não houver erro, não faz nada.
const catchFormatValidation = (error) => {
    const formatted = formatError(error);
    if (formatted) {
        throw new BadRequestError(formatted);
    }
};

// Lança NotFoundError quando o resultado da busca é nulo.
const checkNotFound = (object, name) => {
    if (object === null) {
        throw new NotFoundError(`${name} not found.`);
    }
};

// Deriva o código HTTP de um erro. Erros tipados (AppError) trazem o próprio
// statusCode; erros inesperados viram 500. Mantido para compatibilidade e para
// uso pelo middleware central de erro.
const getErrorCode = (error) => {
    // Compatibilidade: aceita tanto um Error tipado quanto uma string de
    // mensagem (assinatura antiga). String -> heurística por conteúdo.
    if (typeof error === 'string') {
        if (error.includes('not found')) return 404;
        if (error.includes('not allowed')) return 403;
        return 400;
    }
    if (error && typeof error.statusCode === 'number') {
        return error.statusCode;
    }
    return 500;
};

// Escapa caracteres especiais de regex para que a entrada do usuário seja
// tratada como texto literal em consultas $regex (evita injeção de regex/ReDoS).
const escapeRegex = (input = '') =>
    String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export {
    AppError,
    NotFoundError,
    BadRequestError,
    catchFormatValidation,
    checkNotFound,
    getErrorCode,
    escapeRegex,
};
