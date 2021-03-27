const { Model, DataTypes: type } = require('sequelize');
const { sequelize } = require('./conn');
class Sites extends Model {}

Sites.init(
  {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    animeId: { type: type.INTEGER, allowNull: false, field: 'anime_id' },
    name: { type: type.STRING, allowNull: false },
    link: { type: type.TEXT, allowNull: false },
  },
  { modelName: 'sites', sequelize, createdAt: 'created_at', updatedAt: 'updated_at' }
);

module.exports = Sites;
