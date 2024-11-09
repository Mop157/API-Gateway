require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3200,
    jwtSecret: process.env.JWT_SECRET,
};
