const router = require('express').Router();
const CV = require('../../MODELS/citizen_vaccination_model');
const Vaccin = require('../../MODELS/vaccin_model');
const Province = require('../../MODELS/province_model');
const District = require('../../MODELS/district_model');
const Ward = require('../../MODELS/ward_model');
const HF = require('../../MODELS/health_facility_model');
const { authenticateToken } = require('../../MIDDLEWARES/authenticate');


router.get('/', (req, res) => {
    res.render('admin/cv/index', {
        name: 'Danh sách hồ sơ từ các đơn vị',
        layout: 'layouts/admin_layout'
    });
})

router.put('/error', authenticateToken, (req, res) => {
    let { cvId, err } = req.body;
    CV.findOneAndUpdate({ _id: cvId }, {
        error_note: err,
        is_correct: false
    }, (err, cv) => {
        if (err) {
            return res.status(500).json({
                msg: `Cập nhật lỗi hồ sơ thất bại. Lỗi: ${new Error(err.message)}`
            })
        }
        return res.status(200).json({
            msg: 'Cập nhật lỗi hồ sơ thành công!'
        });
    })
})



router.get('/list', authenticateToken, (req, res) => {
    let { search } = req.query;
    CV.find({
        $or: [
            { fullname: { "$regex": search, "$options": "i" } },
            { phone: { "$regex": search, "$options": "i" } },            
            { id_number: { "$regex": search, "$options": "i" } },
            { hi_no: { "$regex": search, "$options": "i" } }
        ]
    })       
        .populate('prov', '-_id name')
        .populate('dist', '-_id name')
        .populate('ward', '-_id name')
        .exec()
        .then( cv => {
            console.log(cv);
            return res.status(200).json({
                msg: 'Load danh sách tiêm chủng Covid-19 thành công!',
                cv,
                user_id: req.user.user_id,
                error_editable: req.user.is_mod
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách tiêm chủng Covid-19 thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
});


router.delete('/destroy', authenticateToken, (req, res) => {
    CV.deleteMany()
        .then(_ => {
            return res.status(200).json({
                msg: 'Xóa toàn bộ hồ sơ thành công!'
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Xóa toàn bộ hồ sơ thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
})


router.post('/drop', authenticateToken, (req, res) => {
    try {
        CV.collection.drop();
        return res.status(200).json({
            msg: 'Drop collection successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            msg: `Drop collection failed. Error: ${new Error(err.message)}`
        })
    }
})




router.post('/', authenticateToken, (req, res) => {
    try {
        var { array } = req.body; // your response in a string        
        var objects = JSON.parse(array); // an *array* that contains the user
        let count = 0;
        objects.forEach(o => {
            CV.findOne({
                $or: [
                    { phone: o.phone },
                    { id_number: o.idNo }
                ]
            })
                .exec()
                .then(cv => {
                    if (cv == null) {
                        Promise.all([getProvId(o.prov), getDistId(o.dist), getWardId(o.ward)])
                            .then((v) => {
                                
                                let cv = new CV({
                                    fullname: o.fullname,
                                    dob: o.dob,
                                    gender:(o.fullname.toLowerCase().includes('thị')?0:1),
                                    id_number: o.idNo,
                                    phone: o.phone,
                                    prov: v[0]._id,
                                    dist: v[1]._id,
                                    ward: v[2]._id,
                                    detail_address: o.add_detail,
                                    work_place:v[2].name,
                                    vaccin1:o.vaccin1,
                                    hf1:o.hf1,
                                    date1: o.date1,
                                    no1: o.no1,
                                    vaccin2:o.vaccin2,
                                    hf2:o.hf2,
                                    date2: o.date2,
                                    no2: o.no2
                                });
                                cv.save()
                                    .then(_ => {
                                        count++;
                                    })
                                // .catch(err=>{
                                //     return res.status(500).json({
                                //         msg:'Thêm mới đối tượng tiêm chủng thất bại: '+new Error(err.message),
                                //         err: new Error(err.message)
                                //     })
                                // })
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                })
                .catch(err => {
                    console.log(new Error(err.message));
                })


        });
        if (count > 0) {
            return res.status(201).json({
                msg: 'Thêm mới thành công ' + count + ' đối tượng tiêm chủng covid'
            })
        }

    } catch (error) {
        return res.status(500).json({
            msg: 'Lỗi: ' + new Error(error.message)
        })
    }
})








router.get('/excel', authenticateToken, (req, res) => {
    CV.find()
        .populate('nation_id', '-_id code')
        .populate('nationality_id', '-_id code')
        .populate('prov_id', '-_id code name')
        .populate('dist_id', '-_id code name')
        .populate('ward_id', '-_id code name')
        .populate('po_id', '-_id code')
        .populate('job_id', '-_id name')
        .populate('unit_id', '-_id name')
        .populate('hf_id', '-_id code')
        .populate('vaccin1', '-_id name')
        .populate('vaccin2', '-_id name')
        .exec()
        .then(cv => {
            return res.status(200).json({
                msg: 'Load danh sách hồ sơ thành công!',
                cv
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách hồ sơ thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
})


module.exports = router;





const getProvId = (provName) => {
    return new Promise((resolve, reject) => {
        Province.findOne({ name: provName })
            .exec()
            .then(prov => {
                if (prov == null) {
                    return reject({ code: 404, msg: 'Không tìm thấy tỉnh thành phù hợp: ' + provName })
                }
                resolve(prov);
            })
            .catch(err => {
                reject({ code: 500, msg: new Error(err.message) });
            })
    })
};

const getDistId = (distName) => {
    return new Promise((resolve, reject) => {
        District.findOne({ name: distName })
            .exec()
            .then(dist => {
                if (dist == null) {
                    return reject({ code: 404, msg: 'Không tìm thấy quận huyện phù hợp: ' + distName })
                }
                return resolve(dist);
            })
            .catch(err => {
                return reject({ code: 500, msg: new Error(err.message) });
            })
    })
};

const getWardId = (wardName) => {
    return new Promise((resolve, reject) => {
        Ward.findOne({ name: wardName })
            .exec()
            .then(ward => {
                if (ward == null) {
                    return reject({ code: 404, msg: 'Không tìm thấy xã phường phù hợp: ' + wardName })
                }
                return resolve(ward);
            })
            .catch(err => {
                return reject({ code: 500, msg: new Error(err.message) });
            })
    })
};

