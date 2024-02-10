const jwt = require("jsonwebtoken");
require("dotenv").config();

// function to authenticate the user
const authUser = (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;
    try {
        if (!accessToken && !refreshToken)
            // if no token is provided
            throw new Error("tokens is required");

        jwt.verify(accessToken, process.env.accessSecret, (err, decoded) => {
            // verify the access token
            if (decoded) next();
            else if (err.message === "jwt expired") {
                jwt.verify(refreshToken, process.env.refreshSecret, (err, decoded) => {
                    // verify the refresh token
                    if (decoded) {
                        req.user = decoded;

                        const newAccessToken = jwt.sign({}, process.env.accessSecret, {
                            // generated new access token
                            expiresIn: 60,
                        });
                        if (!newAccessToken)
                            throw new Error("internal server error");
                        res.cookie("accessToken", newAccessToken);
                        next(); // if token is valid
                        // res.send(
                        // );
                    } else if (err.message === "jwt expired") {
                        throw new Error("token expired login again", err);
                    } else throw new Error("invalid token", err); // if token is invalid
                });
            } else throw new Error("invalid token", err); // if token is invalid
        });
    } catch (error) {
        res.status(500).send({ message: error.message, ...error });
    }
};

module.exports = { authUser };
