const mongoose = require('mongoose')
const schema = mongoose.Schema

const {
    generateCode
} = require("../../config/guards.config")

const taskSchema = schema({
    title: {
        type: String,
        required: [true, 'Title is required!'],
        trim: true
    },
    description: String,
    user: {
        type: schema.Types.ObjectId,
        ref: 'user',
        immutable: true,
        required: [true, 'User is required!']
    },
    code: {
        type: String,
        unique: [true, 'Code already used!'],
        immutable: true
    }
}, {
    timestamps: true
})

taskSchema.pre('save', async function (next) {
    let task = null
    let code
    do {
        try {
            code = generateCode('SCA', 6)
            task = await Task.getTaskByCode(code)
        } catch (e) {
            console.log({e})
        }
    } while (task)
    this.code = code
    console.log('Pre save task')
    next()
})

taskSchema.post('save', function (data) {
    try {
        require("../../queries/api/users.queries").addTaskIdToUser(data._id, data.user)
            .then(result => console.log({result}))
            .catch(e => console.log({e}))
    } catch (e) {
        console.log({e})
    } finally {
        console.log('Post save task')
    }
})

taskSchema.pre('findOneAndUpdate', function (next) {
    console.log('Pre findOneAndUpdate')
    next()
});

taskSchema.post('findOneAndUpdate', async function (data) {
    try {
        console.log(data)
    } catch (e) {
        console.log(e)
    } finally {
        console.log('Post findOneAndUpdate task')
    }
});

taskSchema.pre('findOneAndDelete', function (next) {
    console.log('Pre findOneAndDelete')
    next()
});

taskSchema.post('findOneAndDelete', data => {
    try {
        require("../../queries/api/users.queries").removeTaskIdToUser(data._id, data.user)
            .then(result => console.log({result}))
            .catch(e => console.log({e}))
    } catch (e) {
        console.log({e})
    }
    console.log('Post findOneAndDelete task')
});

taskSchema.pre('deleteMany', function (next) {
    console.log('Pre deleteMany')
    next()
});

taskSchema.post('deleteMany', function (data) {
    console.log('Pro deleteMany: ', data)
});

taskSchema.statics.getTaskByCode = async function (code) {
    return Task.findOne({code}).exec()
}

const Task = mongoose.model('task', taskSchema);

module.exports = Task
