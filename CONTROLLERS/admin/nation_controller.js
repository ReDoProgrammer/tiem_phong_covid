const router = require('express').Router();
const Nation = require('../../MODELS/nation_model');
const { authenticateToken } = require('../../MIDDLEWARES/authenticate');
const nationality_model = require('../../MODELS/nationality_model');



router.get('/',(req,res)=>{
    res.render('admin/Nation/index', {
        name: 'Danh sách các dân tộc',
        layout: 'layouts/admin_layout'
    });    
})

router.get('/list',authenticateToken,(req,res)=>{
   Nation.find()
   .then(nt=>{
        return res.status(200).json({
            msg:`Load danh sách các dân tộc thành công!`,
            nt:nt
        })
   })
   .catch(err=>{
       return res.status(500).json({
           msg:`Load danh sách các dân tộc thất bại. Lỗi: ${new Error(err.message)}`
       })
   })
});

router.post('/',authenticateToken,(req,res)=>{
    let {code,name} = req.body;
    let nt = new Nation({
        code,
        name
    });
    nt.save()
    .then(_=>{
        return res.status(201).json({
            msg:'Thêm mới dân tộc thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Thêm mới dân tộc thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})


router.delete('/',authenticateToken,(req,res)=>{
    let {ntId} = req.body;
    Nation.findOneAndDelete({_id:ntId})
    .then(_=>{
        return res.status(200).json({
            msg:'Xóa dân tộc thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa dân tộc thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})
module.exports = router;