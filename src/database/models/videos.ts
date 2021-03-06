import {
  Sequelize,
  Model,
  DataTypes,
  Optional,
  UUIDV4,
  BelongsToGetAssociationMixin,
  HasManyGetAssociationsMixin,
  Association,
} from "sequelize"
import connection from "../database"
import User from "./user"
import Comment from "./comments"

interface VideoAttributes {
  id: string
  user_id: string
  file: Buffer
  title: string
  views: number
  description: string
  likes: number
  dislikes: number
}

interface VideoCreationAttributes
  extends Optional<VideoAttributes, "id" | "likes" | "dislikes" | "views"> {}

class Videos extends Model<VideoAttributes, VideoCreationAttributes> {
  public id!: string
  public user_id!: string
  public file!: Buffer
  public title!: string
  public description!: string
  public likes!: number
  public views!: number
  public dislikes!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static associations: {
    owner: Association<Videos, User>
    comments: Association<Videos, Comment>
  }

  /**
   * Return the user who uploaded the video
   */
  public getOwner!: BelongsToGetAssociationMixin<User>

  /**
   * Return the video comments
   */
  public getComments!: HasManyGetAssociationsMixin<Comment>
}

Videos.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: "User",
        key: "id",
      },
      allowNull: false,
    },
    file: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    views: {
      type: DataTypes.NUMBER,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.NUMBER,
    },
    dislikes: {
      type: DataTypes.NUMBER,
    },
  },
  {
    sequelize: connection as Sequelize,
    tableName: `Videos`,
    modelName: `Video`,
  }
)

export default Videos
