const multer=require('multer');
const crypto=require('crypto');
const path=require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, crypto.createHash('sha256').update(Date.now().toString()).digest('hex') )
    }
  })

  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
const upload = multer({ storage: storage,
    limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter })

module.exports=upload;