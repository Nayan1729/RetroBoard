const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors({
  origin: [
    "https://retroboard-frontend.onrender.com",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST"],
}));

app.use(express.static(path.join(__dirname, "client", "dist")));

const rooms = new Map();

function getRoomCards(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, []);
  }
  return rooms.get(roomId);
}

function broadcastToRoom(roomId, message, excludeWs = null) {
  wss.clients.forEach((client) => {
    if (
      client.readyState === 1 &&
      client.roomId === roomId &&
      client !== excludeWs
    ) {
      client.send(JSON.stringify(message));
    }
  });
}

wss.on("connection", (ws) => {
  ws.roomId = null;

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    const { type } = msg;

    if (type === "join") {
      const { roomId } = msg;
      if (!roomId) return;

      ws.roomId = roomId;
      const cards = getRoomCards(roomId);
      ws.send(JSON.stringify({ type: "init", cards }));
      return;
    }

    if (!ws.roomId) return;
    const roomId = ws.roomId;
    const cards = getRoomCards(roomId);

    switch (type) {
      case "add": {
        const card = {
          id: uuidv4(),
          column: msg.column,
          text: msg.text,
          author: msg.author || "Anonymous",
          createdAt: Date.now(),
        };
        cards.push(card);
        broadcastToRoom(roomId, { type: "card-added", card });
        break;
      }

      case "edit": {
        const idx = cards.findIndex((c) => c.id === msg.id);
        if (idx !== -1) {
          cards[idx].text = msg.text;
          broadcastToRoom(roomId, {
            type: "card-edited",
            id: msg.id,
            text: msg.text,
          });
        }
        break;
      }

      case "delete": {
        const dIdx = cards.findIndex((c) => c.id === msg.id);
        if (dIdx !== -1) {
          cards.splice(dIdx, 1);
          broadcastToRoom(roomId, { type: "card-deleted", id: msg.id });
        }
        if (cards.length === 0) {
          rooms.delete(roomId);
        }
        break;
      }

      default:
        break;
    }
  });

  ws.on("close", () => {
    if (ws.roomId) {
      const roomId = ws.roomId;
      let hasClients = false;
      wss.clients.forEach((client) => {
        if (client.roomId === roomId && client.readyState === 1) {
          hasClients = true;
        }
      });
    }
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
