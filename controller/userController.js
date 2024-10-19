const ApiError = require("../error/ApiError");
const jwt = require('jsonwebtoken');
const { User } = require("../models/model");

const generateJwt = (id, name, secondName, phone, email, status) => {
    const payload = { id, name };
    if (secondName || phone || email || status) {
        payload.secondName = secondName;
        payload.phone = phone;
        payload.email = email;
        payload.status = status;
    }
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' });
}

class UserController {
    async login(req, res, next) {
        try {
            const { id, name, secondName, phone, email, deleted, status, secretkey } = req.body
            const userId = id ? id : req.user.id;

            if (!userId) {
                return next(ApiError.badRequest("ID бязательны для входа."));
            }
            const candidate = await User.findByPk(userId)
            if (secretkey == process.env.SECRET_KEY && status) {
                if (candidate) {
                    await User.update(
                        { name: name, status: status, secondName: secondName, phone: phone, email: email },
                        { where: { id: userId } }
                    )
                    const updatedUser = await User.findByPk(userId);

                    const token = generateJwt(updatedUser.id, updatedUser.name, updatedUser.secondName, updatedUser.phone, updatedUser.email, updatedUser.status)
                    return res.json({ token: token })
                } else {
                    await User.create({
                        id: userId,
                        name: name,
                        secondName,
                        phone,
                        email,
                        deleted,
                        status
                    });

                    const token = generateJwt(userId, name, secondName, phone, email);
                    return res.json({ token: token });
                }
            }
            if (candidate) {
                await User.update(
                    { name: name, secondName: secondName, phone: phone, email: email },
                    { where: { id: userId } }
                );

                const updatedUser = await User.findByPk(userId);
                const token = generateJwt(updatedUser.id, updatedUser.name, updatedUser.secondName, updatedUser.phone, updatedUser.email);
                return res.json({ token: token });
            }
            const user = await User.create({
                id: userId,
                name: name,
                secondName,
                phone,
                email,
            })
            const token = generateJwt(user.id, user.name, user.secondName, user.phone, user.email);
            res.json({ token: token });
        } catch (err) {
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
}

module.exports = new UserController();