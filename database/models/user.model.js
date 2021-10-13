const mongoose = require('mongoose')
const schema = mongoose.Schema
const bcrypt = require('bcrypt')

const {
    generateCode
} = require("../../config/guards.config")

const userSchema = schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: [true, 'Username already used!'],
        trim: true
    },
    code: {
        type: String,
        unique: [true, 'Code already used!'],
        immutable: true
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    tasks: [
        {
            type: schema.Types.ObjectId,
            ref: 'task'
        }
    ]
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    let user = null
    let code
    do {
        try {
            code = generateCode('USR', 6)
            user = await User.getUserByCode(code)
        } catch (e) {
            console.log({e})
        }
    } while (user)
    this.code = code
    console.log('Pre save user')
    next()
})

userSchema.post('save', function (data) {
    try {
        console.log(data)
    } catch (e) {
        console.log(e)
    }
    console.log('Post save user')
})

userSchema.pre('findOneAndUpdate', function (next) {
    console.log('Pre findOneAndUpdate')
    next()
});

userSchema.post('findOneAndUpdate', async function (data) {
    try {
        console.log(data)
    } catch (e) {
        console.log(e)
    }
    console.log('Post findOneAndUpdate user')
});

userSchema.pre('findOneAndDelete', function (next) {
    console.log('Pre findOneAndDelete')
    next()
});

userSchema.post('findOneAndDelete', function (data) {
    try {
        for (const task of data.tasks) {
            try {
                require("../../queries/api/tasks.queries").deleteTaskById(task)
                    .then(result => console.log({result}))
                    .catch(e => console.log({e}))
            } catch (e) {
                console.log({e})
            }
        }
    } catch (e) {
        console.log({e})
    }
    console.log('Post findOneAndDelete user')
});

userSchema.pre('deleteMany', function (next) {
    console.log('Pre deleteMany')
    next()
});

userSchema.post('deleteMany', function (data) {
    console.log('Pro deleteMany: ', data)
});

userSchema.statics.hashPassword = async function (password) {
    try {
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password, salt)
    } catch (e) {
        console.log({e})
    }
}

userSchema.statics.getUserByCode = async function (code) {
    return User.findOne({code}).exec()
}

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('user', userSchema);

module.exports = User
