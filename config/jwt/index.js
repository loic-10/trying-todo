// const {userGetProfile} = require("../../queries/users.queries");
const {app} = require("../../server");

const extractUserFromToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            const {data} = await userGetProfile({request: req});
            if (data.success) {
                req.user = data.user;
            } else {
            }
        } else {
            // res.clearCookie("jwt");
        }
    } catch (e) {
    }
    next();
};

const addJwtFeatures = (req, res, next) => {
    req.isAuthenticated = () => !!req.user;
    req.logout = () => res.clearCookie("jwt");
    req.login = ({token}) => {
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 604800000),
            secure: false, // set to true if your using https
            httpOnly: true,
        });
    };
    next();
};

app.use(extractUserFromToken);
app.use(addJwtFeatures);
