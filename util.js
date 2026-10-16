// Utilitarios compartilhados: erros tipados, mapeamento de erro do Mongoose e
// verificacao de "nao encontrado".

// Erro de aplicacao com codigo HTTP associado. Em vez de adivinhar o status a
// partir do texto da mensagem, cada erro carrega o seu proprio statusCode.
class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
    }
}

// 404: recurso nao encontrado.
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

// 400: entrada invalida (ex.: erro de cast/validacao do Mongoose).
class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}

// Usado em `.catch(...)` de uma query Mongoose. SO erros que representam
// entrada invalida do cliente viram BadRequestError (400): CastError (valor
// malformado para o tipo do campo) e ValidationError. Qualquer outro erro
// (ex.: MongooseServerSelectionError/rede/timeout no cold start) e re-lancado
// INTACTO para virar 5xx no handler central — um banco fora do ar e falha do
// servidor, nao do cliente, e nao deve vazar a mensagem interna como 400.
const mapMongooseError = (error) => {
    if (!error) {
        return;
    }
    if (error.name === 'CastError') {
        throw new BadRequestError(`Invalid value for field '${error.path}'.`);
    }
    if (error.name === 'ValidationError') {
        throw new BadRequestError('Validation failed.');
    }
    throw error;
};

// Lanca NotFoundError quando o resultado da busca e nulo. Usado nos findOne
// (recurso unico). NAO usar em find() (lista): array vazio e 200 [] valido.
const checkNotFound = (object, name) => {
    if (object === null) {
        throw new NotFoundError(`${name} not found.`);
    }
};

// Deriva o codigo HTTP de um erro para o middleware central. Erros tipados
// (AppError) trazem o proprio statusCode; qualquer outro vira 500.
const getErrorCode = (error) =>
    (error && typeof error.statusCode === 'number') ? error.statusCode : 500;

export {
    AppError,
    NotFoundError,
    BadRequestError,
    mapMongooseError,
    checkNotFound,
    getErrorCode,
};
