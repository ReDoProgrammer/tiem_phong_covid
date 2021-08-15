const router = require('express').Router();
const Dept = require('../MODELS/dept_model');
const { authenticateToken } = require('../MIDDLEWARES/user_authenticate');


router.post('/',authenticateToken,(req,res)=>{
    let {name} = req.body;
    let unit = req.user.unit_id;
    let d = new Dept({
        name,
        unit
    });
    d.save()
    .then(_=>{
        return res.status(201).json({
            msg:'Thêm mới đơn vị thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Không thể thêm mới đơn vị. Lỗi: ${new Error(err.message)}`
        })
    })
})




module.exports = router;