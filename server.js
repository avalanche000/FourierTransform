"use strict";

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get('/display', (req, res) => {
  res.sendFile(path.join(__dirname, "views/display.html"));
});

app.listen(3000, () => {
  console.log('listening on *:3000');
});
