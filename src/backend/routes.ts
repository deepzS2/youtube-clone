import { Router } from "express"
import AuthenticationController from "./controllers/AuthenticationController"
import CommentsController from "./controllers/CommentsController"
import VideosController from "./controllers/VideosController"
import UserController from "./controllers/UserController"
import csrf from "csurf"
import { middleware } from "./middleware"
import upload from "./upload"

const router = Router()

// CSRF protection attack
const csrfProtection = csrf({
  cookie: true,
})

router.use(csrfProtection)

// Authentication routes
router.get(`/csrf-token`, AuthenticationController.csrfToken)
router.post(`/login`, AuthenticationController.login)
router.post(`/register`, AuthenticationController.register)
router.get(`/logout`, middleware, AuthenticationController.logout)

// Videos routes
router.post(
  `/video`,
  middleware,
  upload.single(`file`),
  VideosController.upload
)
router.get(`/watch/:id`, VideosController.watch)
router.get(`/video/:id`, VideosController.getVideo)
router.delete(`/video/:id`, middleware, VideosController.deleteVideo)
router.put(`/video/:id/like`, middleware, VideosController.like)
router.put(`/video/:id/dislike`, middleware, VideosController.dislike)

// User routes
router.get(`/users`, UserController.index)
router.get(`/users/me`, middleware, UserController.profile)
router.get(`/users/:id`, UserController.getUser)
router.put("/users/:id/subscribe", middleware, UserController.subscribeToUser)
router.put(
  "/users/:id/unsubscribe",
  middleware,
  UserController.unsubscribeToUser
)
router.delete(`/me`, middleware, UserController.deleteUser)

// Comment routes
router.get(`/video/:video_id/comments`, CommentsController.getComments)
router.post(
  "/video/:video_id/comment",
  middleware,
  CommentsController.commentVideo
)
router.put("/comments/:comment_id/like", middleware, CommentsController.like)
router.put(
  "/comments/:comment_id/dislike",
  middleware,
  CommentsController.dislike
)
router.put(
  "/comments/:comment_id/heart",
  middleware,
  CommentsController.heartComment
)
router.put(
  "/comments/:comment_id/fix",
  middleware,
  CommentsController.fixComment
)
router.delete(
  "/comments/:comment_id",
  middleware,
  CommentsController.deleteComment
)

export default router
