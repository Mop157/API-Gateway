const express = require('express');
const authRoutes = require('./routes/authRoutes');
const compression = require('compression');

const app = express();
app.use(express.json());
app.use(compression())
app.use('/auth', authRoutes);

const config = require('./config/config');
app.listen(config.port, () => console.log(`Auth microservice running on port ${config.port}`));