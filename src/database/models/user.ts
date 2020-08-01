// eslint-disable-next-line no-unused-vars
import {
  Sequelize,
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  Association,
  Optional,
  UUIDV4,
} from "sequelize"
import bcrypt from "bcrypt"
import Videos from "./videos"
import Comment from "./comments"
import connection from "../database"

interface UserAttributes {
  id: string
  username: string
  email: string
  password: string
  subscribers: number
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "subscribers"> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: string
  public username!: string
  public subscribers!: number
  public email!: string
  public password!: string
  public videos!: Videos
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static associations: {
    videos: Association<User, Videos>
    comments: Association<User, Comment>
  }

  /**
   * Check if the password matches
   * @param password Password string
   */
  public async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }

  /**
   * Get the user videos uploads
   */
  public getVideos!: HasManyGetAssociationsMixin<Videos>
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    subscribers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize: connection as Sequelize,
    tableName: `Users`,
    modelName: `User`,
  }
)

/**
 * Before save encrypt the password
 */
User.addHook(
  `beforeSave`,
  async (user: User): Promise<void> => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10)
    }
  }
)

export default User
