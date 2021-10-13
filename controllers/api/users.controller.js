const {
    createUser,
    updateUser,
    getUserByCode,
    getAllUsers,
    getUserByCodeAndPopulateTasks,
    deleteUser,
    User
} = require("../../queries/api/users.queries");

exports.userGetOne = async (req, res) => {
    try {
        const code = req.params.code
        if (code) {
            const user = await getUserByCode(code)
            if (user) {
                return res.status(200).json({success: true, msg: `User ${code} found!`, user})
            } else {
                return res.status(404).json({success: false, msg: `User ${code} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'code' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.userGetOneAndPopulateTasks = async (req, res) => {
    try {
        const code = req.params.code
        if (code) {
            const user = await getUserByCodeAndPopulateTasks(code)
            if (user) {
                return res.status(200).json({success: true, msg: `User ${code} found!`, user})
            } else {
                return res.status(404).json({success: false, msg: `User ${code} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'code' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.userGetAll = async (req, res) => {
    try {
        const user = await getAllUsers()
        return res.status(200).json({success: true, user})
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.userCreate = async (req, res) => {
    try {
        let {username, password} = req.body
        password = await User.hashPassword(password)
        const user = await createUser({
            username,
            password
        })
        return res.status(201).json({success: true, msg: `User ${user.username} create successfully!`, user})
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

// exports.userUpdate = async (req, res) => {
//     try {
//         let {user, body, files} = req
//         let {name, description} = body
//         let image = fileName(files, 'picture')
//         let picture = user.picture
//         if (image) deleteFile({fileName: picture ?? ''})
//         picture = image ?? picture
//         user = await updateUser(user.code, {
//             name,
//             description,
//             picture
//         })
//         return res.status(200).json({success: true, msg: `User ${user.name} update successfully!`, user})
//     } catch (e) {
//         return res.status(500).json({success: false, msg: e.message})
//     }
// }

exports.userDelete = async (req, res) => {
    try {
        const user = await deleteUser(req.params.code)
        return res.status(200).json({success: true, msg: `User ${user.username} delete successfully!`, user})
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}
