const router = require('express').Router();
const Province = require('../../MODELS/province_model');
const { authenticateToken } = require('../../middlewares/authenticate');
const mongoose = require('mongoose');



router.get('/',authenticateToken,(req,res)=>{
    let {natId} = req.query;
    natId = mongoose.Types.ObjectId(natId);
   Province.find({nation:natId})
   .then(provs=>{      
        return res.status(200).json({
            msg:`Load danh sách tỉnh thành thành công!`,
            provs:provs
        })
   })
   .catch(err=>{
       return res.status(500).json({
           msg:`Load danh sách tỉnh thành thất bại. Lỗi: ${new Error(err.message)}`
       })
   })
});

router.post('/',authenticateToken,(req,res)=>{
    let {code,name,natId} = req.body;
    let p = new Province({        
        code,
        name,
        nation:natId
    });
    p.save()
    .then(_=>{
        return res.status(201).json({
            msg:'Thêm mới tỉnh thành thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Thêm mới tỉnh thành thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})


router.delete('/',authenticateToken,(req,res)=>{
    let {provId} = req.body;
    Province.findOneAndDelete({_id:provId})
    .then(_=>{
        return res.status(200).json({
            msg:'Tỉnh thành đã bị xóa!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa tỉnh thành thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})
module.exports = router;