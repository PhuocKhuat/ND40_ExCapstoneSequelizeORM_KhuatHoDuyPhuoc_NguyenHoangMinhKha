import jwt from "jsonwebtoken";
import responseData from "./responseData.js";

const createToken = (data) => jwt.sign(data, "SECRET_KEY", { expiresIn: "7d" });

const checkToken = (token) =>
  jwt.verify(token, "SECRET_KEY", (err, decode) => err);

const decodeToken = (token) => jwt.decode(token);

const middleToken = (req, res, next) => {
  let { token } = req.headers;

  let check = checkToken(token);

  check == null
    ? next()
    : responseData(res, "The token has expired, wrong security key or is invalid", 401, check);
};

export { createToken, decodeToken, checkToken, middleToken };
