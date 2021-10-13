const {
    convertDataDocToObject
} = require("../../../config/guards.config");

const {
    getSubcategoryByName
} = require("../../../queries/api/subcategories.queries");

exports.checkSubcategoryExistFromParams = async (req, res, next) => {
    try {
        const name = req.params.name
        if (name) {
            let subcategory = await getSubcategoryByName(name)
            subcategory = convertDataDocToObject(subcategory)
            if (subcategory) {
                req.subcategory = subcategory
                next()
            } else {
                return res.status(404).json({success: false, msg: `Subcategory ${name} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'name' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkSubcategoryExistFromBody = async (req, res, next) => {
    try {
        const subcategory = req.body.subcategory
        if (subcategory) {
            let _subcategory = await getSubcategoryByName(subcategory)
            _subcategory = convertDataDocToObject(_subcategory)
            if (_subcategory) {
                req.subcategory = _subcategory
                next()
            } else {
                return res.status(404).json({success: false, msg: `Subcategory ${subcategory} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Body 'subcategory' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}
