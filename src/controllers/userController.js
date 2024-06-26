import initModels from "../models/init-models.js";
import connectSequelize from "../models/connect.js";
import responseData from "../configs/responseData.js";
import bcrypt from "bcrypt";
import {
  checkToken,
  checkTokenRef,
  createToken,
  createTokenRef,
  decodeToken,
} from "../configs/jwt.js";
import { compressImage, compressImageAvatar } from "../configs/compressImg.js";

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
      password,
      age: formSignup.age,
    };

    responseData(res, "Create account successfully", 200, formatForm);
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

      let tokenRef = createTokenRef({ userId: checkEmail.dataValues.user_id });

      checkEmail.dataValues.refresh_token = tokenRef;

      await initModel.users.update(checkEmail.dataValues, {
        where: {
          user_id: checkEmail.dataValues.user_id,
        },
      });

      let formatForm = {
        userId: checkEmail.user_id,
        email: checkEmail.email,
        fullName: checkEmail.full_name,
        password: password,
        age: checkEmail.age,
        role: checkEmail.role,
        avatar:checkEmail.avatar,
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

const refreshToken = async (req, res) => {
  let { token } = req.headers;

  let errToken = checkToken(token);

  if (errToken !== null && errToken.name !== "TokenExpiredError") {
    responseData(res, "Non-authorized tokens", 401);
    return;
  }

  let { userId } = decodeToken(token);

  let verifyToken = decodeToken(token);

  let getUser = await initModel.users.findByPk(userId);

  let errTokenRef = checkTokenRef(getUser.dataValues.refresh_token);

  if (errTokenRef !== null) {
    responseData(res, "Non-authorized tokens", 401);
    return;
  }

  let { key } = decodeToken(getUser.dataValues.refresh_token);

  if (verifyToken.key !== key) {
    responseData(res, "Non-authorized tokens", 401);
    return;
  }

  let newToken = createToken({
    userId: getUser.dataValues.user_id,
  });

  const format = {
    userId,
    email: getUser.email,
    fullName: getUser.full_name,
    age: getUser.age,
    role: getUser.role,
    avatar:getUser.avatar,
    token: newToken,
  };

  responseData(res, "Proceed successfully", 200, format);
};

const getCommentInfo = async (req, res) => {
  try {
    const { imgId } = req.params;

    const checkImgId = await initModel.comments.findAll({
      where: {
        img_id: imgId,
      },
      include: "user",
    });

    if (checkImgId.length === 0) {
      responseData(res, "Image Id not found", 404);
      return;
    }

    const formatComment = checkImgId.map((comment) => ({
      commentId: comment.comment_id,
      dateCreated: comment.date_created,
      contentInfo: comment.content_info,
      user: {
        userId: comment.user.user_id,
        email: comment.user.email,
        fullName: comment.user.full_name,
        age: comment.user.age,
        avatar: comment.user.avatar,
        role: comment.user.role,
      },
    }));

    responseData(res, "Proceed successfully", 200, formatComment);
  } catch (error) {
    return responseData(res, 500, "Error processing request");
  }
};

const saveCommentInfo = async (req, res) => {
  try {
    let { comment, imgId } = req.body;

    let { token } = req.headers;

    if (checkToken(token) === null) {
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
        include: ["user", "img"],
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
        image: {
          imgId: relationship.img.img_id,
          imgName: relationship.img.img_name,
          imgUrl: relationship.img.img_url,
          description: relationship.img.description,
        },
      };
      responseData(res, "Add comment successfully", 200, formatComment);
      return;
    }
    responseData(res, "Non-authorized tokens", 401);
  } catch (error) {
    return responseData(res, 500, "Error processing request");
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { fullName, password, age } = req.body;

    const { token } = req.headers;

    const errToken = checkToken(token);

    if (errToken !== null && errToken.name !== "TokenExpiredError") {
      responseData(res, "Non-authorized tokens", 401);
      return;
    }

    const { userId } = decodeToken(token);

    const getUser = await initModel.users.findByPk(userId);

    const updateInfo = await getUser.update({
      full_name: fullName,
      pass_word: bcrypt.hashSync(password, 10),
      age,
    });

    const format = {
      email: getUser.email,
      fullName: updateInfo.full_name,
      password,
      age: updateInfo.age,
    };

    responseData(res, "Update successfully", 200, format);
  } catch (error) {
    console.log("🚀 ~ updateUserInfo ~ error:", error);
  }
};

const getUserInfo = async (req, res) => {
  try {
    let { token } = req.headers;

    let errToken = checkToken(token);

    if (errToken === null) {
      let { userId } = decodeToken(token);

      let getUserId = await initModel.users.findByPk(userId);

      const format = {
        userId: getUserId.user_id,
        email: getUserId.email,
        fullName: getUserId.full_name,
        age: getUserId.age,
        avatar: getUserId.avatar,
        role: getUserId.role,
      };

      responseData(res, "Get info user successfully", 200, format);
      return;
    }
    responseData(res, "Non-authorized tokens", 401);
  } catch (error) {
    console.log("🚀 ~ getUserInfo ~ error:", error);
  }
};

const getUserList = async (req, res) => {
  try {
    const { token } = req.headers;

    const errToken = checkToken(token);

    if (errToken !== null && errToken.name !== "TokenExpiredError") {
      responseData(res, "Non-authorized tokens", 401);
      return;
    }

    const userList = await initModel.users.findAll();

    const format = userList.map((user) => ({
      userId: user.user_id,
      email: user.email,
      fullName: user.full_name,
      age: user.age,
      avatar: user.avatar,
      role: user.role,
    }));

    responseData(res, "Proceed successfully", 200, format);
  } catch (error) {
    console.log("🚀 ~ getUserList ~ error:", error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { UserId } = req.query;

    const { token } = req.headers;

    const errToken = checkToken(token);

    if (errToken !== null && errToken.name !== "TokenExpiredError") {
      responseData(res, "Non-authorized tokens", 401);
      return;
    }

    const checkUserSaveImage = await initModel.save_images.findOne({
      where: {
        user_id: UserId,
      },
    });

    if (checkUserSaveImage) {
      await initModel.save_images.destroy({
        where: {
          user_id: UserId,
        },
      });
    }

    const checkUserComments = await initModel.comments.findOne({
      where: {
        user_id: UserId,
      },
    });

    if (checkUserComments) {
      await initModel.comments.destroy({
        where: {
          user_id: UserId,
        },
      });
    }

    const checkUserImages = await initModel.images.findOne({
      where: {
        user_id: UserId,
      },
    });

    if (checkUserImages) {
      await initModel.images.destroy({
        where: {
          user_id: UserId,
        },
      });
    }

    const checkUser = await initModel.users.findOne({
      where: {
        user_id: UserId,
      },
    });

    if (checkUser) {
      await initModel.users.destroy({
        where: {
          user_id: UserId,
        },
      });
    }

    responseData(res, "Delete user successfully", 200);
  } catch (error) {
    console.log("🚀 ~ deleteUser ~ error:", error);
  }
};

const addUser = async (req, res) => {
  try {
    const { token } = req.headers;

    const { email, fullName, password, age, role } = req.body;

    const errToken = checkToken(token);

    if (errToken !== null && errToken.name !== "TokenExpiredError") {
      responseData(res, "Non-authorized tokens", 401);
      return;
    }

    const checkEmail = await initModel.users.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      responseData(res, "Email already exist", 409);
      return;
    }

    const checkUser = await initModel.users.create({
      email,
      full_name: fullName,
      pass_word: bcrypt.hashSync(password, 10),
      age: parseInt(age),
      role,
    });

    const format = {
      email: checkUser.email,
      fullName: checkUser.full_name,
      age: checkUser.age,
      role: checkUser.role,
    };

    responseData(res, "Add user successfully", 200, format);
  } catch (error) {
    console.log("🚀 ~ addUser ~ error:", error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { token } = req.headers;

    const { email, fullName, age, role } = req.body;

    const errToken = checkToken(token);

    if (errToken !== null && errToken?.name !== "TokenExpiredError") {
      responseData(res, "Non-authorized tokens", 401);
      return;
    }

    const checkEmail = await initModel.users.findOne({
      where: {
        email,
      },
    });

    const updateUsers = await checkEmail.update({
      full_name: fullName,
      age: parseInt(age),
      role,
    });

    const format = {
      userId: updateUsers.user_id,
      email: updateUsers.email,
      fullName: updateUsers.full_name,
      age: updateUsers.age,
      role: updateUsers.role,
    };

    responseData(res, "Update user successfully", 200, format);
  } catch (error) {
    console.log("🚀 ~ updateUser ~ error:", error);
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    // console.log("🚀 ~ uploadAvatar ~ file:", file);

    const { token } = req.headers;

    const errToken = checkToken(token);

    if (errToken !== null || errToken?.name === "TokenExpiredError") {
      responseData(res, "Non-authorized tokens", 401);
      return;
    }

    const { userId } = decodeToken(token);

    const checkUser = await initModel.users.findByPk(userId);

    await compressImage(
      process.cwd() + "/public/imgs/" + file.filename,
      process.cwd() + "/public/optimized/"
    );

    checkUser.dataValues.avatar = file.filename;

    await initModel.users.update(checkUser.dataValues, {
      where: {
        user_id: userId,
      },
    });

    const format = {
      userId: checkUser.user_id,
      email: checkUser.email,
      fullName: checkUser.full_name,
      age: checkUser.age,
      avatar: checkUser.avatar,
      role: checkUser.role,
    };

    responseData(res, "Upload avatar successfully", 200, format);
  } catch (error) {
    console.log("🚀 ~ uploadAvatar ~ error:", error);
  }
};

export {
  signup,
  login,
  getCommentInfo,
  saveCommentInfo,
  refreshToken,
  updateUserInfo,
  getUserInfo,
  getUserList,
  deleteUser,
  addUser,
  updateUser,
  uploadAvatar,
};
