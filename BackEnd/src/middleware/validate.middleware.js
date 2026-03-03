/**
 * @file validate.middleware.js
 * @description Request validation using express-validator.
 */
const { validationResult } = require('express-validator');

/**
 * Check results from preceding express-validator chains; reject with 400
 * if any errors are present.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};

module.exports = { validate };
