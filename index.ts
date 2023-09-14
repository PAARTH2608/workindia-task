import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./api/routes";
import { sequelize } from "./api/config/connectDB";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((error: any) => {
    console.error("Error syncing database", error);
  });

app.use("/api", router);

// app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is Running at http://localhost:${port}`);
});
