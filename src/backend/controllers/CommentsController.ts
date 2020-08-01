import { Request, Response } from "express"
import database from "../../database"
import { verifyToken } from "../middleware"
import { like, dislike } from "../utils/likesAndDislikes"

export default {
  /**
   * Fix the comment to the top of the list
   */
  fixComment: async (req: Request, res: Response) => {
    const { comment_id } = req.params

    try {
      const fixed = await database.Comment.findOne({
        where: {
          fixed: true,
        },
      })

      if (fixed) {
        return res.status(400).send({
          error: `A comment already has been fixed!`,
        })
      }

      const comment = await database.Comment.findByPk(comment_id)

      if (!comment) {
        return res.status(404).send({
          error: "Comment not found!",
        })
      }

      const video = await comment.getVideo()

      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1]
      const id = verifyToken(token)

      if (video.user_id !== id) {
        return res.status(400).send({
          error: `You're not the owner of this video to fix the comment!`,
        })
      }

      await comment.update({
        fixed: true,
      })

      return res.send({
        message: `Successfully fixed the comment!`,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        error: `Something went wrong! please try again later...`,
      })
    }
  },

  /**
   * Heart react a comment if you're the video owner
   */
  heartComment: async (req: Request, res: Response) => {
    const { comment_id } = req.params

    try {
      const comment = await database.Comment.findByPk(comment_id)

      if (!comment) {
        return res.status(404).send({
          error: "Comment not found!",
        })
      }

      const video = await comment.getVideo()

      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1]
      const id = verifyToken(token)

      if (video.user_id !== id) {
        return res.status(400).send({
          error: `You're not the owner of this video to heart react!`,
        })
      }

      await comment.update({
        heart: true,
      })

      return res.send({
        message: `Successfully heart reacted the comment!`,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        error: `Something went wrong! please try again later...`,
      })
    }
  },

  /**
   * Get the comments from a video
   */
  getComments: async (req: Request, res: Response) => {
    const { video_id } = req.params

    try {
      const video = await database.Video.findByPk(video_id)

      if (!video) {
        return res.status(404).send({
          error: "Video not found!",
        })
      }

      const comments = await database.Comment.findAll({
        where: {
          video_id: video.id,
        },
      })

      return res.send(comments)
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        error: `Something went wrong! please try again later...`,
      })
    }
  },

  /**
   * Comment in a video
   */
  commentVideo: async (req: Request, res: Response) => {
    const { text } = req.body
    const { video_id } = req.params

    if (!text) {
      return res.status(400).send({
        error: "Please provide a text to comment!",
      })
    }

    if (!video_id) {
      return res.status(400).send({
        error: "Please provide a video to comment!",
      })
    }

    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1]

      const id = verifyToken(token)

      const video = await database.Video.findByPk(video_id)

      if (!video) {
        return res.status(404).send({
          error: "Video not found!",
        })
      }

      await database.Comment.create({
        user_id: id,
        video_id: video.id,
        text,
      })

      return res.send({
        message: "Comment created successfully!",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        error: `Something went wrong! please try again later...`,
      })
    }
  },

  /**
   * Like comment
   */
  like: async (req: Request, res: Response) => {
    const { comment_id } = req.params

    try {
      const comment = await database.Comment.findByPk(comment_id)

      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1]
      const user_id = verifyToken(token)

      if (comment) {
        const liked = await like(comment, user_id, "", comment.id)

        if (liked) {
          return res.send({
            message: "Comment liked successfully!",
          })
        } else {
          return res.status(400).send({
            error: "You already liked this comment!",
          })
        }
      } else {
        return res.status(404).send({
          error: "Comment not found!",
        })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        error: "Something went wrong! Please try again later...",
      })
    }
  },

  /**
   * Dislike comment
   */
  dislike: async (req: Request, res: Response) => {
    const { comment_id } = req.params

    try {
      const comment = await database.Comment.findByPk(comment_id)

      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1]
      const user_id = verifyToken(token)

      if (comment) {
        const disliked = await dislike(comment, user_id, "", comment.id)

        if (disliked) {
          return res.send({
            message: "Comment disliked successfully!",
          })
        } else {
          return res.send({
            message: "You didn't liked this comment!",
          })
        }
      } else {
        return res.status(404).send({
          error: "Comment not found!",
        })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        error: "Something went wrong! Please try again later...",
      })
    }
  },

  /**
   * Delete comment
   */
  deleteComment: async (req: Request, res: Response) => {
    const { comment_id } = req.params

    try {
      const comment = await database.Comment.findByPk(comment_id)

      if (comment) {
        const token =
          req.cookies.token || req.headers.authorization?.split(" ")[1]
        const user_id = verifyToken(token)

        if (user_id !== comment.user_id) {
          return res.status(401).send({
            error: `You're not the owner of this comment!`,
          })
        } else {
          await comment.destroy()

          return res.send({
            message: "Comment deleted!",
          })
        }
      } else {
        return res.status(404).send({
          error: "Comment not found!",
        })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        error: "Something went wrong! Please try again later...",
      })
    }
  },
}
