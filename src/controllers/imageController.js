import { decodeToken } from "../configs/jwt.js";
import responseData from "../configs/responseData.js";
import connectSequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import sequelize from "sequelize";
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

    const checkImgIdInSaveImage = await initModel.save_images.findOne({
      where: {
        img_id: imgId,
      },
    });

    const checkUserIdInSaveImage = await initModel.save_images.findOne({
      where: {
        user_id: userId,
      },
    });

    const checkIdInSaveImage = await initModel.save_images.findOne({
      where: {
        user_id: userId,
        img_id: imgId,
      },
    });

    if (!checkImgIdInSaveImage && checkUserIdInSaveImage) {
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
    } else if (checkIdInSaveImage) {
      responseData(res, "Image has been saved", 200);
    } else if (!checkIdInSaveImage) {
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
    }
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
        useId: img.user.user_id,
        email: img.user.email,
        fullName: img.user.full_name,
        age: img.user.age,
        avatar: img.user.avatar,
        role: img.user.role,
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

export {
  getImgInfoAndCreator,
  getSavedImgInfo,
  getImgList,
  searchImgListByName,
  addImage,
};
