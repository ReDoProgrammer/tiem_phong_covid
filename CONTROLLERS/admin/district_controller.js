const router = require('express').Router();
const District = require('../../MODELS/district_model');
const { authenticateToken } = require('../../MIDDLEWARES/authenticate');
const mongoose = require('mongoose');



router.get('/',authenticateToken,(req,res)=>{
    let {provId} = req.query; 
    provId = mongoose.Types.ObjectId(provId);
   District.find({prov:provId})
   .then(dists=>{      
        return res.status(200).json({
            msg:`Load danh sách quận huyện thành công!`,
            dists:dists
        })
   })
   .catch(err=>{
       return res.status(500).json({
           msg:`Load danh sách quận huyện thất bại. Lỗi: ${new Error(err.message)}`
       })
   })
});

router.post('/',authenticateToken,(req,res)=>{
    let {code,name,provId} = req.body;
    
    District.countDocuments({code})
    .exec()
    .then(count=>{
        if(count>0){
            return res.status(409).json({
                msg:'Mã quận huyện đã tồn tại trong hệ thống!'
            })
        }else{
            let d = new District({        
                code,
                name,
                prov:provId
            });
            d.save()
            .then(_=>{
                return res.status(201).json({
                    msg:'Thêm mới quận huyện thành công!'
                })
            })
            .catch(err=>{
                return res.status(500).json({
                    msg:`Thêm mới quận huyện thất bại. Lỗi: ${new Error(err.message)}`
                })
            })
        }
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Lỗi kiểm tra mã quận huyện: ${new Error(err.message)}`
        })
    })

    
})


router.delete('/',authenticateToken,(req,res)=>{
    let {distId} = req.body;
    District.findOneAndDelete({_id:distId})
    .then(_=>{
        return res.status(200).json({
            msg:'Quận huyện đã bị xóa!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa quận huyện thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})
module.exports = router;