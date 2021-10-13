const {
    createTask,
    updateTask,
    getTaskByCode,
    getTaskByCodeAndPopulateUser,
    deleteTask
} = require("../../queries/api/tasks.queries");

exports.taskGetOne = async (req, res) => {
    try {
        const code = req.params.code
        if (code) {
            const task = await getTaskByCode(code)
            if (task) {
                return res.status(200).json({success: true, msg: `Task ${code} found!`, task})
            } else {
                return res.status(404).json({success: false, msg: `Task ${code} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'code' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.taskGetOneAndPopulateUser = async (req, res) => {
    try {
        const code = req.params.code
        if (code) {
            const task = await getTaskByCodeAndPopulateUser(code)
            if (task) {
                return res.status(200).json({success: true, msg: `Task ${code} found!`, task})
            } else {
                return res.status(404).json({success: false, msg: `Task ${code} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'code' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.taskCreate = async (req, res) => {
    try {
        let {body, user} = req
        let {title, description} = body
        const task = await createTask({
            user: user._id,
            title,
            description
        })
        return res.status(201).json({success: true, msg: `Task ${task.title} create successfully!`, task})
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.taskUpdate = async (req, res) => {
    try {
        let {task, body} = req
        let {title, description} = body
        task = await updateTask(task.code, {
            title,
            description
        })
        return res.status(200).json({success: true, msg: `Task ${task.title} update successfully!`, task})
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.taskDelete = async (req, res) => {
    try {
        const task = await deleteTask(req.params.code)
        return res.status(200).json({success: true, msg: `Task ${task.title} delete successfully!`, task})
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}
