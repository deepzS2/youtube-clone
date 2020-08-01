'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SubscribedLists', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      subscriber_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: `Users`,
          },
          onDelete: 'cascade',
          key: `id`
        },
      },
      subscribed_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: `Users`,
          },
          onDelete: 'cascade',
          key: `id`
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SubscribedLists');
  }
};