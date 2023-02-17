import express, { Request, Response } from "express";
import dotenv from "dotenv";
import route from "./routes";

dotenv.config();
const { PORT } = process.env;

//Create instance server
const app: express.Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
  res.send("Homepage of Store");
});

app.use("/", route);

app.get("/*", (req: express.Request, res: express.Response): void => {
  res.status(404).send("Page is Not Found");
});

//start express server
app.listen(PORT, () => {
  console.log(`Server is working on port ${PORT}`);
});

export default app;
