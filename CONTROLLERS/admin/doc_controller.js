const router = require('express').Router();
const Doc = require('../../MODELS/docs_model');
const { authenticateToken } = require('../../middlewares/authenticate');

router.get('/',(req,res)=>{
    res.render('admin/doc/index', {
        name: 'Danh sách tài liệu',
        layout: 'layouts/admin_layout'
    });
})



router.get('/list',authenticateToken,(req,res)=>{
   Doc.find()
   .then(docs=>{
        return res.status(200).json({
            msg:`Load danh sách tài liệu thành công!`,
            docs
        })
   })
   .catch(err=>{
       return res.status(500).json({
           msg:`Load danh sách tài liệu thất bại. Lỗi: ${new Error(err.message)}`
       })
   })
});

router.post('/',authenticateToken,(req,res)=>{
    let {name,url} = req.body;
    let doc = new Doc({
        name,
       url
    });
    doc.save()
    .then(_=>{
        return res.status(201).json({
            msg:'Tạo mới tài liệu thành công!!!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Thêm mới tài liệu thất bại. Lỗi: ${new Error(err.message)}`
        })
    })  
})


router.put('/',authenticateToken,(req,res)=>{
    let {docId,name,url}=req.body;
    Doc.findOneAndUpdate({
        _id:docId
    },{
        name,
        url
    },(err,doc)=>{
        if(err){
            return res.status(500).json({
                msg:`Cập nhật tài liệu thất bại. Lỗi: ${new Error(err.message)}`
            })
        }
        return res.status(200).json({
            msg:`Cập nhật thông tin tài liệu thành công!`
        })
    })
})
router.delete('/',authenticateToken,(req,res)=>{
    let {docId} = req.body;
    Doc.findOneAndDelete({_id:docId})
    .then(_=>{
        return res.status(200).json({
            msg:'Xóa tài liệu thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa tài liệu thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})

module.exports = router;