require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const citizenVaccinatonSchema = new Schema({
    unit_id:{
        type:Schema.Types.ObjectId,
        ref:'unit'
    },
    fullname:{
        type:String,
        required: [true, 'Vui lòng nhập tên loại vaccin']
    },
    gender:{
        type:Number,
        default:1
    },
    dob:{
        type:String        
    },
    nation_id:{
        type:Schema.Types.ObjectId,
        ref:'nation'
    },
    email:{
        type:String
    },
    po_id:{
        type:Schema.Types.ObjectId,
        ref:'priority_object'
    },
    job_id:{
        type:Schema.Types.ObjectId,
        ref:'job'
    },
    phone:{
        type:String
    },
    id_number:{
        type:String
    },
    hi_no:{
        type:String
    },
    nationality_id:{
        type:Schema.Types.ObjectId,
        ref:'nationality'
    },
    prov_id:{
        type:Schema.Types.ObjectId,
        ref:'province'
    },
    dist_id:{
        type:Schema.Types.ObjectId,
        ref:'district'
    },
    ward_id:{
        type:Schema.Types.ObjectId,
        ref:'ward'
    },
    detail_address:{
        type:String
    },
    hf_id:{
        type:Schema.Types.ObjectId,
        ref:'health_facility'
    },
    remark:{
        type:String
    },
    vaccin1:{
        type:Schema.Types.ObjectId,
        ref:'vaccin'
    },
    date1:{
        type:String
    },
    no1:{
        type:String
    },
    vaccin2:{
        type:Schema.Types.ObjectId,
        ref:'vaccin'
    },
    date2:{
        type:String
    },
    no2:{
        type:String
    },
    is_correct:{
        type:Boolean,
        default:true
    },
    error_note:{
        type:String,
        default:''
    },
    created_by:{
        type:Schema.Types.ObjectId,
        ref:'account'
    }

   
});


module.exports = mongoose.model('citizen_vaccination',citizenVaccinatonSchema);
