const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

const PORT = process.env.PORT || 3000;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "PLC2026";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "plc-admin-token-2026";

const supabase = createClient(
  "https://kpjuerikmmajqyxcocos.supabase.co",
  "sb_publishable_Jkj-377OvvQXVtiR-Vdikw_FJbPQ_zs"
);

app.use(cors({ origin: "*" }));
app.use(express.json());

function checkAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];

  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({
      message: "无管理员权限"
    });
  }

  next();
}

app.get("/", (req, res) => {
  res.send("PLC凉皮杯后端运行中");
});

app.post("/admin/login", (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    return res.json({
      token: ADMIN_TOKEN
    });
  }

  res.status(401).json({
    message: "密码错误"
  });
});

app.get("/players", async (req, res) => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("score", { ascending: false });

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.post("/players", checkAdmin, async (req, res) => {
  const { nickname, score, number } = req.body;

  if (!nickname || score === undefined) {
    return res.status(400).json({
      message: "昵称和成绩不能为空"
    });
  }

  const { data, error } = await supabase
    .from("players")
    .insert([
      {
        nickname,
        score: Number(score),
        number
      }
    ])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.put("/players/:id", checkAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { nickname, score, number } = req.body;

  if (!nickname || score === undefined) {
    return res.status(400).json({
      message: "昵称和成绩不能为空"
    });
  }

  const { data, error } = await supabase
    .from("players")
    .update({
      nickname,
      score: Number(score),
      number
    })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.delete("/players/:id", checkAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const { error } = await supabase
    .from("players")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json(error);
  }

  res.json({
    success: true
  });
});

app.get("/players/:id/comments", async (req, res) => {
  const playerId = Number(req.params.id);

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("player_id", playerId)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.post("/players/:id/comments", async (req, res) => {
  const playerId = Number(req.params.id);
  const { nickname, content } = req.body;

  if (!nickname || !content) {
    return res.status(400).json({
      message: "昵称和评论不能为空"
    });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        player_id: playerId,
        nickname,
        content
      }
    ])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
