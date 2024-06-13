const User = require("../../models/Auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { decryptRequest } = require("../../utils/crypt");
const { successResponse, errorResponse } = require("../../utils/Response");
const JWT_SECRET = process.env.JWTKEY;

const Login = async (req, res) => {
  const { Request } = req.body;
  const decrypt = await decryptRequest(Request);
  const { email, password } = JSON.parse(decrypt);
  try {
    const user = await User.findOne({ email });
    console.log("user ", user);
    if (!user) {
      return errorResponse(res, "Invalid credentials", 400, false);
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(password)) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return errorResponse(res, "Password Mismatch", 400, false);
      }

      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
          lastLogin: user.last_login,
          access: user.access,
        },
        JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return successResponse(res, "Login Successful", 200, true, token);
    } else {
      return errorResponse(
        res,
        "Password should be minimum 8 character long with one special character,one number,one capital letter,one small letter",
        400,
        false
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      `Something Went Wrong due to ${error}`,
      500,
      false,
      error
    );
  }
};

module.exports = {
  Login,
};
