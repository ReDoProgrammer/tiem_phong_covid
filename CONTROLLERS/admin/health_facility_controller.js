const router = require('express').Router();
const HF = require('../../MODELS/health_facility_model');
const { authenticateToken } = require('../../MIDDLEWARES/authenticate');




router.get('/',(req,res)=>{
    res.render('admin/HF/index', {
        name: 'Danh sách cơ sở y tế',
        layout: 'layouts/admin_layout'
    });    
})

router.get('/list',authenticateToken,(req,res)=>{
   HF.find()
   .then(hf=>{
        return res.status(200).json({
            msg:`Load danh sách cơ sở y tế thành công!`,
            hf:hf
        })
   })
   .catch(err=>{
       return res.status(500).json({
           msg:`Load danh sách csyt thất bại. Lỗi: ${new Error(err.message)}`
       })
   })
});

router.post('/',authenticateToken,(req,res)=>{
    let {code,name} = req.body;
    let hf = new HF({
        code,
        name
    });
    hf.save()
    .then(_=>{
        return res.status(201).json({
            msg:'Thêm mới csyt thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Thêm mới csyt thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})


router.delete('/',authenticateToken,(req,res)=>{
    let {hfId} = req.body;
    HF.findOneAndDelete({_id:hfId})
    .then(_=>{
        return res.status(200).json({
            msg:'Xóa csyt thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa csyt thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})
module.exports = router;