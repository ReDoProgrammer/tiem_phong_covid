const router = require('express').Router();
const Job = require('../../MODELS/job_model');
const { authenticateToken } = require('../../middlewares/authenticate');


router.get('/',(req,res)=>{
    res.render('admin/job/index', {
        name: 'Danh sách nghề nghiệp',
        layout: 'layouts/admin_layout'
    });
});


router.get('/list',authenticateToken,(req,res)=>{
   Job.find()
   .then(jb=>{
        return res.status(200).json({
            msg:`Load danh sách nghề nghiệp thành công!`,
            jb:jb
        })
   })
   .catch(err=>{
       return res.status(500).json({
           msg:`Load danh sách nghề nghiệp thất bại. Lỗi: ${new Error(err.message)}`
       })
   })
});

router.post('/',authenticateToken,(req,res)=>{
    let {name} = req.body;
    let j = new Job({
        name
    });
    j.save()
    .then(_=>{
        return res.status(201).json({
            msg:'Thêm mới nghề nghiệp thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Thêm mới nghề nghiệp thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})


router.delete('/',authenticateToken,(req,res)=>{
    let {jId} = req.body;
    Job.findOneAndDelete({_id:jId})
    .then(_=>{
        return res.status(200).json({
            msg:'Xóa nghề nghiệp thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa nghề nghiệp thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})
module.exports = router;