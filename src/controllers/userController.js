import initModels from "../models/init-models.js";
import connectSequelize from "../models/connect.js";
import responseData from "../configs/responseData.js";

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
      pass_word: password,
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
  const { email, password} = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      responseData(res, "Invalid email format", 400);
      return;
    }
   
  const checkEmail = await initModel.users.findOne({
    where: {
      email,
    }
  })

  if(!checkEmail){
    responseData(res, "Email is incorrect", 400);
    return;
  }
  
  if(checkEmail.pass_word != password){
    responseData(res, "Password is incorrect", 400);
    return;

  }

  const formatForm = {
    email: checkEmail.email,
    password: checkEmail.pass_word,
  };

  responseData(res, "Login successfully", 200, formatForm);
};

export { signup, login };
