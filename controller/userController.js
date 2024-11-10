const ApiError = require("../error/ApiError");
const jwt = require('jsonwebtoken');
const { User } = require("../models/model");

const generateJwt = (id, name, secondName, phone, email, status) => {
    const payload = { id, name };
    if (secondName || phone || email || status) {
        payload.secondName = secondName;
        payload.phone = phone;
        payload.email = email;
        if (status) {
            payload.status = status;
        }
    }
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
}

class UserController {
    async login(req, res, next) {
        try {
            const { id, name, secondName, phone, email, deleted, status, secretkey } = req.body

            const user = await User.create({
                id: id,
                name: name,
                secondName
            })
            const token = generateJwt(user.id, user.name, user.secondName, user.phone, user.email);
            res.json({ token: token });
        } catch (err) {
            console.log('====================================');
            console.log(err);
            console.log('====================================');
            return next(ApiError.badRequest(err.message));
        }
    }
    async getAllUser(req, res, next) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (err) {
            return next(ApiError.internal(err.message));
        }
    }
    async getById(req, res, next) {
        try {
            const userId = req.user.id
            const user = await User.findByPk(userId);
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
            res.json({
                name: user.name,
                secondName: user.secondName,
                phone: user.phone,
                email: user.email
            });
        } catch (err) {
            return next(ApiError.internal(err.message));
        }
    }
    async update(req,res,next){
        try {
            const userId = req.user.id
            const { name, secondName, phone, email } = req.body
            const user = await User.findByPk(userId)
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
            await user.update({
                name: name || user.name,
                secondName: secondName || user.secondName,
                phone: phone || user.phone,
                email: email || user.email
            });
            res.json({ message: 'Пользователь успешно изменен' });
        } catch (err) {
            return next(ApiError.internal(err.message));
        }
    }
    async auth(req, res, next) {
        try {
            const { id, name, secondName } = req.body
            const candidate = await User.findByPk(id)
            if (!candidate) {
                return next(ApiError.forbidden('Пользователь не найден'));
            }
            const user = await User.findByPk(id)    ;
            const statusUser = user.status === 'ADMIN' ? user.status : undefined
            const token = generateJwt(user.id, user.name, user.secondName, user.phone, user.email, statusUser);
            res.json({ token: token });
        } catch (err) {
            return next(ApiError.badRequest(err.message));
        }
    }
}

module.exports = new UserController();