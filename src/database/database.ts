import Sequelize from "sequelize"
const config = require(`./config/database`)

// Makes the connection in this file because of the models
// which needs the connection!
const connection = new Sequelize.Sequelize(config)

export default connection
