import { Request, Response } from "express"
import database from "../../database"
import { verifyToken } from "../middleware"

export default {
  /**
   * Get all users
   */
  index: async (req: Request, res: Response) => {
    try {
      const users = await database.User.findAll({
        attributes: {
          exclude: ["password"],
        },
        include: {
          all: true,
          as: "videos",
          attributes: {
            exclude: ["file"],
          },
        },
      })

      return res.send(users)
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        error: `Something went wrong! please try again later...`,
      })
    }
  },

  /**
   * Get your information
   */
  profile: async (req: Request, res: Response) => {
    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1]

      const id = verifyToken(token)

      const profile = await database.User.findByPk(id, {
        attributes: {
          exclude: ["password"],
        },
        include: {
          all: true,
          as: "videos",
          attributes: {
            exclude: ["file"],
          },
        },
      })

      return res.send(profile)
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        error: `Something went wrong! please try again later...`,
      })
    }
  },

  getUser: async (req: Request, res: Response) => {
    try {
      const user = await database.User.findByPk(req.params.id, {
        attributes: {
          exclude: ["password"],
        },
        include: {
          all: true,
          as: "videos",
          attributes: {
            exclude: ["file"],
          },
        },
      })

      if (!user) {
        return res.status(404).send({
          error: "User not found...",
        })
      }

      return res.send(user)
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        error: `Something went wrong! please try again later...`,
      })
    }
  },

  /**
   * Subscribe to an user
   */
  subscribeToUser: async (req: Request, res: Response) => {
    try {
      const user = await database.User.findByPk(req.params.id, {
        attributes: {
          exclude: ["password"],
        },
        include: {
          all: true,
          as: "videos",
          attributes: {
            exclude: ["file"],
          },
        },
      })

      if (!user) {
        return res.status(404).send({
          error: "User not found...",
        })
      }

      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1]
      const id = verifyToken(token)

      const [_, created] = await database.SubscribedList.findOrCreate({
        where: {
          subscriber_id: id,
          subscribed_id: user.id,
        },
      })

      if (!created) {
        return res.status(400).send({
          error: `You're already subscribed to ${user.username}`,
        })
      }

      await user.increment("subscribers")

      return res.send({
        message: `You subscribed to ${user.username}`,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        error: `Something went wrong! please try again later...`,
      })
    }
  },

  /**
   * Unsubscribe to an user
   */
  unsubscribeToUser: async (req: Request, res: Response) => {
    try {
      const user = await database.User.findByPk(req.params.id, {
        attributes: {
          exclude: ["password"],
        },
        include: {
          all: true,
          as: "videos",
          attributes: {
            exclude: ["file"],
          },
        },
      })

      if (!user) {
        return res.status(404).send({
          error: "User not found...",
        })
      }

      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1]
      const id = verifyToken(token)

      const subList = await database.SubscribedList.findOne({
        where: {
          subscriber_id: id,
          subscribed_id: user.id,
        },
      })

      if (!subList) {
        return res.status(400).send({
          message: "You're not subscribed to this user...",
        })
      }

      await subList.destroy()
      await user.decrement("subscribers")

      return res.send({
        message: `You unsubscribed to ${user.username}`,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        error: `Something went wrong! please try again later...`,
      })
    }
  },

  /**
   * Delete user
   */
  deleteUser: async (req: Request, res: Response) => {
    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1]
      const user_id = verifyToken(token)

      const user = await database.User.findByPk(user_id)

      await user?.destroy()

      return res.send({
        message: "Account deleted successfully!",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).send({
        error: "Something went wrong! Please try again later...",
      })
    }
  },
}
