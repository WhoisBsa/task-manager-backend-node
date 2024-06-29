import { configDotenv } from "dotenv";
import express from 'express';

const app = express();
configDotenv();

app.use(express.json());

const PORT = process.env?.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server now listen on port ${PORT}`);
});