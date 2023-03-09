const User = require('../models/User');
const hashPassword = require('../utils/hash-password');

exports.postSignUp = async (req, res, next) => {
    try {
        const first_name = req.body.first_name ? req.body.first_name.trim() : undefined;
        const last_name = req.body.last_name ? req.body.last_name.trim() : undefined;
        const email = req.body.email ? req.body.email.trim().toLowerCase() : undefined;
        const contact = req.body.contact ? String(req.body.contact).trim() : undefined;
        const dob = req.body.dob ? req.body.dob.trim() : undefined;
        const password = req.body.password ? req.body.password.trim() : undefined;
        if (!password) {
            return res.json({ result: false, status: 400, message: "Invalid password." })
        }
        if (!first_name || first_name.length === 0) {
            return res.json({ result: false, status: 400, message: "Please enter first name." })
        }
        if (email && email.trim().length > 0) {
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.json({ result: false, status: 400, message: "User already exists." })
            }
            if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
                return res.json({ result: false, status: 400, message: "Please enter a valid email." });
            }
        }
        if (contact && contact.trim().length > 0) {
            const userExists = await User.findOne({ contact });
            if (userExists) {
                return res.json({ result: false, status: 400, message: "User already exists." })
            }
            if (!(/^[0-9]+$/.test(contact)) || contact.length !== 10) {
                return res.json({ result: false, status: 400, message: "Please enter a valid contact." });
            }
        }
        if (!email || !contact) {
            return res.json({ result: false, status: 400, message: "Please enter all details." });
        }
        const newUser = await new User({ first_name, last_name, email, contact, dob, password: hashPassword(password) }).save();
        res.json({ result: newUser._id, status: 200, message: "ok" });
    } catch (error) {
        next(error);
    }
}
