const {
    convertDataDocToObject
} = require("../../guards.config");

const {
    getAccessoryCategoryByName
} = require("../../../queries/api/accessories-categories.queries");

exports.checkAccessoryCategoryExistFromParams = async (req, res, next) => {
    try {
        const name = req.params.name
        if (name) {
            let accessoryCategory = await getAccessoryCategoryByName(name)
            accessoryCategory = convertDataDocToObject(accessoryCategory)
            if (accessoryCategory) {
                req.accessoryCategory = accessoryCategory
                next()
            } else {
                return res.status(404).json({success: false, msg: `Accessory Category ${name} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'name' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkAccessoryCategoryExistFromBody = async (req, res, next) => {
    try {
        const accessoryCategory = req.body.accessory_category
        if (accessoryCategory) {
            let _accessoryCategory = await getAccessoryCategoryByName(accessoryCategory)
            _accessoryCategory = convertDataDocToObject(_accessoryCategory)
            if (_accessoryCategory) {
                req.accessoryCategory = _accessoryCategory
                next()
            } else {
                return res.status(404).json({success: false, msg: `Accessory Category ${accessoryCategory} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Body 'accessory_category' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}
