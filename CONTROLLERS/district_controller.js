const router = require('express').Router();
const { authenticateToken } = require('../MIDDLEWARES/user_authenticate');
const District = require('../MODELS/district_model');


router.get('/', authenticateToken, (req, res) => {
    let { provId } = req.query;
    District
    .find({prov:provId})
    .exec()
    .then(districts=>{
        return res.status(200).json({
            msg: 'Load danh sách quận huyện thành công!',
            districts
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:'Load danh sách quận huyện thất bại!!!',
            error: new Error(err.message)
        });
    })
})

module.exports = router;