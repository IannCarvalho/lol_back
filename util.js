const catchFormatValidation = (error) => {
    const formatted = formatError(error);
    if (formatted) {
        throw new Error(formatted);
    }
};

const checkNotFound = (object, name) => {
    if (object === null) {
        throw new Error(`${name} not found.`);
    }
};

const getErrorCode = (errorMessage) => {
    let code = 400;
    if (errorMessage.includes('not found')) {
        code = 404;
    } else if (errorMessage.includes('not allowed')) {
        code = 403;
    }
    return code;
};

export {
    catchFormatValidation,
    checkNotFound,
    getErrorCode,
};