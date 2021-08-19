const router = require('express').Router();

const { authenticateToken } = require('../MIDDLEWARES/user_authenticate');
const PO = require('../MODELS/priority_object_model');
const Job = require('../MODELS/job_model');
const Nationality = require('../MODELS/nationality_model');
const Province = require('../MODELS/province_model');
const District = require('../MODELS/district_model');
const Ward = require('../MODELS/ward_model');
const HF = require('../MODELS/health_facility_model');
const Vaccin = require('../MODELS/vaccin_model');
const Nation = require('../MODELS/nation_model');
const Account = require('../MODELS/account_model');
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


router.put('/error', authenticateToken, (req, res) => {
    if (req.user.is_mod) {
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
    } else {
        return res.status(409).json({
            msg: 'Bạn không có quyền truy cập chức năng này!!'
        })
    }
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
    CV.findOneAndDelete({ _id: cvId })
        .then(_ => {
            return res.status(200).json({
                msg: 'Xóa hồ sơ thành công!'
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Xóa hồ sơ thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
})


router.get('/list', authenticateToken, (req, res) => {

    let { search } = req.query;

    CV.find({
        $or: [
            { fullname: { "$regex": search, "$options": "i" } },
            { phone: { "$regex": search, "$options": "i" } },
            { email: { "$regex": search, "$options": "i" } },
            { id_number: { "$regex": search, "$options": "i" } },
            { hi_no: { "$regex": search, "$options": "i" } }
        ],
        unit_id: req.user.unit_id
    })
        .populate('nation_id', '-_id name')
        .populate('po_id', '-_id name')
        .populate('job_id', '-_id name')
        .populate('nationality_id', '-_id name')
        .populate('prov_id', '-_id name')
        .populate('dist_id', '-_id name')
        .populate('ward_id', '-_id name')
        .populate('hf_id', '-_id name')
        .populate('vaccin1', '-_id name')
        .populate('vaccin2', '-_id name')
        .populate('created_by', 'fullname')
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
    let { fullname, gender, dob, nation, email, po, job, work_place, phone, id_number, hi_no, nationality, province, district, ward, detail_address, hf, remark, vaccin1, date1, no1, vaccin2, date2, no2 } = req.body; console.log({ fullname, gender, dob, nation, email, po, job, phone, id_number, hi_no, nationality, province, district, ward, detail_address, hf, remark, vaccin1, date1, no1, vaccin2, date2, no2 });

    CV.countDocuments({ id_number })
        .then(count => {
            if (count == 0) {

                let cv = new CV({
                    unit_id: req.user.unit_id,
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
                    created_by: req.user.user_id
                });
                cv.save()
                    .then(_ => {
                        return res.status(201).json({
                            msg: 'Thêm mới dữ liệu tiêm phòng Covid-19 thành công!'
                        })
                    })
                    .catch(err => {
                        return res.status(500).json({
                            msg: `Thêm mới dữ liệu tiêm phòng Covid-19 thất bại. Lỗi: ${new Error(err.message)}`
                        })
                    })

            } else {
                return res.status(409).json({
                    msg: `Số CMND/CCCD này đã tồn tại trong hệ thống!`
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Lỗi kiểm tra CMND/CCCD: ${new Error(err.message)}`
            })
        })

})


router.get('/nation', authenticateToken, (req, res) => {
    Nation.find()
        .then(nt => {
            return res.status(200).json({
                msg: 'Load danh sách dân tộc thành công!',
                nt: nt
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách dân tộc thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
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


router.get('/ward', authenticateToken, (req, res) => {
    let { distId } = req.query;
    Ward.find({ dist: distId })
        .then(wd => {
            return res.status(200).json({
                msg: 'Load danh sách xã phường thành công!',
                wd: wd
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách xã phường thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
})

router.get('/district', authenticateToken, (req, res) => {
    let { provId } = req.query;
    District.find({ prov: provId })
        .then(dt => {
            return res.status(200).json({
                msg: 'Load danh sách quận huyện thành công!',
                dt: dt
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách quận huyện thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
})

router.get('/province', authenticateToken, (req, res) => {
    let { natId } = req.query;
    Province.find({ nation: natId })
        .then(pv => {
            return res.status(200).json({
                msg: 'Load danh sách tỉnh thành thành công!',
                pv: pv
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách tỉnh thành thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
})

router.get('/nationality', authenticateToken, (req, res) => {
    Nationality.find()
        .then(nt => {
            return res.status(200).json({
                msg: 'Load danh sách quốc tịch thành công!',
                nt: nt
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách quốc tịch thất bại. Lỗi: ${new Error(err.message)}`
            })
        })
})




router.get('/job', authenticateToken, (req, res) => {
    Job.find()
        .then(jb => {
            return res.status(200).json({
                msg: 'Load danh sách nghề nghiệp thành công!',
                jb: jb
            })
        })
        .catch(err => {
            return res.status(500).json({
                msg: `Load danh sách nghề nghiệp thất bại. Lỗi: ${new Error(err.message)}`
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