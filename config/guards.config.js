const {getUser} = require("./request/jwt");

const axios = require('axios');
const path = require('path')

exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/users/login')
    }
}

exports.ensureAuthenticatedApi = async (req, res, next) => {
    try {
        const user = await getUser(req.headers['authorization'])
        if (req.isAuthenticated() || user) {
            if (user) req.user = user
            next()
        } else {
            res.status(400).json({success: false, msg: "You aren't connected!"})
        }
    } catch (e) {
        res.status(400).json({success: false, msg: e.message})
    }
}

exports.notAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next()
    } else {
        req.flash('errors', [`You are already authenticated!`])
        res.redirect('/')
    }
}

exports.paramBasicApi = ({request, contentType = 'application/x-www-form-urlencoded'}) => {
    try {
        if (request.request) request = request.request
        const {cookies, headers} = request
        const {referer, origin, host} = headers
        if (origin) {
            axios.defaults.baseURL = origin
        } else {
            if (referer) {
                const prefix = referer.split('//')[0]
                axios.defaults.baseURL = `${prefix}//${host}`
            } else {
                axios.defaults.baseURL = `http://${host}`
            }
        }
        axios.defaults.headers.common['Authorization'] = cookies.jwt ?? '';
        axios.defaults.headers.post['Content-Type'] = contentType;
    } catch (e) {
        console.log({e})
    }
    return axios
}

exports.generateCode = (prefix, numberCharacter) => {
    function randomString(len) {
        // String result
        let str = "";
        // Loop `len` times
        for (let i = 0; i < len; i++) {
            // random: 0..61
            let rand = Math.floor(Math.random() * 62);
            // Get correct charCode
            let charCode = rand += rand > 9 ? (rand < 36 ? 55 : 61) : 48;
            // add Character to str
            str += String.fromCharCode(charCode);
        }
        // After all loops are done, return the concatenated string
        return str;
    }

    return `${prefix}-${randomString(numberCharacter)}`.toUpperCase()
}

exports.convertDataDocToObject = dataDoc => {
    let jsonData = JSON.stringify(dataDoc);
    return JSON.parse(jsonData)
}

