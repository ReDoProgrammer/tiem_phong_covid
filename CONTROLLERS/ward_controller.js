const router = require('express').Router();
const { authenticateToken } = require('../MIDDLEWARES/user_authenticate');
const Ward = require('../MODELS/ward_model');


router.get('/', authenticateToken, (req, res) => {
    let { distId } = req.query;
    Ward
    .find({dist:distId})
    .exec()
    .then(wards=>{
        return res.status(200).json({
            msg: 'Load danh sách xã phường thành công!',
            wards
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:'Load danh sách xã phường thất bại!!!',
            error: new Error(err.message)
        });
    })
})

module.exports = router;