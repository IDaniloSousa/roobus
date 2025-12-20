// socket-server.js
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 3001;

const httpServer = createServer((req, res) => {
  res.writeHead(200);
  res.end("RooBus Socket is Alive!");
});

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Permite conexão de qualquer lugar (Vercel/Local)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("driver-location", (data) => {
    // Quando o motorista envia a posição, repassa para todos os outros clientes
    socket.broadcast.emit("update-bus-position", data);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket RooBus rodando na porta ${PORT}`);
});
