const router = require('express').Router();
const Unit = require('../../MODELS/unit_model');
const { authenticateToken } = require('../../middlewares/authenticate');

router.get('/init',(req,res)=>{
    Unit.countDocuments()
    .then(c=>{
        if(c==0){
            let unit = new Unit({
                name:'Trung tâm y tế huyện Chư Sê'
            });
            unit.save()
            .then(_=>{
                return res.status(201).json({
                    msg:'Khởi tạo danh sách đơn vị thành công!'
                })
            })
            .catch(err=>{
                return res.status(500).json({
                    msg:`Khởi tạo danh sách đơn vị thất bại! Lỗi: ${new Error(err.message)}`
                })
            })
        }else{
            return res.status(409).json({
                msg:'Danh sách đơn vị đã được khởi tạo sẵn trước đó. Vui lòng không lặp lại thao tác này!'
            });
        }
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Lỗi kiểm tra danh sách đơn vị đã có: ${new Error(err.message)}`
        })
    })
    
})


router.get('/',authenticateToken,(req,res)=>{
    let {search} = req.query;
   Unit.find({name:{ "$regex": search, "$options": "i" }})
   .then(units=>{
        return res.status(200).json({
            msg:`Load danh sách đơn vị thành công!`,
            units:units
        })
   })
   .catch(err=>{
       return res.status(500).json({
           msg:`Load danh sách đơn vị thất bại. Lỗi: ${new Error(err.message)}`
       })
   })
});

router.post('/',authenticateToken,(req,res)=>{
    let {name} = req.body;
    let u = new Unit({
        name
    });
    u.save()
    .then(_=>{
        return res.status(201).json({
            msg:'Thêm mới đơn vị thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Thêm mới đơn vị thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})


router.delete('/',authenticateToken,(req,res)=>{
    let {unitId} = req.body;
    Unit.findOneAndDelete({_id:unitId})
    .then(_=>{
        return res.status(200).json({
            msg:'Xóa đơn vị thành công!'
        })
    })
    .catch(err=>{
        return res.status(500).json({
            msg:`Xóa đơn vị thất bại. Lỗi: ${new Error(err.message)}`
        })
    })
})
module.exports = router;