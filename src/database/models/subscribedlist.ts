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

interface SubscribedListAttributes {
  id: string
  subscriber_id: string
  subscribed_id: string
}

interface SubscribedListCreationAttributes
  extends Optional<SubscribedListAttributes, "id"> {}

class SubscribedList extends Model<
  SubscribedListAttributes,
  SubscribedListCreationAttributes
> {
  public id!: string
  public subscriber_id!: string
  public subscribed_id!: string

  public static associations: {
    subscriber: Association<SubscribedList, User>
    subscribed: Association<SubscribedList, User>
  }
}

SubscribedList.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    subscriber_id: DataTypes.UUID,
    subscribed_id: DataTypes.UUID,
  },
  {
    sequelize: connection as Sequelize,
    tableName: `SubscribedLists`,
    modelName: `SubscribedList`,
  }
)

export default SubscribedList
