// Uploading files

const path = require('path');
var multer  = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const fileDestination = path.join(__dirname, '../public/uploads');
      cb(null, fileDestination);
    },
    filename: (req, file, cb) => {
      const dateTime = Date.now();
      const extension = path.extname(file.originalname);
      const fileName = `${dateTime}${extension}`
      cb(null, fileName);
    }
});

var upload = multer({storage: storage, 
  fileFilter: function (req, file, cb) {
    if(file.mimetype.includes('jpg') ||
       file.mimetype.includes('jpeg') ||
       file.mimetype.includes('png') ||
       file.mimetype.includes('pdf') ){

      cb(null, true);
     
    }else {
      cb(new Error());
    }
  }
});

module.exports.uploadNotificationImage = upload.array('notificationImage', 12)
module.exports.uploadProductImage = upload.array('productImage', 12)