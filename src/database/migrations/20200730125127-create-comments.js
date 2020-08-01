'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
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
          onDelete: 'cascade',
          key: `id`
        },
        allowNull: false,
      },
      text: {
        type: Sequelize.STRING
      },
      video_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: `Videos`,
          },
          onDelete: 'cascade',
          key: `id`
        },
        allowNull: false,
      },
      likes: {
        type: Sequelize.NUMBER,
        defaultValue: 0,
      },
      dislikes: {
        type: Sequelize.NUMBER,
        defaultValue: 0,

      },
      heart: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      fixed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('Comments');
  }
};