import { Router } from "express"
import AuthenticationController from "./controllers/AuthenticationController"
import VideosController from "./controllers/VideosController"
import csrf from "csurf"
import { middleware, verifyToken } from "./middleware"
import upload from "./upload"

const router = Router()

// CSRF protection attack
const csrfProtection = csrf({
  cookie: true,
})

router.use(csrfProtection)

router.get(`/`, middleware, async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    const result = verifyToken(token)

    return res.status(200).send({
      helloworld: `uuid: ${result}`,
    })
  } catch (error) {
    return res.status(500).send()
  }
})

// Authentication routes
router.get(`/csrf-token`, AuthenticationController.csrfToken)
router.post(`/login`, AuthenticationController.login)
router.post(`/register`, AuthenticationController.register)
router.get(`/logout`, AuthenticationController.logout)

// Videos routes
router.post(
  `/video`,
  middleware,
  upload.single(`file`),
  VideosController.upload
)
router.get(`/watch/:id`, VideosController.watch)
router.get(`/video/:id`, VideosController.getVideo)

export default router
