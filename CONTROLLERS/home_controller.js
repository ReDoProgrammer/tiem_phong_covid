const router = require('express').Router();

router.get('/',(req,res)=>{
    res.render('home/index', {
        name: 'Home',
        layout: 'layouts/user_layout'
    });
});

module.exports = router;