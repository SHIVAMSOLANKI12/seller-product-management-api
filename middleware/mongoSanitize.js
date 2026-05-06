/**
 * @desc    Custom NoSQL Sanitization Middleware for Express 5
 *          Prevents keys starting with $ or containing . in req.body, req.query, and req.params
 */
const sanitize = (obj) => {
    if (obj instanceof Object) {
        for (const key in obj) {
            if (key.startsWith('$') || key.includes('.')) {
                delete obj[key];
            } else {
                sanitize(obj[key]);
            }
        }
    }
    return obj;
};

const customMongoSanitize = (req, res, next) => {
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    next();
};

export default customMongoSanitize;
