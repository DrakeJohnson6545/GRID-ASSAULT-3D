import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  // Simple multiplayer state
  const players: Record<string, any> = {};

  io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    // Initialize player
    players[socket.id] = {
      id: socket.id,
      position: [0, 5, 0],
      rotation: [0, 0, 0],
      health: 100,
      score: 0,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };

    // Send existing players to the new player
    socket.emit("players-init", players);

    // Broadcast new player to others
    socket.broadcast.emit("player-joined", players[socket.id]);

    socket.on("move", (data) => {
      if (players[socket.id]) {
        players[socket.id].position = data.position;
        players[socket.id].rotation = data.rotation;
        socket.broadcast.emit("player-moved", {
          id: socket.id,
          position: data.position,
          rotation: data.rotation,
        });
      }
    });

    socket.on("shoot", (data) => {
      // Broadcast shoot event (for muzzle flash, etc.)
      socket.broadcast.emit("player-shot", { id: socket.id, target: data.target });
    });

    socket.on("hit", (data) => {
      const { targetId, damage } = data;
      if (players[targetId]) {
        players[targetId].health -= damage;
        if (players[targetId].health <= 0) {
          players[targetId].health = 100;
          players[targetId].position = [Math.random() * 20 - 10, 5, Math.random() * 20 - 10];
          players[socket.id].score += 1;
          io.emit("player-respawn", {
            id: targetId,
            health: 100,
            position: players[targetId].position,
            killerId: socket.id,
            killerScore: players[socket.id].score
          });
        } else {
          io.emit("player-health-update", {
            id: targetId,
            health: players[targetId].health,
          });
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Player disconnected:", socket.id);
      delete players[socket.id];
      io.emit("player-left", socket.id);
    });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
