const {
    convertDataDocToObject
} = require("../../../config/guards.config");

const {
    getProductAccessoryByCode
} = require("../../../queries/api/products-accessories.queries");

exports.checkProductAccessoryExistFromParams = async (req, res, next) => {
    try {
        const code = req.params.code
        if (code) {
            let productAccessory = await getProductAccessoryByCode(code)
            productAccessory = convertDataDocToObject(productAccessory)
            if (productAccessory) {
                req.productAccessory = productAccessory
                next()
            } else {
                return res.status(404).json({success: false, msg: `Product Accessory ${code} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Param 'code' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}

exports.checkProductAccessoryExistFromBody = async (req, res, next) => {
    try {
        const productAccessory = req.params.product_accessory
        if (productAccessory) {
            let _productAccessory = await getProductAccessoryByCode(productAccessory)
            _productAccessory = convertDataDocToObject(_productAccessory)
            if (_productAccessory) {
                req.productAccessory = _productAccessory
                next()
            } else {
                return res.status(404).json({success: false, msg: `Product Accessory ${productAccessory} not found!`})
            }
        } else {
            return res.status(400).json({success: false, msg: "Body 'product_accessory' is required!"})
        }
    } catch (e) {
        return res.status(500).json({success: false, msg: e.message})
    }
}
