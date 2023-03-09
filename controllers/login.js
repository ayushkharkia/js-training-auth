const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.postLogin = async (req, res, next) => {
    try {
        const user_email_phone = req.body.user_email_phone && req.body.user_email_phone.trim().length > 0 ? req.body.user_email_phone.trim().toLowerCase() : undefined;
        if (!user_email_phone) {
            return res.json({ status: 400, message: "Please enter email or contact number.", result: false });
        }
        const user = await User.findOne({ $or: [{ email: user_email_phone }, { contact: user_email_phone }] }).select('_id contact password');
        if (!user) {
            return res.json({ status: 400, message: "Email or contact number does not exists.", result: false });
        }
        if (!req.body.password || !user.validatePassword(req.body.password)) {
            return res.json({ status: 400, message: "Invalid password", result: false });
        }
        const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: 864000 });

        return res.json({ status: 200, message: "ok", result: user._id, token });
    } catch (error) {
        next(error);
    }
}