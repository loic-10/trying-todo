const {
    convertDataDocToObject
} = require("../../guards.config");

const {
    getCategoryByName
} = require("../../../queries/api/categories.queries");

exports.checkCategoryExistFromParams = async (req, res, next) => {
    try {
        const name = req.params.name
        if (name) {
            let category = await getCategoryByName(name)
            category = convertDataDocToObject(category)
            if (category) {
                req.category = category
                next()
            } else {
                return res.status(404).json({success: false, msg: `Category ${name} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'name' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkCategoryExistFromBody = async (req, res, next) => {
    try {
        const category = req.body.category
        if (category) {
            let _category = await getCategoryByName(category)
            _category = convertDataDocToObject(_category)
            if (_category) {
                req.category = _category
                next()
            } else {
                return res.status(404).json({success: false, msg: `Category ${category} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Body 'category' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}
