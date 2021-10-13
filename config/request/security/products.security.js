const {
    convertDataDocToObject
} = require("../../../config/guards.config");

const {
    getProductByName
} = require("../../../queries/api/products.queries");

exports.checkProductExistFromParams = async (req, res, next) => {
    try {
        const name = req.params.name
        if (name) {
            let product = await getProductByName(name)
            product = convertDataDocToObject(product)
            if (product) {
                req.product = product
                next()
            } else {
                return res.status(404).json({success: false, msg: `Product ${name} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'name' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkProductExistFromBody = async (req, res, next) => {
    try {
        const product = req.body.product
        if (product) {
            let _product = await getProductByName(product)
            _product = convertDataDocToObject(_product)
            if (_product) {
                req.product = _product
                next()
            } else {
                return res.status(404).json({success: false, msg: `Product ${product} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Body 'product' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}
