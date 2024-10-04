const ApiError = require("../error/ApiError");
const jwt = require('jsonwebtoken');
const { User } = require("../models/model");

const generateJwt = (id, name, status) => {
    return jwt.sign({ id: id, name: name, status: status }, process.env.SECRET_KEY, { expiresIn: '24h' })
}

class UserController {
    async login(req,res,next){
        try{
            const {id, name, status} = req.body
            const user = await User.create({
                id: id,
                name: name,
                status
            })
            const token = generateJwt(user.id, user.name, user.status);
            res.json({ token: token });
        }catch(err){
            return next(ApiError.badRequest(err.message));
        }
    }
}

module.exports = new UserController();