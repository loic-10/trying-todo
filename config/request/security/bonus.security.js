const {
    convertDataDocToObject
} = require("../../guards.config");

const {
    getBonusByName
} = require("../../../queries/api/bonus.queries");

exports.checkBonusExistFromParams = async (req, res, next) => {
    try {
        const name = req.params.name
        if (name) {
            let bonus = await getBonusByName(name)
            bonus = convertDataDocToObject(bonus)
            if (bonus) {
                req.bonus = bonus
                next()
            } else {
                return res.status(404).json({success: false, msg: `Bonus ${name} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'name' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkBonusExistFromBody = async (req, res, next) => {
    try {
        const bonus = req.body.bonus
        if (bonus) {
            let _bonus = await getBonusByName(bonus)
            _bonus = convertDataDocToObject(_bonus)
            if (_bonus) {
                req.bonus = _bonus
                next()
            } else {
                return res.status(404).json({success: false, msg: `Bonus ${bonus} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Body 'bonus' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}
