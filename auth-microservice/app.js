const express = require('express');
const authRoutes = require('./routes/authRoutes');
const compression = require('compression');
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,PUT,PATCH,POST,DELETE'
  };

const app = express();
app.use(cors(corsOptions))
app.use(express.json());
app.use(compression())
app.use('/auth', authRoutes);

const config = require('./config/config');
app.listen(config.port, () => console.log(`Auth microservice running on port ${config.port}`));