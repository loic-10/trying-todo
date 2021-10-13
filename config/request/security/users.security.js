const {
    getCustomerByCode,
    getEmployeeByCode,
    getUserByCode
} = require("../../../queries/api/users.queries");

const {
    getUser
} = require("../jwt");

exports.ensureAuthenticated = async (req, res, next) => {
    try {
        const user = await getUser(req.headers['authorization'])
        if (user) {
            req.user = user
            next()
        } else {
            return res.status(401).json({success: false, msg: "Wrong token!", token: false})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.notAuthenticated = async (req, res, next) => {
    try {
        const user = await getUser(req.headers['authorization'])
        if (!user) {
            next()
        } else {
            return res.status(401).json({success: false, msg: "You are already authenticated!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.type_user === 'admin') {
            next()
        } else {
            res.status(403).json({success: false, msg: `${req.user.username}, you aren't admin!`})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.isNotAdmin = (req, res, next) => {
    try {
        if (req.user.type_user !== 'admin') {
            next()
        } else {
            res.status(403).json({success: false, msg: `User ${req.user.username} is admin!`})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.isEmployee = (req, res, next) => {
    try {
        if (req.user.type_user === 'employee') {
            req.employee = req.user.employee
            next()
        } else {
            res.status(403).json({success: false, msg: `${req.user.username}, you aren't employee!`})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.isCustomer = (req, res, next) => {
    try {
        if (req.user.type_user === 'customer') {
            next()
        } else {
            res.status(403).json({success: false, msg: `${req.user.username}, you aren't customer!`})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.userIsAvailable = (req, res, next) => {
    try {
        const user = req.user
        switch (user.status) {
            case 'connected':
                next()
                break
            case 'disconnected':
                next()
                break
            case 'disable':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, your account is disable!`
                })
            default:
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, your account is disable!`
                })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.userIsDisable = (req, res, next) => {
    try {
        const user = req.user
        switch (user.status) {
            case 'connected':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, your account is available!`
                })
            case 'disconnected':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, your account is available!`
                })
            case 'disable':
                next()
                break
            default:
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, your account is available!`
                })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkEmployeeExistFromParams = async (req, res, next) => {
    try {
        const username = req.params.username
        if (username) {
            let employee = await getEmployeeByCode(username)
            if (employee) {
                req.employee = employee
                next()
            } else {
                return res.status(404).json({success: false, msg: `Employee ${username} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'username' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkCustomerExistFromParams = async (req, res, next) => {
    try {
        const username = req.params.username
        if (username) {
            let customer = await getCustomerByCode(username)
            if (customer) {
                req.customer = customer
                next()
            } else {
                return res.status(404).json({success: false, msg: `Customer ${username} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'username' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkCustomerExistFromBody = async (req, res, next) => {
    try {
        const customer = req.body.customer
        if (customer) {
            let _customer = await getCustomerByCode(customer)
            if (_customer) {
                req.customer = _customer
                next()
            } else {
                return res.status(404).json({success: false, msg: `Customer ${customer} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Body 'customer' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkUserExistFromParams = async (req, res, next) => {
    try {
        const username = req.params.username
        if (username) {
            let user = await getUserByCode(username)
            if (user) {
                req.user = user
                next()
            } else {
                return res.status(404).json({success: false, msg: `User ${username} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'username' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.employeeIsInService = (req, res, next) => {
    try {
        const employee = req.employee
        switch (employee.employee.status) {
            case 'disable':
                return res.status(403).json({
                    success: false,
                    msg: `Employee ${employee.username} is already disable!`
                })
            case 'in_service':
                next()
                break
            default:
                return res.status(403).json({
                    success: false,
                    msg: `${employee.username} is already disable!`
                })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.employeeIsDisable = (req, res, next) => {
    try {
        const employee = req.employee
        switch (employee.employee.status) {
            case 'disable':
                next()
                break
            case 'in_service':
                return res.status(403).json({
                    success: false,
                    msg: `Employee ${employee.username} is already in service!`
                })
            default:
                return res.status(403).json({
                    success: false,
                    msg: `${employee.username} is already in service!`
                })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}
