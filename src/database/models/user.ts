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
import connection from "../database"

interface UserAttributes {
  id: string
  username: string
  email: string
  password: string
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: string
  public username!: string
  public email!: string
  public password!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static associations: {
    videos: Association<User, Videos>
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
