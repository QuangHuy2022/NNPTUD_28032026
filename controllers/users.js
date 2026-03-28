let userModel = require('../schemas/users');
let roleModel = require('../schemas/roles');
const { Op } = require('sequelize');

module.exports = {
    CreateAnUser: async function (username, password, email, roleId, session,
        fullName, avatarUrl, status, loginCount) {
        let newItem = await userModel.create({
            username: username,
            password: password,
            email: email,
            fullName: fullName,
            avatarUrl: avatarUrl,
            status: status,
            roleId: roleId,
            loginCount: loginCount
        });
        return newItem;
    },
    GetAnUserByUsername: async function (username) {
        return await userModel.findOne({
            where: {
                isDeleted: false,
                username: username
            },
            include: [{ model: roleModel, as: 'role' }]
        })
    }, 
    GetAnUserById: async function (id) {
        return await userModel.findOne({
            where: {
                isDeleted: false,
                id: id
            },
            include: [{ model: roleModel, as: 'role' }]
        })
    }, 
    GetAnUserByEmail: async function (email) {
        return await userModel.findOne({
            where: {
                isDeleted: false,
                email: email
            },
            include: [{ model: roleModel, as: 'role' }]
        })
    }, 
    GetAnUserByToken: async function (token) {
        let user = await userModel.findOne({
            where: {
                isDeleted: false,
                forgotPasswordToken: token,
                forgotPasswordTokenExp: {
                    [Op.gt]: new Date()
                }
            }
        })
        return user || false;
    }
}
