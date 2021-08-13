const router = require('express').Router();
const Dept = require('../../MODELS/dept_model');
const { authenticateToken } = require('../../MIDDLEWARES/authenticate');




router.get('/',authenticateToken,(req,res)=>{
    let {unitId} = req.query;  
   Dept.find({unit:unitId})
   .then(depts=>{
        return res.status(200).json({
            msg:`Load danh sách khoa phòng thành công!`,
            depts:depts
        })
   })
   .catch(err=>{
       return res.status(500).json({
           msg:`Load danh sách khoa phòng thất bại. Lỗi: ${new Error(err.message)}`
       })
   })
});

router.post('/',authenticateToken,(req,res)=>{
    let {name,unitId} = req.body;
    let dept = new Dept({
        name,
        unit:unitId
    });
    dept.save()
    .then(_=>{
        return res.status(201).json({
            msg:'Tạo mới phòng ban thành công!!!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Thêm mới phòng ban thất bại. Lỗi: ${new Error(err.message)}`
        })
    })

  
})

router.delete('/',authenticateToken,(req,res)=>{
    let {deptId} = req.body;
    Dept.findOneAndDelete({_id:deptId})
    .then(_=>{
        return res.status(200).json({
            msg:'Xóa phòng ban thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa phòng ban thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})

module.exports = router;