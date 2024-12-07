import express from "express";
import compression from "compression";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import config from "./config/config";

interface corsinterface {
  origin: string
  methods: string
}

const corsOptions: corsinterface = {
    origin: 'http://localhost:3000',
    methods: 'GET,PUT,PATCH,POST,DELETE'
  };

const app = express();

app.use(cors(corsOptions))
app.use(express.json());
app.use(compression())

app.use('/auth', authRoutes);

app.listen(config.port, () => console.log(`стартует на порту ${config.port}`));