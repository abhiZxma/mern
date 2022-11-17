const otpGenerator = require('otp-generator')
const multer =require('multer')

function otpGenerate() {
    let otp =otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false })
    return otp
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        console.log("file.mimetype",file.mimetype)
        let uniqueSuffix='';
        if(file.mimetype=='image/jpeg'){
            uniqueSuffix = (Date.now() + '.jpg')
        }
        if(file.mimetype=='image/png'){
            uniqueSuffix = (Date.now() +'.png')
        }

      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
const upload = multer({ storage: storage })

module.exports={otpGenerate,upload}