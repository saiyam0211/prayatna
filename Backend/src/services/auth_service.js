const { findUserByEmail, createUser, findUserByEmailByPassword } = require("../dao/user_dao");
const User = require("../models/user_model");
const { ConflictError } = require("../utils/errorHandler");
const { signToken } = require("../utils/helper");

const registerUser = async({name, password, dob, gender, mobile, admissionNumber}) => {
    const user = await findUserByEmail(admissionNumber);
    if(user){
        throw new ConflictError("User already exists"); 
    }
    const newUser = await createUser({name, password, dob, gender, mobile, admissionNumber});
    const token = await signToken({id: newUser._id});
    return {newUser, token};
};

const loginUser = async (identifier, password) => {
    let user;

    if (typeof identifier === 'string' && identifier.includes('@')) {
        // identifier is email
        user = await findUserByEmailByPassword(identifier);
    } else {
        // identifier is admissionNumber (string, could be alphanumeric)
        user = await User.findOne({ admissionNumber: identifier }).select('+password');
    }

    if (!user) {
        throw new Error("Invalid email/admission number or password");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error("Invalid email/admission number or password");
    }

    const token = signToken({ id: user._id });
    return { token, user };
};


module.exports = {
    registerUser,
    loginUser
}