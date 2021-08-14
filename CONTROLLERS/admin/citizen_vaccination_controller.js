const router = require('express').Router();
const CV = require('../../MODELS/citizen_vaccination_model');
const { authenticateToken } = require('../../MIDDLEWARES/authenticate');


router.get('/', (req, res) => {
    res.render('admin/cv/index', {
        name: 'Danh sách hồ sơ từ các đơn vị',
        layout: 'layouts/admin_layout'
    });
})

router.put('/error', authenticateToken, (req, res) => {
    let { cvId, err } = req.body;
    CV.findOneAndUpdate({ _id: cvId }, {
        error_note: err,
        is_correct: false
    }, (err, cv) => {
        if (err) {
            return res.status(500).json({
                msg: `Cập nhật lỗi hồ sơ thất bại. Lỗi: ${new Error(err.message)}`
            })
        }
        return res.status(200).json({
            msg:'Cập nhật lỗi hồ sơ thành công!'
        });
    })
})



router.get('/list', authenticateToken, (req, res) => {
    let { search } = req.query;
    CV.find({
        $or: [
            { fullname: { "$regex": search, "$options": "i" } },
            { phone: { "$regex": search, "$options": "i" } },
            { email: { "$regex": search, "$options": "i" } },
            { id_number: { "$regex": search, "$options": "i" } },
            { hi_no: { "$regex": search, "$options": "i" } }
        ]
    })
        .populate('nation_id', '-_id name')
        .populate('po_id', '-_id name')
        .populate('job_id', '-_id name')
        .populate('nationality_id', '-_id name')
        .populate('prov_id', '-_id name')
        .populate('dist_id', '-_id name')
        .populate('ward_id', '-_id name')
        .populate('hf_id', '-_id name')
        .populate('vaccin1', '-_id name')
        .populate('vaccin2', '-_id name')
        .populate('created_by', 'fullname')
        .exec()
        .then(cv => {
            return res.status(200).json({
                msg: 'Load danh sách tiêm chủng Covid-19 thành công!',
                cv: cv,
                user_id: req.user.user_id,
                error_editable: req.user.is_mod
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách tiêm chủng Covid-19 thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
});


router.delete('/destroy',authenticateToken,(req,res)=>{
    CV.deleteMany()
    .then(_=>{
        return res.status(200).json({
            msg:'Xóa toàn bộ hồ sơ thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa toàn bộ hồ sơ thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})


router.post('/drop',authenticateToken,(req,res)=>{
        try {
            CV.collection.drop();
            return res.status(200).json({
                msg:'Drop collection successfully!'
            });
        } catch (error) {
            return res.status(500).json({
                msg:`Drop collection failed. Error: ${new Error(err.message)}`
            })
        }
})

router.get('/excel', authenticateToken, (req, res) => {
    CV.find()
        .populate('nation_id', '-_id code')
        .populate('nationality_id', '-_id code')
        .populate('prov_id', '-_id code name')
        .populate('dist_id', '-_id code name')
        .populate('ward_id', '-_id code name')
        .populate('po_id', '-_id code')
        .populate('job_id', '-_id name')
        .populate('unit_id', '-_id name')
        .populate('hf_id', '-_id code')
        .populate('vaccin1', '-_id name')
        .populate('vaccin2', '-_id name')
        .exec()
        .then(cv => {
            return res.status(200).json({
                msg: 'Load danh sách hồ sơ thành công!',
                cv
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách hồ sơ thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
})


module.exports = router;