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
    },
    picture: {
        type: String
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'Friends'
    }],
    verified: {
        type: Boolean
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

    if (existsEmail && existsEmail.verified) {
        throw Error('Email is already in use');
    }

    if (existsUsername && existsUsername.verified) {
        throw Error('Username is already in use');
    }

    if (existsEmail && !existsEmail.verified) {
        await this.deleteMany({email});
    }

    if (existsUsername && !existsUsername.verified) {
        await this.deleteMany({username});
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const friends = [];
    const verified = false;

    const user = await this.create({ username, email, password: hash, friends, verified});

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
        throw Error('Incorrect password');
    }

    if (user && !user.verified) {
        throw Error('User is not verified. Sign up again')
    }

    return user;
}

module.exports = mongoose.model('User', userSchema);