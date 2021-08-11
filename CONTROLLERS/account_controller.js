const router = require('express').Router();
const Account = require('../MODELS/account_model');
const Unit = require('../MODELS/unit_model');
const jwt = require("jsonwebtoken");

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    Account
    .findOne({ username: username, password: password })
    .then((user) => {
        if (user == null) {
            return res.status(401).json({
                msg: 'Tài khoản hoặc mật khẩu không đúng!'
            });
        } else {
            const access_token = jwt.sign(
                user._id.toString(),
                process.env.ACCESS_TOKEN_SECRET
            );
            return res.status(200).json({
                msg: "Đăng nhập thành công!",
                access_token: access_token,
            });
        }
    })
    .catch(err => {
        return res.status(500).json({
            msg: `Đăng nhập thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})


module.exports = router;