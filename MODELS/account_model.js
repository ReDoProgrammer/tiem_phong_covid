require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const accountSchema = new Schema({
    username:{
        type:String,
        required: [true, 'Vui lòng nhập tài khoản'],
        unique:[true,'Tài khoản này đã tồn tại trong hệ thống!']
    },
    password:{
        type:String,
        required: [true, 'Vui lòng nhập mật khẩu']
    },
    fullname:{
        type:String,
        required: [true, 'Vui lòng nhập họ tên']
    },
    phone:{
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    unit:{
        type:Schema.Types.ObjectId,
        ref:'unit'
    },
    is_admin:{
        type:Boolean,
        default:false
    },
    is_mod:{
        type:Boolean,
        default:false
    },
    created_by:{
        type:Schema.Types.ObjectId,
        ref:'account'
    }
});


module.exports = mongoose.model('account',accountSchema);
