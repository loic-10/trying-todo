exports.employeeIsOrderServer = (req, res, next) => {
    try {
        if (req.employee.role === 'order_server') {
            next()
        } else {
            res.status(403).json({success: false, msg: `${req.user.username}, you aren't order server!`})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.employeeIsOrderCaterer = (req, res, next) => {
    try {
        if (req.employee.role === 'order_caterer') {
            next()
        } else {
            res.status(403).json({success: false, msg: `${req.user.username}, you aren't order caterer!`})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.employeeIsOrderDeliver = (req, res, next) => {
    try {
        if (req.employee.role === 'order_deliver') {
            next()
        } else {
            res.status(403).json({success: false, msg: `${req.user.username}, you aren't order deliver!`})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.employeeIsInService = (req, res, next) => {
    try {
        if (req.employee.status === 'in_service') {
            next()
        } else {
            res.status(403).json({success: false, msg: `${req.user.username}, you aren't in service!`})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}
