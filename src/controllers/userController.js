import initModels from "../models/init-models.js";
import connectSequelize from "../models/connect.js";
import responseData from "../configs/responseData.js";
import bcrypt from "bcrypt";
import { createToken } from "../configs/jwt.js";

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
      let token = createToken({userId: checkEmail.dataValues.user_id});

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

export { signup, login };
