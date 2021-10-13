const Task = require('../../database/models/task.model')

exports.createTask = task => new Task(task).save()

exports.updateTask = (code, task) => Task.findOneAndUpdate({code}, {$set: task}).exec()

exports.getTaskByCode = code => Task.findOne({code}).exec()

exports.getTaskByCodeAndPopulateUser = code => Task.findOne({code}).populate({path: 'user'}).exec()

exports.deleteTask = code => Task.findOneAndDelete({code}).exec()

exports.deleteTaskById = taskId => Task.findByIdAndDelete(taskId).exec()

exports.getAllCategories = () => Task.find().exec()

exports.getTaskById = taskId => Task.findById(taskId).exec()
