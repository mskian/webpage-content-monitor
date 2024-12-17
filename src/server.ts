import express from "express";
import router from "./routes";

const app = express();
const PORT = process.env.PORT || 6026;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.use("/api", router);

app.use('/', function(req, res) {
  res.status(404).json({
      error: 1,
      message: 'Page not Found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
