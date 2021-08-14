const router = require('express').Router();
const Account = require('../../MODELS/account_model');
const Unit = require('../../MODELS/unit_model');
const { authenticateToken } = require('../../MIDDLEWARES/authenticate');


router.get('/', (req, res) => {
    res.render('admin/account/index', {
        name: 'Danh sách tài khoản',
        layout: 'layouts/admin_layout'
    });
});

router.get('/init', (req, res) => {
    Account.countDocuments()
        .then(c => {
            if (c == 0) {
                Unit.findOne()
                    .then(u => {
                        var account = new Account({
                            username: 'admin',
                            password: 'admin',
                            fullname: 'Phạm Đức Thiện',
                            is_admin: true,
                            unit: u._id
                        });
                        account.save()
                            .then(_ => {
                                return res.status(201).json({
                                    msg: 'Khởi tạo tài khoản admin thành công!'
                                })
                            })
                            .catch(err => {
                                return res.status(500).json({
                                    msg: `Lỗi khởi tạo tài khoản admin: ${new Error(err.message)}`
                                })
                            })
                    })
                    .catch(err => {
                        return res.status(500).json({
                            msg: `Lỗi không tìm thấy đơn vị. Vui lòng khởi tạo danh sách đơn vị trước để tiếp tục!`
                        })
                    })
            } else {
                return res.status(409).json({
                    msg: `Tài khoản admin đã tồn tại trong hệ thống!`
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Lỗi kiểm tra số account đã có: ${new Error(err.message)}`
            })
        })
})

router.get('/list', authenticateToken, (req, res) => {
    let { search } = req.query;
    Account.find({
        $or: [
            { username: { "$regex": search, "$options": "i" } },
            { fullname: { "$regex": search, "$options": "i" } },
            { phone: { "$regex": search, "$options": "i" } },
            { phone: { "$regex": search, "$options": "i" } },
            { email: { "$regex": search, "$options": "i" } }
        ],
        is_admin: false
    })
        .populate('unit', '-_id name')
        .exec()
        .then(accounts => {

            return res.status(200).json({
                msg: 'Load danh sách tài khoản thành công!',
                accounts: accounts
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách tài khoản thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
})


router.post('/', authenticateToken, (req, res) => {
    let { unitId, deptId, username, password, fullname, phone, email } = req.body;
    Account.countDocuments({ username })
        .then(count => {
            if (count == 0) {
                let acc = new Account({
                    unit: unitId,
                    dept: deptId,
                    username,
                    password,
                    fullname,
                    phone,
                    email,
                    is_mod: true,
                    created_by: req.user.user_id
                })
                acc.save()
                    .then(_ => {
                        return res.status(201).json({
                            msg: 'Thêm mới tài khoản thành công!'
                        })
                    })
                    .catch(err => {
                        return res.status(500).json({
                            msg: `Tạo mới tài khoản thất bại. Lỗi: ${new Error(err.message)}`
                        })
                    })
            } else {
                return res.status(409).json({
                    msg: 'Tài khoản này đã tồn tại trong hệ thống!!!'
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Lỗi kiểm tra tài khoản: ${new Error(err.message)}`
            })
        })

})

router.put('/', authenticateToken, (req, res) => {
    let { current_password, new_password } = req.body;
    Account.findOneAndUpdate({ _id: req.user.user_id, password: current_password }, {
        password:new_password
    }, (err, acc) => {
        if (err) {
            return res.status(500).json({
                msg: `Đổi mật khẩu admin thất bại! Lỗi: ${new Error(err.message)}`
            })
        }
        if (acc == null) {
            return res.status(404).json({
                msg: 'Mật khẩu hiện tại không đúng. Vui lòng kiểm tra lại!'
            })
        } else {
            return res.status(200).json({
                msg: 'Cập nhật mật khẩu admin thành công!'
            })
        }


    })
})
module.exports = router;