const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../public/images");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Use the absolute path
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, (err, buffer) => {
            if (err) {
                return cb(err);
            }
            const filename = buffer.toString('hex') + path.extname(file.originalname);
            cb(null, filename);
        });
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
