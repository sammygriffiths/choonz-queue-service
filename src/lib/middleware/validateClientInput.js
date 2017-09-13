'use strict';

const ClientValidationError = require('../../../src/lib/errors/ClientValidationError');

module.exports = (schema) => (req, res, next) => {
    const result = schema.validate(req);

    if (result.error) {
        return next(new ClientValidationError(result.error.message));
    } else {
        return next();
    }
};
