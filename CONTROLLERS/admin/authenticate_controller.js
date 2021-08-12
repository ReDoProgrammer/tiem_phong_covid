const router = require('express').Router();
const Account = require('../../MODELS/account_model');
const jwt = require("jsonwebtoken");

router.get('/login', (req, res) => {
    res.render('admin/authenticate/login', {
        layout: 'admin/authenticate/login'
    });
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    Account.findOne({ username: username, password: password,is_admin:true})
        .then((user) => {
            if (user == null) {
                return res.status(401).json({
                    msg: 'Tài khoản hoặc mật khẩu không đúng!'
                });
            } else {
                if(user.is_admin){
                    const access_token = jwt.sign(
                        {
                            user_id:user._id.toString(),       
                            is_admin:user.is_admin
                        },               
                        process.env.ACCESS_TOKEN_SECRET
                    );
                    return res.status(200).json({
                        msg: "Login successfully!",
                        access_token: access_token,
                    });
                }else{
                    return res.status(403).json({
                        msg:'Bạn không có quyền truy cập chức năng này'
                    })
                }
               
            }
        })
        .catch(err => {
            return res.status(500).json({
                msg:`Lỗi đăng nhập admin: ${new Error(err.message)}`
            })
        })

})

module.exports = router;