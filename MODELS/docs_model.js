require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên tài liệu!']
    },
    url: {
        type: String,
        default: ''
    }

});


module.exports = mongoose.model('doc', docSchema);
