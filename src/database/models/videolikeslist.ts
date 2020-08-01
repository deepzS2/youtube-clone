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

interface VideosLikesListAttributes {
  id: string
  video_id: string
  user_id: string
}

interface VideosLikesListCreationAttributes
  extends Optional<VideosLikesListAttributes, "id"> {}

class VideosLikesList extends Model<
  VideosLikesListAttributes,
  VideosLikesListCreationAttributes
> {
  public id!: string
  public video_id!: string
  public user_id!: string

  public static associations: {
    video: Association<VideosLikesList, Video>
    user_id: Association<VideosLikesList, User>
  }
}

VideosLikesList.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    video_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
  },
  {
    sequelize: connection as Sequelize,
    tableName: `VideosLikesLists`,
    modelName: `VideosLikesList`,
  }
)

export default VideosLikesList
