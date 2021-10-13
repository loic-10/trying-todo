const {
    convertDataDocToObject
} = require("../../guards.config");

const {
    getAccessoryByName
} = require("../../../queries/api/accessories.queries");

exports.checkAccessoryExistFromParams = async (req, res, next) => {
    try {
        const name = req.params.name
        if (name) {
            let accessory = await getAccessoryByName(name)
            accessory = convertDataDocToObject(accessory)
            if (accessory) {
                req.accessory = accessory
                next()
            } else {
                return res.status(404).json({success: false, msg: `Accessory ${name} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'name' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkAccessoryExistFromBody = async (req, res, next) => {
    try {
        const accessory = req.body.accessory
        if (accessory) {
            let _accessory = await getAccessoryByName(accessory)
            _accessory = convertDataDocToObject(_accessory)
            if (_accessory) {
                req.accessory = _accessory
                next()
            } else {
                return res.status(404).json({success: false, msg: `Accessory ${accessory} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Body 'accessory' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}
