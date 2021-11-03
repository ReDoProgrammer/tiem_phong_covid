const router = require('express').Router();

const { authenticateToken } = require('../MIDDLEWARES/user_authenticate');
const PO = require('../MODELS/priority_object_model');
const HF = require('../MODELS/health_facility_model');
const Vaccin = require('../MODELS/vaccin_model');
const CV = require('../MODELS/citizen_vaccination_model');





router.get('/', (req, res) => {
    res.render('vaccination/index', {
        name: 'Danh sách nhân viên tiêm phòng Covid-19',
        layout: 'layouts/user_layout'
    });
});



router.get('/excel', authenticateToken, (req, res) => {
    CV.find({ unit_id: req.user.unit_id })
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
            if (!req.user.is_mod) {
                cv = cv.filter(x => x.created_by == req.user.user_id)
            }
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




router.put('/', authenticateToken, (req, res) => {
    let { cvId, fullname, gender, dob, nation, email, po, job, work_place, phone, id_number, hi_no, nationality, province, district, ward, detail_address, hf, remark, vaccin1, date1, no1, vaccin2, date2, no2 } = req.body;


    CV.findOneAndUpdate({ _id: cvId }, {
        fullname,
        gender,
        dob,
        nation_id: nation,
        email,
        po_id: po,
        job_id: job,
        work_place,
        phone,
        id_number,
        hi_no,
        nationality_id: nationality,
        prov_id: province,
        dist_id: district,
        ward_id: ward,
        detail_address,
        hf_id: hf,
        remark,
        vaccin1,
        date1,
        no1,
        vaccin2,
        date2,
        no2,
        is_correct: true,
        error_note: ''
    })
        .exec()
        .then(_ => {
            return res.status(200).json({
                msg: 'Cập nhật hồ sơ thành công!'
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Cập nhật hồ sơ thất bại. Lỗi: ${new Error(err.message)}`
            })
        })

})

router.put('/set-vaccin', authenticateToken, (req, res) => {
    let { cvId, vaccin, no } = req.body;
    console.log(cvId);
    CV.findById(cvId)
        .exec()
        .then(c => {
            if (c.vaccin1 == '') {
                c.vaccin1 = vaccin;
                c.no1 = no;
                c.status = 1;
                c.save()
                    .then(_ => {
                        return res.status(200).json({
                            msg: 'Cập nhật thông tin tiêm chủng thành công!'
                        })
                    })
                    .catch(err => {
                        return res.status(500).json({
                            msg: 'Cập nhật thông tin tiêm chủng thất bại!!',
                            error: new Error(err.message)
                        })
                    })
            } else {
                c.vaccin2 = vaccin;
                c.no2 = no;
                c.status = 1;
                c.save()
                    .then(_ => {
                        return res.status(200).json({
                            msg: 'Cập nhật thông tin tiêm chủng thành công!'
                        })
                    })
                    .catch(err => {
                        return res.status(500).json({
                            msg: 'Cập nhật thông tin tiêm chủng thất bại!!',
                            error: new Error(err.message)
                        })
                    })
            }

        })
        .catch(err => {
            return res.status(404).json({
                msg: 'Không tìm thấy hồ sơ tiêm chủng phù hợp!'
            })
        })
})




router.get('/detail', authenticateToken, (req, res) => {
    let { cvId } = req.query;
    CV.findById(cvId)
        .then(cv => {
            return res.status(200).json({
                msg: 'Load thông tin tiêm phòng Covid-19 thành công!',
                cv
            })
        })
        .catch(err => {
            console.log(err.message);
        })
})

router.delete('/', authenticateToken, (req, res) => {
    let { cvId } = req.body;
    CV.findById(cvId)
        .exec()
        .then(cv => {
            if (cv.vaccin1.trim().length == 0 && cv.vaccin2.trim().length == 0) {
                CV.findByIdAndDelete(cvId)
                    .exec()
                    .then(_ => {
                        return res.status(200).json({
                            msg: 'Xóa hồ sơ đối tượng tiêm chủng thành công!'
                        })
                    })
                    .catch(err => {
                        return res.status(500).json({
                            msg: 'Xóa hồ sơ tiêm chủng thất bại!!!',
                            error: new Error(err.message)
                        })
                    })
            } else {
                CV.findByIdAndUpdate(cvId,
                    { status: -1 },
                    { new: true }, (err, result) => {
                        if(err){
                            return res.status(500).json({
                                msg:'Xóa hồ sơ khởi tạo thất bại!',
                                error: new Error(err.message)
                            })
                        }
                        if(result == null){
                            return res.status(404).json({
                                msg:'Không tìm thấy đối tượng cần xóa!!'
                            })
                        }
                        return res.status(200).json({
                            msg:'Xóa hồ sơ khởi tạo thành công!'
                        })
                    }
                )
            }
        })
        .catch(err => {

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
        ],
        unit_id: req.user.unit_id,
        status: 0
    })

        .populate('po_id', '-_id name')
        .populate('prov', '-_id name')
        .populate('dist', '-_id name')
        .populate('ward', '-_id name')
        .populate('hf_id', '-_id name')
        .populate('created_by', '-_id fullname')
        .exec()
        .then(cv => {
            if (!req.user.is_mod) {
                cv = cv.filter(x => x.created_by._id == req.user.user_id);
            }
            return res.status(200).json({
                msg: 'Load danh sách tiêm chủng Covid-19 thành công!',
                cv: cv,
                user_id: req.user.user_id,
                error_editable: req.user.is_mod
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách tiêm chủng Covid-19 thất bại. Lỗi: ${new Error(err.message)}`
            })
        })


})


router.post('/', authenticateToken, (req, res) => {

    let created_by = req.user.user_id;
    let { cvId, fullname, gender, dob, po_id, work_place, phone, id_number, hi_no, prov, dist, ward, detail_address, hf } = req.body;


    if (cvId.trim().length > 0) {
        CV.findOneAndUpdate(
            { _id: cvId },
            { fullname, gender, dob, po_id, work_place, phone, id_number, hi_no, province, district, ward, detail_address, hf, status: 0, unit_id: req.user.unit_id, created_by },
            { new: true }
        )
            .exec()
            .then(cv => {
                return res.status(200).json({
                    msg: 'Cập nhật hồ sơ tiêm chủng Covid-19 thành công!',
                    cv
                })

            })
            .catch(err => {
                return res.status(500).json({
                    msg: `Cập nhật hồ sơ tiêm phòng Covid-19 thất bại: ${new Error(err.message)}`
                })
            })
    } else {
        let cv = new CV({ fullname, gender, dob, po_id, work_place, phone, id_number, hi_no, prov, dist, ward, detail_address, hf, status: 0, unit_id: req.user.unit_id, created_by: req.user.user_id });

        cv.save()
            .then(c => {
                return res.status(201).json({
                    msg: 'Tạo mới hồ sơ tiêm chủng Covid-19 thành công!'
                })
            })
            .catch(err => {
                return res.status(500).json({
                    msg: `Tạo hồ sơ tiêm phòng Covid-19 thất bại: ${new Error(err.message)}`
                })
            })
    }



})





router.get('/vaccin', authenticateToken, (req, res) => {
    Vaccin.find()
        .then(vc => {
            return res.status(200).json({
                msg: 'Load danh sách loại vaccin thành công!',
                vc: vc
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách loại vaccin thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
})

router.get('/hf', authenticateToken, (req, res) => {
    HF.find()
        .then(hf => {
            return res.status(200).json({
                msg: 'Load danh sách csyt tiêm phòng thành công!',
                hf: hf
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách csyt tiêm phòng thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
})


router.get('/search', authenticateToken, (req, res) => {
    let { search } = req.query;
    CV.find({
        $or: [
            { fullname: { "$regex": search, "$options": "i" } },
            { phone: { "$regex": search, "$options": "i" } },
            { id_number: { "$regex": search, "$options": "i" } },
            { hi_no: { "$regex": search, "$options": "i" } }
        ],
        status: -1
    })
        .exec()
        .then(cv => {
            return res.status(200).json({
                msg: 'Tìm kiếm thông tin đối tượng tiêm chủng thành công!',
                cv
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: 'Tìm kiếm thông tin đối tượng tiêm chủng thất bại!!!',
                error: new Error(err.message)
            })
        })
})




router.get('/po', authenticateToken, (req, res) => {
    PO.find()
        .then(po => {
            return res.status(200).json({
                msg: 'Load danh sách đối tượng ưu tiên thành công!',
                po: po
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách đối tượng ưu tiên thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
})

module.exports = router;