const router = require('express').Router();
const { authenticateToken } = require('../MIDDLEWARES/user_authenticate');
const Province = require('../MODELS/province_model');


router.get('/', authenticateToken, (req, res) => {
    Province
    .find()
    .exec()
    .then(provinces=>{
        return res.status(200).json({
            msg: 'Load danh sách tỉnh thành công!',
            provinces
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:'Load danh sách tỉnh thất bại!!!',
            error: new Error(err.message)
        });
    })
})

module.exports = router;