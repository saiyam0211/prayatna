const User = require("../models/user_model");

const findUserByEmail = async(email) => {
    return await User.findOne({email});
};

const findUserByEmailByPassword = async(email) => {
    return await User.findOne({email}).select('+password');
};

const findUserById = async(id) => {
    return await User.findById(id);
};

const createUser = async({name, password, dob, gender, mobile, admissionNumber}) => {
    const newUser = new User({name, password, dob, gender, mobile, admissionNumber});
    await newUser.save();
    return newUser;
};

const getAllUserUrlsDao = async(id) => {
    return await UrlModel.find({user: id});
}

module.exports = {
    findUserByEmail,
    findUserByEmailByPassword,
    findUserById,
    createUser,
    getAllUserUrlsDao
}