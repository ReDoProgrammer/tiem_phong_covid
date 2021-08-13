const router = require('express').Router();
const Account = require('../MODELS/account_model');
const Unit = require('../MODELS/unit_model');
const Dept = require('../MODELS/dept_model');
const jwt = require("jsonwebtoken");
const { authenticateToken } = require('../middlewares/user_authenticate');


router.get('/',(req,res)=>{
    res.render('account/index', {
        name: 'Danh sách tài khoản bạn quản lý',
        layout: 'layouts/user_layout'
    });
})




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
                    {
                        user_id: user._id.toString(),
                        is_mod: user.is_mod,
                        unit_id:user.unit,
                    }, process.env.ACCESS_TOKEN_SECRET
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

router.get('/list',authenticateToken,(req,res)=>{
    let {search} = req.query;
    Account.find({
        created_by:req.user.user_id,
        $or:[
            {username:{ "$regex": search, "$options": "i" }},
            {fullname:{ "$regex": search, "$options": "i" }},
            {phone:{ "$regex": search, "$options": "i" }},
            {phone:{ "$regex": search, "$options": "i" }},
            {email:{ "$regex": search, "$options": "i" }}
        ]
    })
    .sort({dept:1})
    .populate('dept','-_id name')
    .exec()
    .then(accounts=>{     
       return res.status(200).json({
           msg:'Load danh sách tài khoản thành công!',
           accounts
       })
    })
    .catch(err=>{
       return res.status(500).json({
           msg:`Load danh sách tài khoản thất bại. Lỗi: ${new Error(err.message)}`
       })
    })
})

router.get('/detail',authenticateToken,(req,res)=>{
    let {accId} = req.query;
    Account.findById(accId)
    .exec()
    .then(acc=>{
        return res.status(200).json({
            msg:'Load thông tin tài khoản thành công!',
            acc
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Load thông tin tài khoản thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})

router.get('/dept',authenticateToken,(req,res)=>{
    let logged_in_user = req.user;
    Dept.find({unit:logged_in_user.unit_id})
    .exec()
    .then(depts =>{
        return res.status(200).json({
            msg:'Load danh sách phòng ban thành công!',
            depts
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Load danh sách phòng ban thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})

router.post('/', authenticateToken, (req, res) => {
    let logged_in_user = req.user;
    if (logged_in_user.is_mod) {
        let {dept,username,password,fullname,phone,email} = req.body;
        let unit = req.user.unit_id;
        console.log({unit,dept,username,password,fullname,phone,email});
        Account.countDocuments({username:username})
        .exec()
        .then(count=>{
            if(count == 0){
                var acc = new Account({
                    unit,
                    dept,
                    username,
                    password,
                    fullname,
                    phone,
                    email,
                    created_by: logged_in_user.user_id
                })

                acc.save()
                .then(_=>{
                    return res.status(201).json({
                        msg:'Tạo tài khoản mới thành công!'
                    })
                })
                .catch(err=>{
                    return res.status(500).json({
                        msg:`Tạo tài khoản thất bại. Lỗi: ${new Error(err.message)}`
                    })
                })
            }else{
                return res.status(409).json({
                    msg:'Tài khoản này đã tồn tại trong hệ thống!'
                });
            }
        })
        .catch(err=>{
            return res.status(500).json({
                msg:`Lỗi kiểm tra tài khoản: ${new Error(err.message)}`
            })
        })
       
    } else {
        return res.status(403).json({
            msg: 'Bạn không có quyền truy cập chức năng này!'
        })
    }
})

router.put('/', authenticateToken, (req, res) => {
    let {accId,dept,password,fullname,email,phone} = req.body;
    Account
    .findByIdAndUpdate(
        accId,
        {
            password:password,
            fullname:fullname,
            email:email,
            phone:phone
        },
        (err,acc)=>{
            if(err){
                return res.status(500).json({
                    msg:`Cập nhật thông tin tài khoản thất bại. Lỗi: ${new Error(err.message)}`
                })
            }else{                
                return res.status(200).json({
                    msg:'Cập nhật thông tin tài khoản thành công!'
                })
            }

        }
    )
})

router.delete('/',authenticateToken,(req,res)=>{
    let {accId} = req.body;
    Account.findOneAndDelete({_id:accId})
    .exec()
    .then(_=>{
        return res.status(200).json({
            msg:'Xóa tài khoản thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa tài khoản thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})


router.get('/profile',authenticateToken,(req,res)=>{
    Account.findById(req.user.user_id)
    .populate('unit','-_id name is_mod unit')
    .exec()
    .then(user=>{
        return res.status(200).json({
            msg:'Load thông tin username thành công!',
            user:user
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Load thông tin user thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})

module.exports = router;