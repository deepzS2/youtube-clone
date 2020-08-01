import app from "./index"
import http from "http"

// Server
const server = http.createServer(app)

// Port
const PORT = Number(process.env.PORT) | 3333

// Listening
server.listen(PORT, () => {
  console.log(`Server online on port ${PORT}`)
})
