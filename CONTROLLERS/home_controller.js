const router = require('express').Router();
const { authenticateToken } = require('../middlewares/user_authenticate');
const Account = require('../MODELS/account_model');
const Unit = require('../MODELS/unit_model');
router.get('/',(req,res)=>{
    res.render('home/index', {
        name: 'Home',
        layout: 'layouts/user_layout'
    });
});


router.get('/profile',authenticateToken,(req,res)=>{
    Account.findById(req.user)
    .populate('unit','-_id name')
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