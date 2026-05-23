const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DB_PATH = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PLC凉皮杯后端运行中");
});

function readDB() {
  return fs.readJsonSync(DB_PATH);
}

function writeDB(data) {
  fs.writeJsonSync(DB_PATH, data, { spaces: 2 });
}

app.get("/players", (req, res) => {
  const db = readDB();

  const sorted = db.players.sort((a, b) => b.score - a.score);

  res.json(sorted);
});

app.post("/players", (req, res) => {
  const db = readDB();

  const player = {
    id: Date.now(),
    ...req.body
  };

  db.players.push(player);

  writeDB(db);

  res.json(player);
});

app.put("/players/:id", (req, res) => {
  const db = readDB();

  const id = Number(req.params.id);

  db.players = db.players.map((p) =>
    p.id === id ? { ...p, ...req.body } : p
  );

  writeDB(db);

  res.json({ success: true });
});

app.delete("/players/:id", (req, res) => {
  const db = readDB();

  const id = Number(req.params.id);

  db.players = db.players.filter((p) => p.id !== id);

  writeDB(db);

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});