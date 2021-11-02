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
    
    email:{
        type:String
    },
    po_id:{
        type:Schema.Types.ObjectId,
        ref:'priority_object',
        default:null
    },
   
    work_place:{
        type:String,
        default:''
    },
    phone:{
        type:String
    },
    id_number:{
        type:String
    },
    hi_no:{
        type:String,
        default:''
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
    remark:{
        type:String
    },
    vaccin1:{
        type:Schema.Types.ObjectId,
        ref:'vaccin', 
        default:null
    },
    hf1:{
        type:Schema.Types.ObjectId,
        ref:'health_facility',
        default:null
    },
    date1:{
        type:String
    },
    no1:{
        type:String
    },
    vaccin2:{
        type:Schema.Types.ObjectId,
        ref:'vaccin',
        default:null
    },
    hf2:{
        type:Schema.Types.ObjectId,
        ref:'health_facility',
        default:null
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
        default:null
    },
    created_by:{
        type:Schema.Types.ObjectId,
        ref:'account'
    }

   
});


module.exports = mongoose.model('citizen_vaccination',citizenVaccinatonSchema);
