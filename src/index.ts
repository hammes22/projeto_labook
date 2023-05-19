import cors from "cors";
import express from "express";
import { Request, Response } from "express";
import { brandsRouter } from "./router/brandRouter";

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3003, () => console.log("Servidor rodando na porta 3003"));

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send("pong");
  } catch (error) {
    res.status(400).send("error");
  }
});

app.use("/brands", brandsRouter);
