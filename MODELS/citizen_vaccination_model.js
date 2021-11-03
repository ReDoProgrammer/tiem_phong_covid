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
  
    prov:{
        type:Schema.Types.ObjectId,
        ref:'province'
    },
    dist:{
        type:Schema.Types.ObjectId,
        ref:'district'
    },
    ward:{
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
       type:String,
       default:''
    },
    hf1:{
       type:String,
       default:''
    },
    date1:{
        type:String,
        default:''
    },
    no1:{
        type:String,
        default:''
    },
    vaccin2:{
       type:String,
       default:''
    },
    hf2:{
       type:String,
       default:''
    },
    date2:{
        type:String,
        default:''
    },
    no2:{
        type:String,
        default:''
    },
    created_by:{
        type:Schema.Types.ObjectId,
        ref:'account'
    },
    status:{
        type:Number,
        default:-1
    }

   
});


module.exports = mongoose.model('citizen_vaccination',citizenVaccinatonSchema);
