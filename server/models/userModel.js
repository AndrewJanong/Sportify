const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },  
    password: {
        type: String,
        require: true
    }
})

userSchema.statics.signup = async function(username, email, password) {
    if (!username || !email || !password) {
        throw Error('All fields must be filled!');
    }

    if (!validator.isEmail(email)) {
        throw Error('Email entered is not valid');
    }

    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough');
    }

    const existsEmail = await this.findOne({ email });
    const existsUsername = await this.findOne({ username });

    if (existsEmail) {
        throw Error('Email is already in use');
    }

    if (existsUsername) {
        throw Error('Username is already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ username, email, password: hash });

    return user;
}


userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled!');
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Incorrect Password');
    }

    return user;
}

module.exports = mongoose.model('User', userSchema);