// server.js
import http from "http";
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./utils/connect.js";
import setupWebSocketServer from "./websocket/websocketServer.js";

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  const server = http.createServer(app);

  setupWebSocketServer(server);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
