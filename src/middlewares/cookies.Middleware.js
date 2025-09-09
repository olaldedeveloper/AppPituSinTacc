import { COOKIE_OPTS } from "../config/config.js";
import { cryptData , decryptData} from "../utils/token.js";

export async function crypt_User_Middleware(req, res, next) {
  try{
    req.token = "Bearer " + (await cryptData(req.user));
    next();

  }catch(error){
    return res.status(400).json({ status: "error", message: error.message });
  }}

export async function decrypt_User_Middleware(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ");
    const tokenDesencript = await decryptData(token[1]);
    req.user = tokenDesencript;
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", message: "You Need to login " });
  }
}

export async function check_Cookie_Middleware(req, res, next) {
  try {
    req.token = req.token.split(" ")[1]; //quito Bearer
    res.cookie('token', req.token, COOKIE_OPTS);
    res.status(200).json({ message: 'Login exitoso' });

  } catch (error) {
    return res
      .status(400)
      .json({ status: "error", message: "You Need to login " });
  }}

  export async function read_Cookie_Middleware(req, res, next) {
    try {
      const token = req.cookies.token;
      if (!token) {
        throw new Error("No token found in cookies");
      }
      const tokenDesencript = await decryptData(token);
      req.user = tokenDesencript;
      next();
    } catch (error) {
      return res
        .status(400)
        .json({ status: "error", message: "You Need to login " });
    }
  }

  
export async function logout(req, res) {
  
    res.clearCookie("token", COOKIE_OPTS);
    res.send("logout OK");


}