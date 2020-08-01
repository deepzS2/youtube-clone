import Sequelize from "sequelize"
import {
  User,
  Video,
  Comment,
  SubscribedList,
  VideosLikesList,
  CommentsLikesList,
} from "./models"
import connection from "./database"

// The database
class Database {
  public connection: Sequelize.Sequelize
  public User: typeof User
  public Video: typeof Video
  public SubscribedList: typeof SubscribedList
  public Comment: typeof Comment
  public VideosLikesList: typeof VideosLikesList
  public CommentsLikesList: typeof CommentsLikesList

  /**
   * Database connection with the models
   */
  constructor() {
    this.connection = connection
    this.User = User
    this.Comment = Comment
    this.Video = Video
    this.SubscribedList = SubscribedList
    this.VideosLikesList = VideosLikesList
    this.CommentsLikesList = CommentsLikesList

    this.associate()
  }

  /**
   * Create your relations here!
   */
  associate(): void {
    // 1 User has many Videos
    // 1 Video belongs to 1 Owner
    this.User.hasMany(Video, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "videos",
      onDelete: "CASCADE",
    })
    this.Video.belongsTo(User, {
      as: "owner",
      foreignKey: "user_id",
    })

    // 1 Video has many comments
    // 1 User has many comments
    // 1 Comment belongs to 1 video and user
    this.User.hasMany(Comment, {
      foreignKey: "user_id",
      sourceKey: "id",
      as: "comments",
      onDelete: "CASCADE",
    })
    this.Video.hasMany(Comment, {
      foreignKey: "video_id",
      sourceKey: "id",
      onDelete: "CASCADE",
      as: "comments",
    })
    this.Comment.belongsTo(User, {
      foreignKey: "user_id",
      as: "owner",
    })
    this.Comment.belongsTo(Video, {
      foreignKey: "video_id",
      as: "video",
    })

    // Subscribers list
    this.User.belongsToMany(User, {
      as: "subscribedTo",
      through: "SubscribedLists",
      foreignKey: "subscriber_id",
      onDelete: "CASCADE",
      otherKey: "subscribed_id",
    })

    // Liked videos
    this.Video.hasMany(VideosLikesList, {
      as: "likesList",
      sourceKey: "id",
      onDelete: "CASCADE",
      foreignKey: "video_id",
    })
    this.VideosLikesList.belongsTo(Video, {
      foreignKey: "video_id",
    })
    this.VideosLikesList.belongsTo(User, {
      foreignKey: "user_id",
    })
    this.User.hasMany(VideosLikesList, {
      as: "likedVideos",
      sourceKey: "id",
      onDelete: "CASCADE",
      foreignKey: "user_id",
    })

    // Liked coments
    this.Comment.hasMany(CommentsLikesList, {
      as: "likesList",
      sourceKey: "id",
      onDelete: "CASCADE",
      foreignKey: "comment_id",
    })
    this.CommentsLikesList.belongsTo(Comment, {
      foreignKey: "comment_id",
    })
    this.CommentsLikesList.belongsTo(User, {
      foreignKey: "user_id",
    })
    this.User.hasMany(CommentsLikesList, {
      as: "likedComments",
      sourceKey: "id",
      onDelete: "CASCADE",
      foreignKey: "user_id",
    })
  }
}

const database: Database = new Database()

export default database
