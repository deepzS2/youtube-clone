import { Request, Response } from "express"
import database from "../../database"
import { verifyToken } from "../middleware"
import fs from "fs"
import { JsonWebTokenError } from "jsonwebtoken"
import { dislike, like } from "../utils/likesAndDislikes"

export default {
  /**
   * Delete video
   */
  deleteVideo: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const video = await database.Video.findByPk(id, {
        include: {
          all: true,
          attributes: {
            exclude: ["password"],
          },
        },
        attributes: {
          exclude: ["file"],
        },
      })

      if (video) {
        const token =
          req.cookies.token || req.headers.authorization?.split(" ")[1]
        const user_id = verifyToken(token)

        if (user_id !== video.user_id) {
          return res.status(401).send({
            error: `You're not the owner of this video!`,
          })
        } else {
          await video.destroy()

          return res.send({
            message: "Video deleted!",
          })
        }
      } else {
        return res.status(404).send({
          error: "Video not found!",
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
   * Upload route!
   * Upload the video, with title and description.
   * Needs to be in multipart/form-data
   */
  upload: async (req: Request, res: Response) => {
    const { file } = req
    const { title, description } = req.body

    if (!file) {
      return res.status(400).send({
        error: `You didn't provide a file`,
      })
    }

    if (file.mimetype !== "video/mp4") {
      return res.status(400).send({
        error: `You send a invalid video!`,
      })
    }

    if (!title || !description) {
      return res.status(400).send({
        error: `Please provide a title and description of the video`,
      })
    }

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    try {
      const id = verifyToken(token)

      await database.Video.create({
        file: file.buffer,
        title,
        description,
        user_id: id,
      })

      return res.send({
        message: `Video created successfully!`,
      })
    } catch (error) {
      console.error(error)

      if (error instanceof JsonWebTokenError) {
        return res.status(401).send({
          error: "Invalid token!",
        })
      }

      return res.status(500).send({
        error: `Something went wrong! Please try again later...`,
      })
    }
  },

  /**
   * Get video route!
   * Returns the video information provided in param /:id
   */
  getVideo: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const video = await database.Video.findByPk(id, {
        include: {
          all: true,
          attributes: {
            exclude: ["password"],
          },
        },
        attributes: {
          exclude: ["file"],
        },
      })

      if (video) {
        return res.send(video)
      } else {
        return res.status(404).send({
          error: "Video not found!",
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
   * Watch video route!
   * Creates a temporary file to stream the video, after that the file is deleted.
   */
  watch: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const video = await database.Video.findByPk(id)

      if (video) {
        await video.increment("views")

        const filepath = `./temp/${video.title.replace(/\s+/g, "_")}_id-${
          video.id
        }.mp4`

        fs.writeFile(filepath, video.file, (err) => {
          if (err) throw err

          fs.stat(filepath, (err, stats) => {
            if (err) {
              console.error(err)
              return res.status(404).send({
                error: `Video not found...`,
              })
            }

            const { range } = req.headers
            const { size } = stats
            const start = Number(
              (range || "").replace(/bytes=/, "").split("-")[0]
            )
            const end = size - 1
            const chunkSize = end - start + 1

            res.set({
              "Content-Range": `bytes ${start}-${end}/${size}`,
              "Accept-Ranges": "bytes",
              "Content-Length": chunkSize,
              "Content-Type": "video/mp4",
            })

            res.status(206)

            const stream = fs.createReadStream(filepath, { start, end })

            stream.on("open", () => stream.pipe(res))

            stream.on("end", () => {
              fs.unlinkSync(filepath)
            })

            stream.on("error", (streamErr) => res.end(streamErr))
          })
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
   * Like the video
   */
  like: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const video = await database.Video.findByPk(id, {
        include: {
          all: true,
          attributes: {
            exclude: ["password"],
          },
        },
        attributes: {
          exclude: ["file"],
        },
      })

      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1]
      const user_id = verifyToken(token)

      if (video) {
        const liked = await like(video, user_id, video.id)

        if (liked) {
          return res.send({
            message: "Video liked successfully!",
          })
        } else {
          return res.status(400).send({
            error: "You already liked this video!",
          })
        }
      } else {
        return res.status(404).send({
          error: "Video not found!",
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
   * If already liked, dislike the video
   */
  dislike: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const video = await database.Video.findByPk(id, {
        include: {
          all: true,
          attributes: {
            exclude: ["password"],
          },
        },
        attributes: {
          exclude: ["file"],
        },
      })

      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1]
      const user_id = verifyToken(token)

      if (video) {
        const disliked = await dislike(video, user_id, video.id)
        if (disliked) {
          return res.send({
            message: "Video disliked successfully!",
          })
        } else {
          return res.status(400).send({
            message: "You didn't liked this video!",
          })
        }
      } else {
        return res.status(404).send({
          error: "Video not found!",
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
