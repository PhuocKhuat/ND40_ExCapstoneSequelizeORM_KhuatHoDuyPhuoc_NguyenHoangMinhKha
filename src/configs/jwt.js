import jwt from "jsonwebtoken";
import responseData from "./responseData.js";

const createToken = (data) => jwt.sign(data, "SECRET_KEY", { expiresIn: "5s" });

const checkToken = (token) =>
  jwt.verify(token, "SECRET_KEY", (err, decode) => err);

const decodeToken = (token) => jwt.decode(token);

const createTokenRef = (data) =>
  jwt.sign(data, "ADVANCED_SECRET_KEY", { expiresIn: "1y" });

const checkTokenRef = (token) =>
  jwt.verify(token, "ADVANCED_SECRET_KEY", (error, decode) => error);

const middleToken = (req, res, next) => {
  let { token } = req.headers;

  let check = checkToken(token);

  check == null
    ? next()
    : responseData(
        res,
        "The token has expired, wrong security key or is invalid",
        401,
        check
      );
};

export { createToken, decodeToken, checkToken, middleToken, createTokenRef, checkTokenRef };
