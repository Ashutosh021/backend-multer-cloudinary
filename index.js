const express = require("express");
const app = express();
const path = require("path");
const upload = require("./config/upload");
const cloudinary = require("./config/cloudinary");
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/user-info", (req, res) => {
    const { username, password } = req.body;
    res.render("home", { username, password });
});

app.get("/file", (req, res) => {
    res.render("file");
});

app.post("/upload", upload.single('profile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    var filePath = path.join(__dirname,"public/images",req.file.filename)
    cloudinary.uploader.upload(req.file.path, (err, result) => {
        if (err) {
            fs.unlink(filePath,(err)=>{
                console.log(err);
            });
            console.error(err);
            return res.status(500).send("Error uploading to Cloudinary.");
        } else {
            console.log(result.url);
            res.send("Success");
            fs.unlink(filePath,(err)=>{
                if(err){
                    console.log(err);
                }
            });
        }
    });
});

app.listen(1400, () => {
    console.log(`Server running at http://localhost:1400`);
});
