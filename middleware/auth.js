const jwt = require('jsonwebtoken');

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('Authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '');
    } else {
        request.token = null;
    }
    next();
};

const userExtractor = async (request, response, next) => {
    try {
        if (request.token) {
            const decodedToken = jwt.verify(request.token, process.env.SECRET);
            if (!decodedToken.id) {
                return response.status(401).json({ error: 'token invalid' });
            }
            request.user = decodedToken;
        }
    } catch (error) {
        return response.status(401).json({ error: 'token invalid' });
    }
    next();
};

module.exports = { tokenExtractor, userExtractor };
