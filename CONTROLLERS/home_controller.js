const router = require('express').Router();
const { authenticateToken } = require('../middlewares/user_authenticate');

const Doc = require('../MODELS/docs_model');

router.get('/', (req, res) => {
    res.render('home/index', {
        name: 'Home',
        layout: 'layouts/user_layout'
    });
});



router.get('/doc', (req, res) => {
    Doc.find()
        .exec()
        .then(docs => {
            return res.status(200).json({
                msg: 'Load danh sách tài liệu thành công!',
                docs
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách tài liệu thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
})





module.exports = router;