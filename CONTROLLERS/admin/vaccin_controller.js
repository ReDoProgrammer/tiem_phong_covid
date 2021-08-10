const router = require('express').Router();
const Vaccin = require('../../MODELS/vaccin_model');
const { authenticateToken } = require('../../middlewares/authenticate');


router.get('/',(req,res)=>{
    res.render('admin/vaccin/index', {
        name: 'Danh sách loại vaccin',
        layout: 'layouts/admin_layout'
    });
});


router.get('/list',authenticateToken,(req,res)=>{
   Vaccin.find()
   .then(vc=>{
        return res.status(200).json({
            msg:`Load danh sách loại vaccin thành công!`,
            vc:vc
        })
   })
   .catch(err=>{
       return res.status(500).json({
           msg:`Load danh sách loại vaccin thất bại. Lỗi: ${new Error(err.message)}`
       })
   })
});

router.post('/',authenticateToken,(req,res)=>{
    let {name} = req.body;
    let v = new Vaccin({
        name
    });
    v.save()
    .then(_=>{
        return res.status(201).json({
            msg:'Thêm mới loại vaccin thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Thêm mới loại vaccin thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})


router.delete('/',authenticateToken,(req,res)=>{
    let {vId} = req.body;
    Vaccin.findOneAndDelete({_id:vId})
    .then(_=>{
        return res.status(200).json({
            msg:'Xóa loại vaccin thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa loại vaccin thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})
module.exports = router;