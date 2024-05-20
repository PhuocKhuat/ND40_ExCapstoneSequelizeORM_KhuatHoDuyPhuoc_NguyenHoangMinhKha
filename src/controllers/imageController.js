import { checkToken, decodeToken } from "../configs/jwt.js";
import responseData from "../configs/responseData.js";
import connectSequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import sequelize, { where } from "sequelize";
import compressImage from "../configs/compressImg.js";

const initModel = initModels(connectSequelize);

const getImgInfoAndCreator = async (req, res) => {
  try {
    const { imgId } = req.params;

    const checkImgId = await initModel.images.findByPk(imgId, {
      include: "user",
    });

    if (!checkImgId) {
      responseData(res, "Image id not found", 404);
      return;
    }

    const formatImg = {
      imgId: checkImgId.img_id,
      imgName: checkImgId.img_name,
      imgUrl: checkImgId.img_url,
      description: checkImgId.description,
      user: {
        userId: checkImgId.user.user_id,
        email: checkImgId.user.email,
        fullName: checkImgId.user.full_name,
        age: checkImgId.user.age,
        avatar: checkImgId.user.avatar,
        role: checkImgId.user.role,
      },
    };

    responseData(res, "Proceed successfully", 200, formatImg);
  } catch (error) {
    return responseData(res, "Error processing request", 500);
  }
};

const getSavedImgInfo = async (req, res) => {
  try {
    const { imgId } = req.params;

    const { token } = req.headers;

    const { userId } = decodeToken(token);

    const checkImgId = await initModel.images.findOne({
      where: {
        img_id: imgId,
      },
      include: "user",
    });

    if (!checkImgId) {
      responseData(res, "Image id not found", 404, "");
      return;
    }

    const checkIdInSaveImage = await initModel.save_images.findOne({
      where: {
        user_id: userId,
        img_id: imgId,
      },
    });

    if (checkIdInSaveImage) {
      if (checkIdInSaveImage.dataValues.is_saved === true) {
        responseData(res, "Image has been saved", 200, checkIdInSaveImage);
        return;
      }
    }

    const updateSave = await initModel.save_images.create({
      user_id: userId,
      img_id: imgId,
      date_save: new Date(),
      is_saved: 1,
    });

    const formatImgInfor = {
      user: {
        userId: userId,
        email: checkImgId.user.email,
        fullName: checkImgId.user.full_name,
        age: checkImgId.user.age,
        avatar: checkImgId.user.avatar,
      },
      image: {
        imgId: checkImgId.img_id,
        imgName: checkImgId.img_name,
        imgUrl: checkImgId.img_url,
        description: checkImgId.description,
      },
      dateSaved: updateSave.date_save,
      isSaved: updateSave.is_saved,
    };

    responseData(res, "Image is being saved", 200, formatImgInfor);
  } catch (error) {
    console.log("🚀 ~ getSavedImgInfo ~ error:", error);
  }
};

const getImgList = async (req, res) => {
  try {
    const imgList = await initModel.images.findAll({
      include: "user",
    });

    const formatImgList = imgList.map((img) => ({
      imgId: img.img_id,
      imgName: img.img_name,
      imgUrl: img.img_url,
      description: img.description,
      user: {
        useId: img.user?.user_id,
        email: img.user?.email,
        fullName: img.user?.full_name,
        age: img.user?.age,
        avatar: img.user?.avatar,
        role: img.user?.role,
      },
    }));

    responseData(res, "Proceed successfully", 200, formatImgList);
  } catch (error) {
    return responseData(res, "Error processing request", 500);
  }
};

const searchImgListByName = async (req, res) => {
  try {
    let { imgName } = req.query;

    let { Op } = sequelize;

    const searchImgList = await initModel.images.findAll({
      where: {
        img_name: {
          [Op.like]: `%${imgName}%`,
        },
      },
      include: "user",
    });

    if (!searchImgList.length) {
      responseData(res, "Image name not found", 404);
      return;
    }

    const formatImgList = searchImgList.map((img) => ({
      imgId: img.img_id,
      imgName: img.img_name,
      imgUrl: img.img_url,
      description: img.description,
      user: {
        useId: img.user?.user_id,
        email: img.user?.email,
        fullName: img.user?.full_name,
        age: img.user?.age,
        avatar: img.user?.avatar,
        role: img.user?.role,
      },
    }));

    responseData(res, "Proceed successfully", 200, formatImgList);
  } catch (error) {
    return responseData(res, 500, "Error processing request");
  }
};

const addImage = async (req, res) => {
  try {
    let files = req.files;

    let { token } = req.headers;

    let { userId } = decodeToken(token);

    const imageObject = files.map((item) => ({
      img_name: item.originalname,
      img_url: item.filename,
      description: item.size,
      user_id: userId,
    }));

    await initModel.images.bulkCreate(imageObject);

    const formatImg = imageObject.map((image) => ({
      imgName: image.img_name,
      imgUrl: image.img_url,
      description: image.description,
      userId: image.user_id,
    }));

    const filenames = files.map((item) => item.filename);

    // Nén từng ảnh một và lưu vào thư mục optimized
    for (let filename of filenames) {
      await compressImage(
        process.cwd() + "/public/imgs/" + filename,
        process.cwd() + "/public/optimized/" + filename
      );
    }

    responseData(res, "Add image successfully", 200, formatImg);
  } catch (error) {
    return responseData(res, "Error processing request", 500);
  }
};

// GET LIST SAVED IMAGE BY USER ID
const getListSaveImgByUserId = async (req, res) => {
  try {
    let { token } = req.headers;
    console.log("🚀 ~ getListSaveImgByUserId ~ token:", token);
    let errToken = checkToken(token);

    if (errToken === null) {
      let { userId } = decodeToken(token);

      let getListSavedImg = await initModel.save_images.findAll({
        where: {
          user_id: userId,
        },
        include: ["user", "img"],
      });

      const format = getListSavedImg.map((img) => ({
        user: {
          userId: img.user_id,
          email: img.user.email,
          fullName: img.user.full_name,
          age: img.user.age,
          avatar: img.user.avatar,
          role: img.user.role,
        },
        img: {
          imgId: img.img.img_id,
          imgName: img.img.img_name,
          imgUrl: img.img.img_url,
          description: img.img.description,
        },
        dateSaved: img.date_save,
        isSaved: img.is_saved,
      }));

      responseData(res, "Get list save img by user id success", 200, format);
      return;
    }
    responseData(res, "Invalid authenication", 401, "");
  } catch (error) {
    console.log("🚀 ~ getListSaveImgByUserId ~ error:", error);
  }
};

// GET LIST CREATED IMAGE BY USER ID
const getListImgByUserId = async (req, res) => {
  try {
    let { token } = req.headers;
    let errToken = checkToken(token);

    if (errToken == null) {
      let { userId } = decodeToken(token);

      let getImgList = await initModel.images.findAll({
        where: {
          user_id: userId,
        },
        include: "user",
      });

      const format = getImgList.map((img) => ({
        imgId: img.img_id,
        imgName: img.img_name,
        imgUrl: img.img_url,
        description: img.description,
        user: {
          useId: img.user?.user_id,
          email: img.user?.email,
          fullName: img.user?.full_name,
          age: img.user?.age,
          avatar: img.user?.avatar,
          role: img.user?.role,
        },
      }));

      responseData(res, "Get list image by userId successfully", 200, format);
      return;
    }
    responseData(res, "Token has expired or is invalid", 401);
  } catch (error) {
    console.log("🚀 ~ getListImgByUserId ~ error:", error);
  }
};

// DELETE CREATED IMAGE
const deleteImgByImgId = async (req, res) => {
  try {
    let { imgId } = req.params;

    const checkImg = await initModel.images.findOne({
      where: {
        img_id: imgId,
      },
      include: ["user"],
    });

    if (!checkImg) {
      responseData(res, "Image Id not found", 404);
      return;
    }

    await initModel.save_images.destroy({
      where: {
        img_id: checkImg.img_id,
        user_id: checkImg.user_id,
      },
    });

    await initModel.comments.destroy({
      where: {
        img_id: checkImg.img_id,
        user_id: checkImg.user_id,
      },
    });

    const removeImg = await initModel.images.destroy({
      where: {
        img_id: checkImg.img_id,
        user_id: checkImg.user_id,
      },
    });

    responseData(res, "Delete image successfully", 200, removeImg);
    return;
  } catch (error) {
    console.log("🚀 ~ deleteImgByImgId ~ error:", error);
  }
};

// DELETE SAVED IMAGE
const deleteSavedImgByImgId = async (req, res) => {
  const { imgId } = req.query;

  const checkImg = await initModel.save_images.findOne({
    where: {
      img_id: imgId,
    },
    include: ["img", "user"],
  });

  if (!checkImg) {
    responseData(res, "Image not found", 404);
    return;
  }

  await initModel.save_images.destroy({
    where: {
      img_id: checkImg.img_id,
      user_id: checkImg.user_id,
    },
  });

  responseData(res, "Delete saved image successfully", 200);
};

export {
  getImgInfoAndCreator,
  getSavedImgInfo,
  getImgList,
  searchImgListByName,
  addImage,
  getListSaveImgByUserId,
  getListImgByUserId,
  deleteImgByImgId,
  deleteSavedImgByImgId,
};
