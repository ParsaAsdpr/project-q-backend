const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "static/images/"); // Set your destination path
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp as filename
  },
});

const uploadInStorage = multer({ storage: storage });

module.exports = {
  uploadInStorage,
};
