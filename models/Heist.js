module.exports = (sequelize, DataTypes) => {
  return sequelize.define('heist', {
      heist_start: {
          type: DataTypes.STRING,
      },
      participants: {
          type: DataTypes.TEXT,
      },
      channels: {
        type: DataTypes.TEXT,
    },
  }, {
      timestamps: false,
  });
};