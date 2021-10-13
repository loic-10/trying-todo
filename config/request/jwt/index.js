// Imports
const {getUserByCode} = require("../../../queries/api/users.queries")

let jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = "a2463421-b798-470a-b4ee-fd23783ec69d";

// Exported functions
module.exports = {
    generateTokenForUser: user =>
        jwt.sign({
                code: user.code
            },
            JWT_SIGN_SECRET,
            {
                expiresIn: '24h'
            })
    ,
    parseAuthorization: authorization =>
        (authorization != null) ? authorization.replace('Bearer ', '') : null
    ,
    getUser: async authorization => {
        let user = null;
        try {
            let token = module.exports.parseAuthorization(authorization);
            if (token != null) {
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if (jwtToken != null)
                    user = await getUserByCode(jwtToken.code)
            }
        } catch (e) {
            console.log({e})
        }
        return user;
    }
}
