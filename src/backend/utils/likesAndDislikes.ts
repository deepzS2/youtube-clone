import connection from "../../database"

export async function like(
  model: any,
  user_id: string,
  video_id: string = "",
  comment_id: string = ""
): Promise<boolean | undefined> {
  try {
    if (!comment_id) {
      const [_, created] = await connection.VideosLikesList.findOrCreate({
        where: {
          user_id,
          video_id,
        },
      })

      if (!created) {
        return false
      }

      await model.increment("likes")
      return true
    } else {
      const [_, created] = await connection.CommentsLikesList.findOrCreate({
        where: {
          user_id,
          comment_id,
        },
      })

      if (!created) {
        return false
      }

      await model.increment("likes")
      return true
    }
  } catch (error) {
    console.error(`Error on the like function`)
    throw error
  }
}

export async function dislike(
  model: any,
  user_id: string,
  video_id: string = "",
  comment_id: string = ""
): Promise<boolean | undefined> {
  try {
    if (!comment_id) {
      const like = await connection.VideosLikesList.findOne({
        where: {
          user_id,
          video_id,
        },
      })

      if (!like) {
        return false
      }

      like.destroy()
      await model.decrement("likes")
      return true
    } else {
      const like = await connection.CommentsLikesList.findOne({
        where: {
          user_id,
          comment_id,
        },
      })

      if (!like) {
        return false
      }

      like.destroy()
      await model.decrement("likes")
      return true
    }
  } catch (error) {
    console.error(`Error on the dislike function`)
    throw error
  }
}
