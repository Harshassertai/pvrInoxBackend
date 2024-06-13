const User = require("../../models/Auth.model");
const bcrypt = require("bcrypt");
const { successResponse, errorResponse } = require("../../utils/Response");

const createUser = async (req, res) => {
  try {
    let { name, email, password, access } = req.body;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(password)) {
      let exisitingUser = await User.find({ email });
      if (exisitingUser.length > 0) {
        res
          .status(400)
          .json({ message: `User with this email ${email} already existing.` });
      } else {
        bcrypt.genSalt(10, async (err, salt) => {
          if (err) {
            res.status(400).json({
              message: `Error while encrypting`,
            });
          }
          bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
              res.status(400).json({
                message: `Error while encrypting`,
              });
            }

            let obj = {
              name,
              email,
              password: hash,
              status: "Active",
              access,
            };

            let data = await User.create(obj);
            if (data) {
              res.status(200).json({ message: "user created successfully" });
            } else {
              res.status(400).json({ message: "error while user creating" });
            }
          });
        });
      }
    } else {
      res.status(400).json({
        message:
          "Password should be minimum 8 character long with one special character,one number,one capital letter,one small letter",
      });
    }
  } catch (error) {
    res.status(500).send(`Error logging in ${error}`);
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password, status } = req.body;
    bcrypt.genSalt(10, async (err, salt) => {
      if (err) {
        res.status(400).json({
          message: `error while user updating ${err}`,
          data: null,
        });
      }
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          res.status(400).json({
            message: `error while user updating ${err}`,
            data: null,
          });
        }
        let existingData = await User.findOne({ email: email });
        if (existingData) {
          let data = await User.findByIdAndUpdate(
            { _id: existingData._id },
            { name, email, password: hash, status },
            { new: true }
          );
          if (data) {
            res.status(200).json({ message: "user updated successfully" });
          } else {
            res
              .status(400)
              .json({ message: "error while user updating", data: null });
          }
        } else {
          res.status(404).json({
            message: `The user with email ${email} is not existing.`,
            data: existingData,
          });
        }
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    let existingData = await User.findOne({ email: email });
    if (existingData) {
      let data = await User.findByIdAndUpdate(
        { _id: existingData._id },
        { status: "InActive" },
        { new: true }
      );
      if (data) {
        return res
          .status(200)
          .json(resDto(true, "user deleted successfully", null));
      } else {
        res.status(400).json(resDto(false, "error while user deleting", null));
      }
    } else {
      res.status(404).json({
        message: `The user with email ${email} is not existing.`,
        data: existingData,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const listUser = async (req, res) => {
  try {
    let data = await User.find({ status: "Active" });
    return successResponse(res, "User List", 200, true, data);
  } catch (error) {
    console.error("Error:", error);
    return errorResponse(res, "Something Went Wrong", 404, false, err);
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  listUser,
};
