const User = require('../../database/models/user.model')

exports.User = User

exports.createUser = user => new User(user).save()

exports.updateUser = (code, user) => User.findOneAndUpdate({code}, {$set: user}).exec()

exports.getUserByCode = code => User.findOne({code}).exec()

exports.getUserByUsername = username => User.findOne({username}).exec()

exports.getUserByCodeAndPopulateTasks = code => User.findOne({code}).populate({path: 'tasks'}).exec()

exports.deleteUser = code => User.findOneAndDelete({code}).exec()

exports.getAllUsers = () => User.find().exec()

exports.getUserById = userId => User.findById(userId).exec()

exports.addTaskIdToUser = (taskId, userId) => User.findByIdAndUpdate(userId, {$push: {tasks: taskId}}).exec()

exports.removeTaskIdToUser = (taskId, userId) => User.findByIdAndUpdate(userId, {$pull: {tasks: taskId}}).exec()

