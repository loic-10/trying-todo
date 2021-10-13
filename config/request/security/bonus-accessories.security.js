const {
    convertDataDocToObject
} = require("../../../config/guards.config");

const {
    getBonusAccessoryByCode
} = require("../../../queries/api/bonus-accessories.queries");

exports.checkBonusAccessoryExistFromParams = async (req, res, next) => {
    try {
        const code = req.params.code
        if (code) {
            let bonusAccessory = await getBonusAccessoryByCode(code)
            bonusAccessory = convertDataDocToObject(bonusAccessory)
            if (bonusAccessory) {
                req.bonusAccessory = bonusAccessory
                next()
            } else {
                return res.status(404).json({success: false, msg: `Bonus Accessory ${code} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'code' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkBonusAccessoryExistFromBody = async (req, res, next) => {
    try {
        const bonusAccessory = req.params.bonus_accessory
        if (bonusAccessory) {
            let _bonusAccessory = await getBonusAccessoryByCode(bonusAccessory)
            _bonusAccessory = convertDataDocToObject(_bonusAccessory)
            if (_bonusAccessory) {
                req.bonusAccessory = _bonusAccessory
                next()
            } else {
                return res.status(404).json({success: false, msg: `Bonus Accessory ${bonusAccessory} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Body 'bonus_accessory' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}
