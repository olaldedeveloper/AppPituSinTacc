
import { userDaoMongoose } from "../models/user.Models.js";
import {
  ErrorType,
  NewError,
} from "../middlewares/errorsManagers.Middleware.js";
import { hashear } from "../utils/crypt.js";
export class UsersService {
  constructor() {}
  async register(newUser) {
    const user = await userDaoMongoose.create(newUser);
    return user;
  }
  async find_User(query) {
    const user = await userDaoMongoose.find_User(query);
    if (!user) {
      throw new NewError(ErrorType.UNAUTHORIZED_USER, "USER NOT FOUND");
    }
    return user;
  }
  async findUserById(query) {
    const user = await userDaoMongoose.findUserId(query);
    if (!user) {
      throw new NewError(ErrorType.UNAUTHORIZED_USER, "USER NOT FOUND");
    }
    return user;
  }
  async actualizarPasswordUser(email, password) {
    const passwordH = await hashear(password);
    const user = await userDaoMongoose.updateOnePassword({
      email: email,
      password: passwordH,
    });
    return user;
  }
  async actualizarHorarioLogin(email) {
    const updateDate = await userDaoMongoose.updateDate(email);
    if (!updateDate) {
      throw new NewError(ErrorType.FORBIDDEN_USER, "Error update Date");
    }
    return updateDate;
  }
  async buscarMuchosUsers(query) {
    const user = await userDaoMongoose.readMany(query);
    return user;
  }
  async borrarUser(query) {
    const user = await userDaoMongoose.deleteOne(query);
    return user;
  }
  async borrarMuchosUsers(query) {
    const user = await userDaoMongoose.deleteMany(query);
    return user;
  }
  async agregarCarrito(emailUser, _idCart) {
    const user = await userDaoMongoose.updateCarts(emailUser, _idCart);
  }
  async buscarCartPorIdEnArreglo(_idCart, userEmail) {
    const user = await userDaoMongoose.findCart(_idCart, userEmail);
    if (!user) {
      throw new NewError(ErrorType.FORBIDDEN_USER, "THIS CART IS NOT YOURS");
    }
    return user;
  }
  async cambiarRolUsuario(id) {
    const user = await userDaoMongoose.changeRol(id);
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
    const userUpdate = await userDaoMongoose.updateDocuments(
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
