import responseData from "../configs/responseData.js";
import connectSequelize from "../models/connect.js";
import initModels from "../models/init-models.js";

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
      user:{
        userId: checkImgId.user.user_id,
        email: checkImgId.user.email,
        fullName: checkImgId.user.full_name,
        age: checkImgId.user.age,
        avatar: checkImgId.user.avatar,
        role: checkImgId.user.role,
      }
    };
  
    responseData(res, "Proceed successfully", 200, formatImg);

  } catch (error) {
    
    return responseData(res, "Error processing request", 500);
  }
};

const getCommentInfo = async (req, res) => {
  res.send("abc");
}

export { getImgInfoAndCreator, getCommentInfo };
