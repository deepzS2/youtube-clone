import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import database from "../../database"

export default {
  /**
   * Login route!
   * Needs to provide an email and password and it will return a token and set the cookies token
   */
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).send({
        error: `Please provide an email and password`,
      })
    }

    const user = await database.User.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      return res.status(404).send({
        error: `No user registered with that email`,
      })
    }

    const correctPassword = await user?.checkPassword(password)

    if (!correctPassword) {
      return res.status(401).send({
        error: `Invalid password`,
      })
    }

    // UUID is the token!
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.SECRET as string,
      {
        expiresIn: "7d",
      }
    )

    res.cookie(`token`, token, { httpOnly: true })

    return res.send({
      token,
    })
  },

  /**
   * Register route!
   * Need to provide an username, email and password and it will return the user created, if there's no one with the provided email
   */
  register: async (req: Request, res: Response) => {
    const { email, password, username } = req.body

    if (!email || !password || !username) {
      return res.status(400).send({
        error: `Please fill all the fields`,
      })
    }

    const [user, created] = await database.User.findOrCreate({
      where: {
        email,
      },
      defaults: {
        password,
        username,
        email,
      },
    })

    if (!created) {
      return res.status(400).send({
        error: `User already registered with that email`,
      })
    }

    return res.status(200).send(user)
  },

  /**
   * Logout route!
   * Remove the token cookies if the user is authenticated
   */
  logout: async (req: Request, res: Response) => {
    if (req.cookies) {
      res.clearCookie(`token`)
      res.clearCookie(`_csrf`)

      res.status(200).send({
        message: `Logout successfully`,
      })
    } else {
      return res.status(400).send({
        error: `You're not authenticated to logout!`,
      })
    }
  },

  /**
   * CSRF Token route!
   * Get the token to prevents from csrf attacks
   */
  csrfToken: async (req: Request, res: Response) => {
    return res.send({
      csrfToken: req.csrfToken(),
    })
  },
}
