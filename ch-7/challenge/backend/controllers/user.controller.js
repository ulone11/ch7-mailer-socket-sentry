const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { transporter } = require("../config/mailer");

const authLogin = async (req, res, next) => {
  const user_agent = req.headers["user-agent"];

  const user_payload = {
    email: req.body.email,
    password: req.body.password,
  };

  const user = await prisma.users.findUnique({
    where: {
      email: user_payload.email,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const passCheck = bcrypt.compareSync(user_payload.password, user.password);

  if (!passCheck) {
    return res.status(400).json({ message: "Email or Password is wrong" });
  }

  const now = new Date();
  const otpExpired =
    !user.otp ||
    (user.otp_expires_date && now > new Date(user.otp_expires_date)) ||
    !user.otp_expires_date;

  if (user_agent === user.user_agent && !otpExpired) {
    const token = jwt.sign(
      { email: user.email, id_user: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Login Success", token: token });
  } else {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiresDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    await prisma.users.update({
      where: {
        email: user.email,
      },
      data: {
        otp: otp.toString(),
        otp_expires_date: otpExpiresDate,
        user_agent: user_agent,
      },
    });

    transporter.sendMail({
      if(error) {
        console.error("Failed to send email:", error.message);
        return;
      },
      from: process.env.EMAIL,
      to: user.email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    return res.status(200).json({
      message: "Silahkan cek email Anda",
      is_need_otp: true,
    });
  }
};

const createUser = async (req, res, next) => {
  try {
    const user_payload = {
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    };
    console.log("Request Body: ", req.body, user_payload);

    const existingEmail = await prisma.users.findUnique({
      where: {
        email: user_payload.email,
      },
    });

    if (existingEmail) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    await prisma.users.create({
      data: user_payload,
    });
    return res.status(201).json({ message: "Register Success" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

const verifyOTP = async (req, res, next) => {
  const user_payload = {
    email: req.body.email,
    otp: req.body.otp,
  };

  const user = await prisma.users.findUnique({
    where: {
      email: user_payload.email,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  if (user.otp !== user_payload.otp) {
    return res.status(400).json({ message: "OTP Not Match" });
  }

  const token = await jwt.sign(
    { email: user.email, id_user: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res.status(200).json({ message: "OTP Verified", token: token });
};

const forgetPass = async (req, res, next) => {
  const { email } = req.body;

  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User not Found" });
  } else {
    const otp = Math.floor(1000 + Math.random() * 9000);

    await prisma.users.update({
      where: {
        email: user.email,
      },
      data: {
        otp: otp.toString(),
        otp_expires_date: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "OTP for Reset Password",
      text: `Your OTP is ${otp}. Access from /reset-password/${otp}`,
    });

    return res.status(200).json({
      message: "Silahkan Cek Email Anda",
    });
  }
};

const resetPass = async (req, res, next) => {
  const { otp } = req.query;
  const { newPass } = req.body;

  const user = await prisma.users.findFirst({
    where: {
      otp: otp,
      otp_expires_date: {
        gte: new Date(),
      },
    },
  });

  if (!user) {
    return res.status(400).json({ error: "user not found" });
  }

  await prisma.users.update({
    where: {
      email: user.email,
    },
    data: {
      password: await bcrypt.hash(req.body.newPass, 10),
      otp: null,
      otp_expires_date: null,
    },
  });

  return res.status(200).json({ message: "Password has been changed" });
};

module.exports = {
  createUser,
  authLogin,
  verifyOTP,
  forgetPass,
  resetPass,
};
