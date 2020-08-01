import {
  Sequelize,
  Model,
  DataTypes,
  Association,
  Optional,
  UUIDV4,
} from "sequelize"
import User from "./user"
import connection from "../database"
import Video from "./videos"

interface CommentsLikesListAttributes {
  id: string
  comment_id: string
  user_id: string
}

interface CommentsLikesListCreationAttributes
  extends Optional<CommentsLikesListAttributes, "id"> {}

class CommentsLikesList extends Model<
  CommentsLikesListAttributes,
  CommentsLikesListCreationAttributes
> {
  public id!: string
  public comments_id!: string
  public user_id!: string

  public static associations: {
    comment: Association<CommentsLikesList, Video>
    user: Association<CommentsLikesList, User>
  }
}

CommentsLikesList.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    comment_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
  },
  {
    sequelize: connection as Sequelize,
    tableName: `CommentsLikesLists`,
    modelName: `CommentsLikesList`,
  }
)

export default CommentsLikesList
