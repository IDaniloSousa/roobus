import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server, Socket } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  io.on('connection', (socket: Socket) => {
    // Escuta quando um motorista envia dados
    socket.on('driver-location', (data: any) => {
      // Repassa para todos os outros clientes
      socket.broadcast.emit('update-bus-position', data);
    });
  });

  const PORT = 3000;
  server.listen(PORT, (err?: any) => {
    if (err) throw err;
    console.log(`> Servidor RooBus rodando em http://localhost:${PORT}`);
  });
});