import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

/**
 * Takes the token from header or cookie
 * @param req Request
 */
export function fromCookieOrHeader(req: Request) {
  if (req.cookies) {
    return req.cookies.token
  } else if (
    req.headers.authorization &&
    req.headers.authorization.split(` `)[0] === `Bearer`
  ) {
    return req.headers.authorization.split(` `)[1]
  }

  return null
}

/**
 * Check if user is authenticated
 * @param req Request
 * @param res Response
 * @param next Next Function
 */
export function middleware(req: Request, res: Response, next: NextFunction) {
  if (req.cookies && req.cookies.token) {
    return next()
  } else if (req.headers.authorization) {
    return next()
  } else {
    return res.status(400).send({
      error: `You're not logged in to access this route`,
    })
  }
}

/**
 * Verifies if the token is valid
 * @param token The json web token
 */
export function verifyToken(token: string) {
  // eslint-disable-next-line no-useless-catch
  try {
    const { id } = jwt.verify(token, process.env.SECRET as string) as {
      id: string
    }

    return id
  } catch (error) {
    throw error
  }
}
