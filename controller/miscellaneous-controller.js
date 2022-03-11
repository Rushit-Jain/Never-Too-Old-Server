const multer = require("multer");
const nodemailer = require("nodemailer");
const private = require("../private.json");

exports.uploadFile = async (req, res, next) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      let name =
        new Date().toISOString() +
        "_" +
        req.body.name +
        "_" +
        req.body.phoneNumber +
        "_" +
        file.originalname;
      cb(null, name.replaceAll(":", "_"));
    },
  });
  var upload = multer({ storage: storage }).single("audio");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
    } else if (err) {
      console.log(err);
    }
    next();
  });
};

exports.sendFile = async (req, res, next) => {
  try {
    // let transporter = nodemailer.createTransport({
    //   host: "smtp.google.com",
    //   port: 587,
    //   secure: true,
    //   auth: {
    //     type: "OAuth2",
    //     user: "nevertoooldapp@gmail.com",
    //     serviceClient: private.client_id,
    //     privateKey: private.private_key,
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    // });
    // transporter.verify(function (error, success) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Server is ready to take our messages");
    //   }
    // });
  } catch (err) {
    return next(err);
  }
};
