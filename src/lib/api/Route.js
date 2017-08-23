const joi = require('joi');

class Validator {
    constructor() {
        this.schema = joi.object();
        this.validate = (req, res, next) => {
            const result = this.schema.validate();
            
            if (result.error) {
                return next(new Error('This is a 401. FIX ME.'))
            }
            
            return next();

        }
    }
}

module.exports = class Route {
    constructor(handler) {
        if (!handler) throw new Error();

        this.handler = '';
        this.validator = new Validator();
    }
};