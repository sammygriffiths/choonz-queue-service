'use strict';

module.exports = class ClientValidationError extends Error {
    constructor(...args) {
        super(...args);

        this.name = 'ClientValidationError';

        this.statusCode = 400;

        this.response = {
            error: 'validation',
            data: this.message,
        };
    }
};
