const router = require('express').Router();
const excel = require('node-excel-export');

const { authenticateToken } = require('../middlewares/user_authenticate');
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



router.get('/excel',authenticateToken, (req, res) => {
    let styles = {
        headerDark: {
            fill: {
                fgColor: {
                    rgb: 'FF000000'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                underline: true
            }
        },
        cellPink: {
            fill: {
                fgColor: {
                    rgb: 'FFFFCCFF'
                }
            }
        },
        cellGreen: {
            fill: {
                fgColor: {
                    rgb: 'FF00FF00'
                }
            }
        }
    };

    // Array of objects representing heading rows
    let heading = [
        [
            { value: 'STT', style: styles.headerDark },
            { value: 'Họ và tên', style: styles.headerDark },
            { value: 'Ngày sinh', style: styles.headerDark },
            { value: 'Số điện thoại', style: styles.headerDark },
            { value: 'Email', style: styles.headerDark },
            { value: 'Mã Đ.T.Ư.T', style: styles.headerDark },
            { value: 'Nghề nghiệp', style: styles.headerDark },
            { value: 'CMND/CCCD', style: styles.headerDark },
            { value: 'Thẻ BHYT', style: styles.headerDark },
            { value: 'Dân tộc', style: styles.headerDark },
            { value: 'Quốc tịch', style: styles.headerDark },
            { value: 'Địa chỉ', style: styles.headerDark },
            { value: 'CSYT tiêm phòng', style: styles.headerDark },
            { value: 'Ghi chú', style: styles.headerDark },
        ],
        ['a2', 'b2', 'c2'] // <-- It can be only values
    ];

    // export structure
    let specification = {
        customer_name: { // <- the key should match the actual data key
            displayName: 'Customer', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellStyle: function (value, row) { // <- style renderer function
                // if the status is 1 then color in green else color in red
                // Notice how we use another cell value to style the current one
                return (row.status_id == 1) ? styles.cellGreen : { fill: { fgColor: { rgb: 'FFFF0000' } } }; // <- Inline cell style is possible
            },
            width: 120 // <- width in pixels
        },
        status_id: {
            displayName: 'Status',
            headerStyle: styles.headerDark,
            cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
                return (value == 1) ? 'Active' : 'Inactive';
            },
            width: '10' // <- width in chars (when the number is passed as string)
        },
        note: {
            displayName: 'Description',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 220 // <- width in pixels
        }
    };

    
    // CV.find({created_by:req.user.user_id})
    // .exec()
    // .then(cv=>{
    //     console.log(cv);
    // })
    // .catch(err=>{
    //     console.log(err.message);
    // })


    let dataset = [
        { customer_name: 'IBM', status_id: 1, note: 'some note', misc: 'not shown' },
        { customer_name: 'HP', status_id: 0, note: 'some note' },
        { customer_name: 'MS', status_id: 0, note: 'some note', misc: 'not shown' }
    ];

    // Create the excel report.
    // This function will return Buffer
    let report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
                name: 'Sheet name', // <- Specify sheet name (optional)
                heading: heading, // <- Raw heading array (optional)
                specification: specification, // <- Report specification
                data: dataset // <-- Report data
            }
        ]
    );

    // convert excel file content to base64 and send to a client
    res.send({ content: report.toString('base64') });
})


router.put('/', authenticateToken, (req, res) => {
    let { cvId, fullname, gender, dob, nation, email, po, job, phone, id_number, hi_no, nationality, province, district, ward, detail_address, hf, remark, vaccin1, date1, no1, vaccin2, date2, no2 } = req.body; console.log({ fullname, gender, dob, nation, email, po, job, phone, id_number, hi_no, nationality, province, district, ward, detail_address, hf, remark, vaccin1, date1, no1, vaccin2, date2, no2 });


    CV.findOneAndUpdate({ _id: cvId }, {
        fullname,
        gender,
        dob,
        nation_id: nation,
        email,
        po_id: po,
        job_id: job,
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
        console.log({ cvId, err });
        CV.findOneAndUpdate({ _id: cvId }, {
            error_note: err,
            is_correct: false
        }, (err, cv) => {
            if (err) {
                return res.status(500).json({
                    msg: `Cập nhật lỗi hồ sơ thất bại. Lỗi: ${new Error(err.message)}`
                })
            }
            return res.status(200).json('Cập nhật lỗi hồ sơ thành công!');
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
        ]
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
    let { fullname, gender, dob, nation, email, po, job, phone, id_number, hi_no, nationality, province, district, ward, detail_address, hf, remark, vaccin1, date1, no1, vaccin2, date2, no2 } = req.body; console.log({ fullname, gender, dob, nation, email, po, job, phone, id_number, hi_no, nationality, province, district, ward, detail_address, hf, remark, vaccin1, date1, no1, vaccin2, date2, no2 });

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