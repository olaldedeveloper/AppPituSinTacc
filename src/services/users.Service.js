
import { userModel } from "../models/user.Models.js";
import {
  ErrorType,
  NewError,
} from "../middlewares/errorsManagers.Middleware.js";
import { hashear } from "../utils/crypt.js";
class UsersService {
  constructor() {}
  async register(newUser) {
    const user = await userModel.create(newUser);
    return user;
  }
  async find_User(query) {
    const user = await userModel.readOne(query);
    if (!user) {
      throw new NewError(ErrorType.UNAUTHORIZED_USER, "USER NOT FOUND");
    }
    else{
      
    }
    return user;
  }
  async findUserById(query) {
    const user = await userModel.find_User_Id(query);
    if (!user) {
      throw new NewError(ErrorType.UNAUTHORIZED_USER, "USER NOT FOUND");
    }
    return user;
  }
  async updatePassword(email, password) {
    const passwordH = await hashear(password);
    const user = await userModel.updateOnePassword({
      email: email,
      password: passwordH,
    });
    return user;
  }
  async updateDateTime(email) {
    const updateDate = await userModel.updateDate(email);
    if (!updateDate) {
      throw new NewError(ErrorType.FORBIDDEN_USER, "Error update Date");
    }
    return updateDate;
  }
  async findManyUsers(query) {
    const user = await userModel.readMany(query);
    return user;
  }
  async deleteUser(query) {
    const user = await userModel.deleteOne(query);
    return user;
  }
  async deleteManyUsers(query) {
    const user = await userModel.deleteMany(query);
    return user;
  }
  async addCartToUser(emailUser, _idCart) {
    const user = await userModel.updateCarts(emailUser, _idCart);
  }
  async findIdCartByUserEmail(_idCart, userEmail) {
    const user = await userModel.findCart(_idCart, userEmail);
    if (!user) {
      throw new NewError(ErrorType.FORBIDDEN_USER, "THIS CART IS NOT YOURS");
    }
    return user;
  }
  async changeUserRol(id) {
    const user = await userModel.changeRol(id);
    return user;
  }
  async checkDocumentsArray(file, documents) {
    for (let index = 0; index < documents.length; index++) {
      const document = documents[index];
      if (document.name === file.originalname) {
        return true;
      }
    }
    return false;
  }

  async actualizarArregloDocuments(user) {
    const userUpdate = await userModel.updateDocuments(
      user.email,
      user.documents
    );
    return userUpdate;
  }

  async validoParaPremium(uid) {
    const user = await this.findUserById(uid);
    let identification = false;
    let adress = false;
    let state = false;

    for (let index = 0; index < user.documents.length; index++) {
      const element = user.documents[index];
      if (element.name === "identification.pdf") {
        identification = true;
      }
      if (element.name === "adress.pdf") {
        adress = true;
      }
      if (element.name === "state.pdf") {
        state = true;
      }
    }
    if (identification && adress && state) {
      return true;
    } else {
      return false;
    }
  }
}
export const usersService = new UsersService();
