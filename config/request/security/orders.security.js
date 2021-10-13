const {
    convertDataDocToObject
} = require("../../guards.config");

const {
    getOrderByCodeAndPopulateProduct
} = require("../../../queries/api/orders.queries")

const {
    getProductByCodeAndPopulateSubcategory
} = require("../../../queries/api/products.queries")

exports.assignOrder = async (req, res, next) => {
    try {
        req.customer = req.user
        next()
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.userIsOwnerOfOrderOrAdmin = async (req, res, next) => {
    try {
        const code = req.params.code
        if (code) {
            let order = await getOrderByCodeAndPopulateProduct(code)
            order = convertDataDocToObject(order)
            if (order) {
                if (req.user._id.toString() === order.customer.toString() || req.user.type_user === 'admin') {
                    req.order = order
                    req.product = order.product
                    req.category = order.product.subcategory.category
                    next()
                } else {
                    return res.status(403).json({
                        success: false,
                        msg: `${req.user.username}, you aren't owner of order ${order.code}!`
                    })
                }
            } else {
                return res.status(404).json({success: false, msg: `Order ${code} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'code' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.productAvailableForNewOrder = async (req, res, next) => {
    try {
        const _product = req.body.product
        if (_product) {
            let product = await getProductByCodeAndPopulateSubcategory(_product)
            product = convertDataDocToObject(product)
            if (product) {
                switch (product.status) {
                    case 'available':
                        req.product = product
                        req.category = product.subcategory.category
                        next()
                        break
                    case 'unavailable':
                        return res.status(403).json({
                            success: false,
                            msg: `${req.user.username}, product ${product.name} has been unavailable!`
                        })
                    case 'soon':
                        return res.status(403).json({
                            success: false,
                            msg: `${req.user.username}, product ${product.name} coming soon available!`
                        })
                    case 'disable':
                        return res.status(403).json({
                            success: false,
                            msg: `${req.user.username}, product ${product.name} has been disable!`
                        })
                    default:
                        return res.status(403).json({
                            success: false,
                            msg: `${req.user.username}, product ${product.name} has been unavailable!`
                        })
                }
            } else {
                return res.status(404).json({success: false, msg: `Product ${_product} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Body 'product' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.productAvailableForOrder = async (req, res, next) => {
    try {
        const product = req.product
        switch (product.status) {
            case 'available':
                req.product = product
                next()
                break
            case 'unavailable':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, product ${product.name} has been unavailable!`
                })
            case 'soon':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, product ${product.name} has been soon!`
                })
            case 'disable':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, product ${product.name} has been disable!`
                })
            default:
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, product ${product.name} has been unavailable!`
                })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.orderAvailableForUpdateOrCancel = async (req, res, next) => {
    try {
        const order = req.order
        switch (order.status) {
            case 'in_pending':
                next()
                break
            case 'process_stop':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, process of order ${order.code} has been stop!`
                })
            case 'cancel':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been cancel!`
                })
            case 'in_progress_treat':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been in progress treat!`
                })
            case 'in_progress_serve':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been in progress serve!`
                })
            case 'ready':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been ready!`
                })
            case 'served':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been served!`
                })
            default:
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been cancel!`
                })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.orderAvailableForStopProcessOrCancel = async (req, res, next) => {
    try {
        const order = req.order
        switch (order.status) {
            case 'in_pending':
                next()
                break
            case 'process_stop':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, process of order ${order.code} has been stop!`
                })
            case 'cancel':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been cancel!`
                })
            case 'in_progress_treat':
                next()
                break
            case 'in_progress_serve':
                next()
                break
            case 'ready':
                next()
                break
            case 'served':
                next()
                break
            default:
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been cancel!`
                })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.orderAvailableForEndTreatment = async (req, res, next) => {
    try {
        const order = req.order
        switch (order.status) {
            case 'in_pending':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} is yet in pending!`
                })
            case 'process_stop':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, process of order ${order.code} has been stop!`
                })
            case 'cancel':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been cancel!`
                })
            case 'in_progress_treat':
                next()
                break
            case 'in_progress_serve':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been in progress serve!`
                })
            case 'ready':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been ready!`
                })
            case 'served':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been served!`
                })
            default:
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been cancel!`
                })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.orderAvailableForEndService = async (req, res, next) => {
    try {
        const order = req.order
        switch (order.status) {
            case 'in_pending':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} is yet in pending!`
                })
            case 'process_stop':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, process of order ${order.code} has been stop!`
                })
            case 'cancel':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been cancel!`
                })
            case 'in_progress_treat':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been in progress treat!`
                })
            case 'in_progress_serve':
                next()
                break
            case 'ready':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been ready!`
                })
            case 'served':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been served!`
                })
            default:
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been cancel!`
                })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.orderAvailableForStartService = async (req, res, next) => {
    try {
        const order = req.order
        const product = req.product
        switch (order.status) {
            case 'in_pending':
                if (product.make_preparation) {
                    return res.status(403).json({
                        success: false,
                        msg: `${req.user.username}, order ${order.code} is yet in pending and require preparation!`
                    })
                } else {
                    next()
                    break
                }
            case 'process_stop':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, process of order ${order.code} has been stop!`
                })
            case 'cancel':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been cancel!`
                })
            case 'in_progress_treat':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been in progress treat!`
                })
            case 'in_progress_serve':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been in progress serve!`
                })
            case 'ready':
                next()
                break
            case 'served':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been served!`
                })
            default:
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been cancel!`
                })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.orderUnpaid = async (req, res, next) => {
    try {
        const order = req.order
        switch (order.status_payment) {
            case 'unpaid':
                next()
                break
            case 'paid':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been paid!`
                })
            default:
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been paid!`
                })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.orderMakePossibilityPayment = async (req, res, next) => {
    try {
        const order = req.order
        switch (order.status) {
            case 'in_pending':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} is yet in pending!`
                })
            case 'cancel':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been cancel!`
                })
            case 'process_stop':
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, process of order ${order.code} has been stop!`
                })
            case 'in_progress_treat':
                next()
                break
            case 'in_progress_serve':
                next()
                break
            case 'ready':
                next()
                break
            case 'served':
                next()
                break
            default:
                return res.status(403).json({
                    success: false,
                    msg: `${req.user.username}, order ${order.code} has been cancel!`
                })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.employeeHasResponsibilityInCategoryProductOrder = async (req, res, next) => {
    try {
        const code = req.params.code
        if (code) {
            let _order = await getOrderByCodeAndPopulateProduct(code)
            const order = convertDataDocToObject(_order)
            if (order) {
                if (req.employee.categories_responsibility.includes(order.product.subcategory.category._id)) {
                    req.order = order
                    req._order = _order
                    req.product = order.product
                    req.category = order.product.subcategory.category
                    next()
                } else {
                    return res.status(403).json({
                        success: false,
                        msg: `${req.user.username}, you haven't the responsibility in category ${order.product.subcategory.category.name}!`
                    })
                }
            } else {
                return res.status(404).json({success: false, msg: `Order ${code} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'code' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.productOrderRequirePreparation = (req, res, next) => {
    try {
        const product = req.product
        if (product.make_preparation) {
            next()
        } else {
            return res.status(400).json({
                success: false,
                msg: `${req.user.username}, product ${product.name} refuse preparation!`
            })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkAvailabilityAccessoriesForTreatment = async (req, res, next) => {
    try {
        const missingAccessories = await req._order.checkOrderPossibility()
        if (missingAccessories.length === 0) {
            next()
        } else {
            return res.status(403).json({
                success: false,
                msg: `${req.user.username}, the ${req.order.code} order has missing accessories!`,
                missingAccessories
            })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkAvailabilityAccessoriesForService = async (req, res, next) => {
    try {
        const missingAccessories = await req._order.checkOrderPossibility()
        if ((missingAccessories.length === 0 && !req.order.item.make_preparation) || req.order.item.make_preparation) {
            next()
        } else {
            return res.status(403).json({
                success: false,
                msg: `${req.user.username}, the ${req.order.code} order has missing accessories!`,
                missingAccessories
            })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.employeeIsOwnerTreatmentOrder = (req, res, next) => {
    try {
        const order = req.order
        if (order.order_caterer.toString() === req.user._id.toString()) {
            next()
        } else {
            return res.status(400).json({
                success: false,
                msg: `${req.user.username}, your aren't owner treatment of order ${order.code}!`
            })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.employeeIsOwnerServerOrder = (req, res, next) => {
    try {
        const order = req.order
        if (order.order_server.toString() === req.user._id.toString()) {
            next()
        } else {
            return res.status(400).json({
                success: false,
                msg: `${req.user.username}, your aren't owner service of order ${order.code}!`
            })
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}
