const router = require('express').Router();
const Ward = require('../../MODELS/ward_model');
const { authenticateToken } = require('../../MIDDLEWARES/authenticate');
const mongoose = require('mongoose');



router.get('/',authenticateToken,(req,res)=>{
    let {distId} = req.query;
    distId = mongoose.Types.ObjectId(distId);
   
   Ward.find({dist:distId})
   .then(wards=>{       
        return res.status(200).json({
            msg:`Load danh sách xã phường thành công!`,
            wards:wards
        })
   })
   .catch(err=>{
       return res.status(500).json({
           msg:`Load danh sách xã phường thất bại. Lỗi: ${new Error(err.message)}`
       })
   })
});

router.post('/',authenticateToken,(req,res)=>{
    let {code,name,distId} = req.body;
    Ward.countDocuments({code})
    .exec()
    .then(count=>{
        if(count>0){
            return res.status(409).json({
                msg:'Mã xã phường đã tồn tại trong hệ thống!'
            })
        }else{
            let w = new Ward({        
                code,
                name,
                dist:distId
            });
            w.save()
            .then(_=>{
                return res.status(201).json({
                    msg:'Thêm mới xã phường thành công!'
                })
            })
            .catch(err=>{
                return res.status(500).json({
                    msg:`Thêm mới xã phường thất bại. Lỗi: ${new Error(err.message)}`
                })
            })
        }
    })
    .catch(err=>{
        msg:`Lỗi kiểm tra mã xã phường: ${new Error(err.message)}`
    })
    
})


router.delete('/',authenticateToken,(req,res)=>{
    let {wardId} = req.body;
    Ward.findOneAndDelete({_id:wardId})
    .then(_=>{
        return res.status(200).json({
            msg:'Xóa xã phường thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa xã phường thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})
module.exports = router;