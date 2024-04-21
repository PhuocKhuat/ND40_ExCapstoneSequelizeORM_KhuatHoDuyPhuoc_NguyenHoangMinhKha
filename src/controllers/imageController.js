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

    const checkImgId = await initModel.save_images.findOne({
      where: {
        img_id: imgId,
      },
      include: ["user", "img"],
    });

    if (!checkImgId) {
      responseData(res, "Image id not found", 404);
      return;
    }

    if (checkImgId.is_saved == 1) {
      const formatImgInfo = {
        user: {
          userId: checkImgId.user.user_id,
          email: checkImgId.user.email,
          fullName: checkImgId.user.full_name,
          age: checkImgId.user.age,
          avatar: checkImgId.user.avatar,
        },
        image: {
          imgId: checkImgId.img.img_id,
          imgName: checkImgId.img.img_name,
          imgUrl: checkImgId.img.img_url,
          description: checkImgId.img.description,
        },
        dateSaved: new Date(),
        isSaved: checkImgId.is_saved,
      };

      responseData(res, "Image has been saved", 200, formatImgInfo);
      return;
    }

    const updateSave = await checkImgId.update({
      date_save: new Date(),
      is_saved: 1,
    });

    const formatImgInfor = {
      user: {
        userId: updateSave.user.user_id,
        email: updateSave.user.email,
        fullName: updateSave.user.full_name,
        age: updateSave.user.age,
        avatar: updateSave.user.avatar,
      },
      image: {
        imgId: updateSave.img.img_id,
        imgName: updateSave.img.img_name,
        imgUrl: updateSave.img.img_url,
        description: updateSave.img.description,
      },
      dateSaved: updateSave.date_save,
      isSaved: updateSave.is_saved,
    };

    responseData(res, "Image is being saved", 200, formatImgInfor);
  } catch (error) {
    return responseData(res, 500, "Error processing request");
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
    let { nameImg } = req.params;

    let { Op } = sequelize;

    const searchImgList = await initModel.images.findAll({
      where: {
        img_name: {
          [Op.like]: `%${nameImg}%`,
        },
      },
      include: "user",
    });

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
    return responseData(res, 500, "Error processing request");
  }
};

export {
  getImgInfoAndCreator,
  getSavedImgInfo,
  getImgList,
  searchImgListByName,
  addImage,
};
