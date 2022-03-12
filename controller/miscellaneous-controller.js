const multer = require("multer");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const private = require("../private.json");
const fs = require("fs");

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
    const OAuth2Client = new google.auth.OAuth2(
      private.CLIENT_ID,
      private.CLIENT_SECRET,
      private.REDIRECT_URI
    );
    OAuth2Client.setCredentials({ refresh_token: private.REFRESH_TOKEN });
    const accessToken = await OAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "nevertoooldapp@gmail.com",
        clientId: private.CLIENT_ID,
        clientSecret: private.CLIENT_SECRET,
        refreshToken: private.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    // transport.verify(function (error, success) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Server is ready to take our messages");
    //   }
    // });
    console.log(req.file);
    const mailOptions = {
      from: "Never Too Old <nevertoooldapp@gmail.com>",
      to: [
        "rushit07@gmail.com",
        "parthjangid8080114742@gmail.com",
        "bhaveshbellaney@gmail.com",
      ],
      text: "Mail from Server",
      subject:
        req.body.name +
        ", a user, is facing a problem. Phone number: " +
        req.body.phoneNumber,
      attachments: [
        {
          filename: "problem.mp3",
          content: fs.createReadStream(
            process.cwd() + "/uploads/" + req.file.filename
          ),
        },
      ],
    };
    const result = await transport.sendMail(mailOptions);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};
