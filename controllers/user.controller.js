const {UserModel} = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();


const registerUser = async (req, res) => {
    const { name, email, gender, password } = req.body;
    try {
        const hashPass = bcrypt.hashSync(password, 9);
        const user = await UserModel({
            name,
            email,
            password: hashPass,
            gender,
        });
        await user.save();
        res.send({ message: "User created successfully", user });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message, ...error });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) throw new Error("User not found");

        const isPass = bcrypt.compareSync(password, user.password); // true
        if (!isPass) throw new Error("invalid password");

        const refreshToken = jwt.sign({}, process.env.refreshSecret, {
            expiresIn: "1h",
        });
        const accessToken = jwt.sign({}, process.env.accessSecret, {
            expiresIn: "7d",
        });
        console.log(accessToken, refreshToken);
        res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "none", secure: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "none", secure: true });
        res.send({ message: "User logged in successfully", user });
    } catch (error) {
        res.status(500).send({ message: error.message, ...error });
    }
};

module.exports = { registerUser, loginUser };