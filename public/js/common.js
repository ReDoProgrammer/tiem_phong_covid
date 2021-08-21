function splitIDCard(id){
   //064186005358|230661231|Tăng Thị Thanh Thủy|22011986|Nữ|Số Nhà 980, Đường Hùng Vương, Tổ Dân Phố 4, Thị trấn Chư Sê, Chư Sê, Gia Lai|28062021
   return id.split('|');
}


function getBaseUrl() {
  return window.location.protocol + "//" + window.location.host;
}

function getACCESS_TOKEN(){
  return localStorage.getItem("ACCESS_TOKEN");
}
function isDate(s) {
  var bits = s.split('/');
  var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
  return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
}


function IsDate(str) {
  var t = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if(t === null)
    return false;
  var d = +t[1], m = +t[2], y = +t[3];

  // Below should be a more acurate algorithm
  if(m >= 1 && m <= 12 && d >= 1 && d <= 31) {
    return true;  
  }

  return false;
}


 //hàm lấy chuỗi tiếng việt không dấu, được ngăn cách với nhau bằng dấu -
 function getMeta(title) {
  return title.toLowerCase().trim()//đưa hết về kiểu chữ thường và loại bỏ khoảng trống thừa đầu và cuối của chuỗi                    
          .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
          .replace(/\ /g, '-').replace(/đ/g, "d")
          .replace(/đ/g, "d")
          .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
          .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
          .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ.+/g, "o")
          .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ.+/g, "e")
          .replace(/ì|í|ị|ỉ|ĩ/g, "i")
          .replace(/\s+/g, '-')           // thay thế khoảng trắng bằng dấu - 
          .replace(/&/g, '-va-')         // thay thế kí tự & bằng -va-
          .replace(/[^\w\-]+/g, '')       // loại bỏ các khoảng trắng thừa
          .replace(/\-\-+/g, '-');         // thay thế các kí tự - liên tục bằng 1 kí tự -w
 }


 function UppercaseEachFirstLetter(str){
  return str.replace(/^(.)|\s+(.)/g, c => c.toUpperCase());
 }