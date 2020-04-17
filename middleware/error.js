
const logger = require('../utils/logger');

module.exports = function(error, req, res, next) {
    logger.error(error.stack);
    res.status(500).send('Something happened');
};