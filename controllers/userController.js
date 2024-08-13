const { get } = require('../routes/userRoutes');
const userService = require('../services/userService');

async function signUp(req, res) {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = await userService.signUpUser(firstName, lastName, email, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function signIn(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userService.signInUser(email, password);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, password, profilePicture } = req.body;
        const updatedUser = await userService.updateUser(id, firstName, lastName, email, password, profilePicture);
        res.status(200).json(updatedUser);
        console.log('Received userId', id);
    } catch(error) {
        res.status(400).json({ error: error.message });
    }
}

async function getUser(req, res) {
    try {
        const userId = req.params.id;
        const user = await userService.getUserById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    signUp,
    signIn,
    updateUser,
    getUser
}