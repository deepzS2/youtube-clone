import connection from "../database"
import {
  Model,
  DataTypes,
  Sequelize,
  UUIDV4,
  Optional,
  Association,
  BelongsToGetAssociationMixin,
} from "sequelize"
import Videos from "./videos"
import User from "./user"

interface CommentAttributes {
  id: string
  user_id: string
  text: string
  video_id: string
  heart: boolean
  fixed: boolean
  likes: number
  dislikes: number
}

interface CommentCreationAttributes
  extends Optional<
    CommentAttributes,
    "id" | "likes" | "dislikes" | "heart" | "fixed"
  > {}

class Comments extends Model<CommentAttributes, CommentCreationAttributes> {
  public id!: string
  public user_id!: string
  public text!: string
  public video_id!: string
  public heart!: boolean
  public fixed!: boolean
  public likes!: number
  public dislikes!: number

  public static associations: {
    owner: Association<Comments, User>
    video: Association<Comments, Videos>
  }

  /**
   * Return the user who commented
   */
  public getOwner!: BelongsToGetAssociationMixin<User>

  /**
   * Returns the video which have been commented
   */
  public getVideo!: BelongsToGetAssociationMixin<Videos>
}

Comments.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    user_id: DataTypes.UUID,
    text: DataTypes.STRING,
    video_id: DataTypes.UUID,
    likes: DataTypes.NUMBER,
    dislikes: DataTypes.NUMBER,
    heart: DataTypes.BOOLEAN,
    fixed: DataTypes.BOOLEAN,
  },
  {
    sequelize: connection as Sequelize,
    tableName: `Comments`,
    modelName: `Comment`,
  }
)

export default Comments
