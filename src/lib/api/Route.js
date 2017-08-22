module.exports = class Route {
    constructor() {
        this.handler = '';
        this.validator = {
            'schema': '',
            'validate': () => {

            }
        };
    }
};