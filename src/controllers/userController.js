import initModels from "../models/init-models.js";
import connectSequelize from "../models/connect.js";
import responseData from "../configs/responseData.js";

const initModel = initModels(connectSequelize);

const signup = async (req, res) => {
  try {
    let { email, fullName, password, age } = req.body;

    const checkEmail = await initModel.users.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      responseData(res, "Email already exists", 400);
      return;
    }
    const createEmail = await initModel.users.create({
      email,
      full_name: fullName,
      pass_word: password,
      age,
      role: "user",
    });

    const formatForm = {
      email: createEmail.email,
      fullName: createEmail.full_name,
      password: createEmail.pass_word,
      age: createEmail.age,
    };

    responseData(res, "Create email successfully", 200, formatForm);
  } catch (error) {
    return responseData(res, "Error processing request", 500);
  }
};

// Chưa khắc phục lỗi 400 khi FE nhập ký tự, chưa làm kiểm tra định dạng email.

export { signup };
