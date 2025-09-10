import mongoose, { Schema, model } from "mongoose";
import { randomUUID } from "crypto";
import { hasheadasSonIguales, hashear } from "../utils/crypt.js";
import {
  ErrorType,
  NewError,
} from "../middlewares/errorsManagers.Middleware.js";

const UsersManager = new Schema(
  {
    _id: { type: String, default: randomUUID },
    email: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    password: { type: String, required: true },
    carts: [{ type: mongoose.Schema.Types.ObjectId, ref: "carts" }] ,
    last_connection: { type: Date },
    role: { type: String, enum: ["admin", "user", "premium"], default: "user" },
    active: { type: Boolean, default: true },
  },
  {
    strict: "throw",
    versionKey: false,
 
  }
);

export const usersModel = mongoose.model("users", UsersManager);

class UsersDaoMonoose {
  async create(data) {
    data.password = await hashear(data.password);
    data.active = false;
    const newUser = await usersModel.create(data);
    return await this.devolverSinPassword(newUser);
  }
  async find_User_Email(query) {
    const user = await usersModel.findOne({ email: query.email }).lean();
    if (user) {
      return await this.devolverSinPassword(user);
    }
    return null;
  }
  async find_User_Id(query) {
    const user = await usersModel.findById(query).lean();
    if (user) {
      return await this.devolverSinPassword(user);
    }
    return null;
  }

  async readOne(query) {
    try {
      const user = await usersModel.findOne({ email: query.email }).lean();
      if (await hasheadasSonIguales(query.password, user.password)) {
        return await this.devolverSinPassword(user);
      }
    } catch (error) {
      return null;
    }
  }
  async readMany(query) {
    return await usersModel.find(query).lean();
  }

  async updateCarts(emailUser, _idCart) {
    const array = await usersModel
      .findOneAndUpdate(
        { email: emailUser },
        { $push: { carts: { _id: _idCart } } },
        { new: true }
      )
      .lean();
    return array;
  }
  async updateDate(emailUser) {
    const currentDate = new Date();
    const update = await usersModel
      .findOneAndUpdate(
        { email: emailUser },
        { $set: { last_connection: currentDate } },
        { new: true }
      )
      .lean();
    return update;
  }
    async changeActive(emailUser) {
    const currentDate = new Date();
    const update = await usersModel
      .findOneAndUpdate(
        { email: emailUser },
        { $set: { active: true } },
        { new: true }
      )
      .lean();
    return update;
  }
  async updateOnePassword(query) {
    const updateUser = await usersModel
      .updateOne(
        { email: query.email },
        { $set: { password: query.password } },
        { new: true }
      )
      .lean();
    return updateUser;
  }
  async updateMany(query, data) {
    throw new Error("NOT IMPLEMENTED");
  }
  async deleteOne(query) {
    throw new Error("NOT IMPLEMENTED");
  }
  async deleteMany(query) {
    throw new Error("NOT IMPLEMENTED");
  }
  async findCart(_idCart, userEmail) {
    const array = await usersModel
      .findOne({ email: userEmail, carts: { _id: _idCart } })
      .lean();
    return array;
  }
  async changeRol(id) {
    const user = await usersModel.findOne({ _id: id });
    if (user) {
      if (user.role === "user") {
        await usersModel
          .findOneAndUpdate(
            { _id: id },
            { $set: { role: "premium" } },
            { new: true }
          )
          .lean();
      } else {
        if (user.role === "premium") {
          await usersModel
            .findOneAndUpdate(
              { _id: id },
              { $set: { role: "user" } },
              { new: true }
            )
            .lean();
        }
      }
      return await this.devolverSinPassword(user);
    }
    throw new NewError(ErrorType.UNAUTHORIZED_USER, "USER NOT FOUND");
  }

  async devolverSinPassword(query) {
    const datosUsuario = {
      _id: query["_id"],
      email: query["email"],
      first_name: query["first_name"],
      last_name: query["last_name"],
      age: query["age"],
      carts: query["carts"],
      role: query["role"],
      last_connection: query["last_connection"],
      active: query["active"],
    };
    return datosUsuario;
  }
}

export const userModel = new UsersDaoMonoose();
