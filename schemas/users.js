const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const bcrypt = require('bcrypt');
const Role = require('./roles');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  fullName: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  avatarUrl: {
    type: DataTypes.STRING,
    defaultValue: "https://i.sstatic.net/l60Hf.png",
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Role,
      key: 'id',
    },
  },
  loginCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lockTime: {
    type: DataTypes.DATE,
  },
  forgotPasswordToken: {
    type: DataTypes.STRING,
  },
  forgotPasswordTokenExp: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// Associations
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

module.exports = User;
