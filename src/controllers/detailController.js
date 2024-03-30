import responseData from "../configs/responseData.js";
import connectSequelize from "../models/connect.js";
import initModels from "../models/init-models.js";

const initModel = initModels(connectSequelize)

const getImgInfoAndCreator = async (req, res) => {
  const { idImg } = req.params;
  
  const content = await initModel.images.findByPk(idImg);

  responseData(res, "Proceed successfully", 200, content);
};

export { getImgInfoAndCreator };