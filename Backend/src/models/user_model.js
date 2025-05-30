const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    admissionNumber: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password);
};

userSchema.set('toJSON', {
  transform: function (doc, ret){
    delete ret.password
    delete ret._v
    return ret;
  }
});

userSchema.pre('save', async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;
