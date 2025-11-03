import { WebSocketServer } from "ws";

export default function setupWebSocketServer(server) {
  const wss = new WebSocketServer({ server });
  const sessions = new Map(); // sessionId => Set of clients
  const sessionStates = new Map(); // sessionId => Array of drawing objects

  wss.on("connection", (ws) => {
    let sessionId = null;

    ws.on("message", (message) => {
      let data;
      try {
        data = JSON.parse(message);
      } catch {
        console.error("Invalid JSON:", message);
        return;
      }

      switch (data.type) {
        case "joinSession":
          sessionId = data.sessionId;
          if (!sessions.has(sessionId)) {
            sessions.set(sessionId, new Set());
            sessionStates.set(sessionId, []); // Initialize empty session state
          }
          sessions.get(sessionId).add(ws);
          console.log(`Client joined session: ${sessionId}`);

          // Send full board state to newly connected client
          const currentState = sessionStates.get(sessionId);
          ws.send(
            JSON.stringify({
              type: "syncBoard",
              sessionId,
              boardState: currentState,
            })
          );
          break;

        case "whiteboardDraw":
          if (sessionId && sessions.has(sessionId)) {
            // Add new drawing data to session state
            const state = sessionStates.get(sessionId);
            if (data.payload) {
              state.push(data.payload);
            }

            // Broadcast to other clients in session
            sessions.get(sessionId).forEach((client) => {
              if (client.readyState === client.OPEN && client !== ws) {
                client.send(message);
              }
            });
          }
          break;

        default:
          console.log("Unknown message type:", data.type);
      }
    });

    ws.on("close", () => {
      if (sessionId && sessions.has(sessionId)) {
        sessions.get(sessionId).delete(ws);
        if (sessions.get(sessionId).size === 0) {
          sessions.delete(sessionId);
          sessionStates.delete(sessionId);
        }
        console.log(`Client disconnected from session: ${sessionId}`);
      }
    });
  });

  console.log("WebSocket server initialized");
  return wss;
}
