import express from "express";
import path from "path";

const app = express();

app.get("/api", (_request, response) => {
  response.send({ hello: "World" });
});

app.get("/api/ingo", (_request, response) => {
  response.send({ bestInThe: "World" });
});

app.use(express.static(path.join(path.resolve(), "dist")));

app.listen(3000, () => {
  console.log("Redo på http://localhost:3000/");
});
