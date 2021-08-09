const router = require('express').Router();


router.get('/',(req,res)=>{
    res.render('admin/home/index', {
        name: 'Danh sách đơn vị',
        layout: 'layouts/admin_layout'
    });
});

module.exports = router;