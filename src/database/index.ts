import Sequelize from "sequelize"
import { User, Video } from "./models"
import connection from "./database"
const config = require(`./config/database`)

// The database
class Database {
  public connection: Sequelize.Sequelize
  public User: typeof User
  public Video: typeof Video

  /**
   * Database connection with the models
   */
  constructor() {
    this.connection = connection
    this.User = User
    this.Video = Video

    this.associate()
  }

  /**
   * Create your relations here!
   */
  associate(): void {
    // 1 User has many Videos
    // 1 Video has one Owner
    this.User.hasMany(Video, {
      foreignKey: "user_id",
      as: "owner",
    })
    this.Video.belongsTo(User, {
      foreignKey: "user_id",
      as: "owner",
    })
  }
}

const database: Database = new Database()

export default database
