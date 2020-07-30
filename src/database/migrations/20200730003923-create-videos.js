'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(`Videos`, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: `Users`,
          },
          key: `id`
        },
        allowNull: false,
      },
      file: {
        type: Sequelize.DataTypes.BLOB,
        allowNull: false,
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      },
      likes: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0
      },
      dislikes: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(`Videos`)
  }
}