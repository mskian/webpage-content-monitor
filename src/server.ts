import express, { Application, Request, Response } from 'express';
import path from 'path';
import router from "./routes";
import errorHandler from './utils/errorHandler';

const app: Application = express();
const PORT = process.env.PORT || 6026;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
app.use("/api", router);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Resource not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
