import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import dotenv from "dotenv"
import cors from "cors"
import jwt from "express-jwt"
import { fromCookieOrHeader } from "./middleware"
import routes from "./routes"

// .env
dotenv.config()

const app = express()

// CORS
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie parser with express-jwt
app.use(cookieParser())
app.use(
  jwt({
    secret: process.env.SECRET as string,
    credentialsRequired: false,
    getToken: fromCookieOrHeader,
    algorithms: [`HS256`],
  }).unless({
    path: [`/register`, `/login`, `/csrf-token`],
  })
)

// Routes
app.use(routes)

// Logger
app.use(morgan(`dev`))

export default app
