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

const getCommentInfo = async (req, res) => {
  try {
    const { imgId } = req.params;

    const checkImgId = await initModel.comments.findOne({
      where: {
        img_id: imgId,
      },
    });

    if (!checkImgId) {
      responseData(res, "Image Id not found", 200);
      return;
    }

    const formatComment = {
      commentId: checkImgId.comment_id,
      dateCreated: checkImgId.date_created,
      contentInfo: checkImgId.content_info,
    };

    responseData(res, "Proceed successfully", 200, formatComment);
  } catch (error) {
    return responseData(res, 500, "Error processing request");
  }
};

const getSavedImgInfo = async(req, res)=>{
  const { imgId } = req.params;

  const checkImgId = await initModel.save_images.findOne({
    where:{
      img_id: imgId
    },
    include: ["user", "img"],
  });

  if(!checkImgId){
    responseData(res, "Image id not found", 404);
    return;
  }
  
  if(checkImgId.is_saved == 1){
    
    const formatImgInfo = {
      user:{
        userId: checkImgId.user.user_id,
        email: checkImgId.user.email,
        fullName: checkImgId.user.full_name,
        age: checkImgId.user.age,
        avatar: checkImgId.user.avatar,
      },
      image:{
        imgId: checkImgId.img.img_id,
        imgName: checkImgId.img.img_name,
        imgUrl: checkImgId.img.img_url,
        description: checkImgId.img.description,
      },
      dateSaved: checkImgId.date_save,
      isSaved: checkImgId.is_saved,
    }

    responseData(res, "Saved image", 200, formatImgInfo);
    return;
  }
  
  responseData(res, "Image is being saved", 200);

}

export { getImgInfoAndCreator, getCommentInfo, getSavedImgInfo };
