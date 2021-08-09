const router = require('express').Router();
const PO = require('../../MODELS/priority_object_model');
const { authenticateToken } = require('../../middlewares/authenticate');



router.get('/',(req,res)=>{
    res.render('admin/PO/index', {
        name: 'Danh sách đối tượng ưu tiên',
        layout: 'layouts/admin_layout'
    });    
})

router.get('/list',authenticateToken,(req,res)=>{
   PO.find()
   .then(pos=>{
        return res.status(200).json({
            msg:`Load danh sách đối tượng ưu tiên thành công!`,
            pos:pos
        })
   })
   .catch(err=>{
       return res.status(500).json({
           msg:`Load danh sách đối tượng ưu tiên thất bại. Lỗi: ${new Error(err.message)}`
       })
   })
});

router.post('/',authenticateToken,(req,res)=>{
    let {code,name} = req.body;
    let po = new PO({
        code,
        name
    });
    po.save()
    .then(_=>{
        return res.status(201).json({
            msg:'Thêm mới đối tượng ưu tiên thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Thêm mới đối tượng thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})


router.delete('/',authenticateToken,(req,res)=>{
    let {poId} = req.body;
    PO.findOneAndDelete({_id:poId})
    .then(_=>{
        return res.status(200).json({
            msg:'Xóa đối tượng ưu tiên thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa đối tượng ưu tiên thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})
module.exports = router;