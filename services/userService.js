const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../env');


//USER Registration
async function signUpUser(firstName, lastName, email, password, profilePicture){
    const existingUser = await User.findOne({where: {email}});
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword, profilePicture });

    //Generate a token for the newly registered user
    const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {expiresIn: '1h'})
    return (user, token);
}

//user login
async function signInUser(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Return user details including profile picture and token
    return {
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePicture: user.profilePicture  // Include profile picture in the response
        },
        token
    };
}


//update user
async function updateUser(id, firstName, lastName, email, password, profilePicture) {
    console.log('User ID:', id);  // Log userId to verify correct input

    // Use User model to find by primary key
    const user = await User.findByPk(id);  // Ensure this line correctly fetches the user

    if (!user) {
        console.log('User not found with ID:', id);  // Log if the user is not found
        throw new Error('User not found');
    }

    // Update the fields only if they are provided
    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.profilePicture = profilePicture || user.profilePicture;

    // Save the updated user object
    await user.save();

    return user;
}


//get user by id
async function getUserById(userId) {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = {
    signUpUser,
    signInUser,
    updateUser,
    getUserById
}