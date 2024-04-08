import initModels from "../models/init-models.js";
import connectSequelize from "../models/connect.js";
import responseData from "../configs/responseData.js";
import bcrypt from "bcrypt";
import { checkToken, createToken, decodeToken } from "../configs/jwt.js";

const initModel = initModels(connectSequelize);

const signup = async (req, res) => {
  try {
    let { email, fullName, password, age } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      responseData(res, "Invalid email format", 400);
      return;
    }

    const checkEmail = await initModel.users.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      responseData(res, "Email already exists", 400);
      return;
    }

    const formSignup = await initModel.users.create({
      email,
      full_name: fullName,
      pass_word: bcrypt.hashSync(password, 10),
      age,
      role: "user",
    });

    const formatForm = {
      email: formSignup.email,
      fullName: formSignup.full_name,
      password: formSignup.pass_word,
      age: formSignup.age,
    };

    responseData(res, "Create email successfully", 200, formatForm);
  } catch (error) {
    return responseData(res, "Error processing request", 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      responseData(res, "Invalid email format", 400);
      return;
    }

    const checkEmail = await initModel.users.findOne({
      where: {
        email,
      },
    });

    if (!checkEmail) {
      responseData(res, "Email is incorrect", 400);
      return;
    }

    if (bcrypt.compareSync(password, checkEmail.pass_word)) {
      let token = createToken({ userId: checkEmail.dataValues.user_id });

      let formatForm = {
        email: checkEmail.email,
        password: password,
        token,
      };

      responseData(res, "Login successfully", 200, formatForm);
      return;
    }

    responseData(res, "Password is incorrect", 400);
  } catch (error) {

    return responseData(res, 500, "Error processing request");
  }
};

const getCommentInfo = async (req, res) => {
  try {
    const { imgId } = req.params;

    const checkImgId = await initModel.comments.findOne({
      where: {
        img_id: imgId,
      },
      include: "user",
    });

    if (!checkImgId) {
      responseData(res, "Image Id not found", 200);
      return;
    }

    const formatComment = {
      commentId: checkImgId.comment_id,
      dateCreated: checkImgId.date_created,
      contentInfo: checkImgId.content_info,
      user: {
        userId: checkImgId.user.user_id,
        email: checkImgId.user.email,
        fullName: checkImgId.user.full_name,
        age: checkImgId.user.age,
        avatar: checkImgId.user.avatar,
        role: checkImgId.user.role,
      },
    };

    responseData(res, "Proceed successfully", 200, formatComment);
  } catch (error) {
    return responseData(res, 500, "Error processing request");
  }
};

const saveCommentInfo = async (req, res) => {
  try {
    let { comment, imgId } = req.body;

  let { token } = req.headers;

  if (checkToken(token) == null) {
    let { userId } = decodeToken(token);

    let newComment = await initModel.comments.create({
      date_created: new Date(),
      content_info: comment,
      user_id: userId,
      img_id: imgId,
    });

    let relationship = await initModel.comments.findOne({
      where: {
        user_id: userId,
      },
      include: ["user", "img"]
    });

    let formatComment = {
      commentId: newComment.comment_id,
      dateCreated: newComment.date_created,
      contentInfo: newComment.content_info,
      user: {
        userId: relationship.user.user_id,
        email: relationship.user.email,
        fullName: relationship.user.full_name,
        age: relationship.user.age,
        avatar: relationship.user.avatar,
        role: relationship.user.role,
      },
      image:{
        imgId: relationship.img.img_id,
        imgName: relationship.img.img_name,
        imgUrl: relationship.img.img_url,
        description: relationship.img.description
      }

    }
    responseData(res, "Add comment successfully", 200, formatComment);
    return;

  }
  responseData(
    res,
    "The token has expired, wrong security key or is invalid",
    401
  );
  } catch (error) {

    return responseData(res, 500, "Error processing request");
  }
};

export { signup, login, getCommentInfo, saveCommentInfo };
