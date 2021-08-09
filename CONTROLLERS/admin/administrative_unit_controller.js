const router = require('express').Router();
const { authenticateToken } = require('../../middlewares/authenticate');

const Nationality = require('../../MODELS/nationality_model');

router.get('/',(req,res)=>{
    res.render('admin/administrative_unit/index', {
        name: 'Danh sách đơn vị hành chính',
        layout: 'layouts/admin_layout'
    });
});

router.get('/list',authenticateToken,(req,res)=>{
    Nationality.find()
    .then(nats=>{
        return res.status(200).json({
            msg:'Load danh sách quốc tịch thành công!',
            nats:nats
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Load danh sách quốc tịch thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})

router.post('/',authenticateToken,(req,res)=>{
    let {code,name} = req.body;
    var nat = new Nationality({
        code,
        name
    });
    nat.save()
    .then(_=>{
        return res.status(201).json({
            msg:'Thêm mới quốc tịch thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Thêm mới quốc tịch thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})

router.delete('/',authenticateToken,(req,res)=>{
    let {natId} = req.body;
    Nationality.findOneAndDelete({_id:natId})
    .then(_=>{
        return res.status(200).json({
            msg:'Xóa quốc tịch thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa quốc tịch thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})

module.exports = router;