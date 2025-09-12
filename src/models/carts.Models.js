import mongoose, { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

import {
  NewError,
  ErrorType,
} from "../middlewares/errorsManagers.Middleware.js";
const CartSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    date_Done : { type: Date, default: null },
    date_Collection : { type: Date ,default: null},
    date_Create : { type: Date, default: Date.now },
    done : { type: Boolean, default: false },
    products: {
      type: [
        {
          _id: { type: String, ref: "products" },
          quantity: { type: Number, min: 1, default: 1 },
        },
      ],
      default: [],
    },
  },
  { collection: "carts" },
  {
    strict: "throw",
    versionKey: false,
  }
);

export const cartsManagerMongoose = model("carts", CartSchema);

class CartsDaoMonoose {
  async create(data) {
    try {
      const newCart = await cartsManagerMongoose.create({});
      return newCart.toObject();
    } catch (error) {
      throw new NewError(ErrorType.INVALID_DATA, error.message);
    }
  }
  async readOne(query) {
    const cart = await cartsManagerMongoose.findById(query).lean();
    return cart;
  }
  async readMany(query) {
    const array = await cartsManagerMongoose.find().lean();
    return array;
  }
  async updateOne(_idC, cart) {
    const cartUpdate = cartsManagerMongoose.findOneAndUpdate(
      { _id: _idC },
      { $set: cart },
      { new: true }
    );
    return cartUpdate.toObject()  ;
  }
  async updateMany(query, data) {}

  async addProductCart(_idC, _idP) {
    const cart = await this.readOne(_idC);
    if (!cart) {
      throw new NewError(ErrorType.NOT_FOUND, "ID CART NOT FOUND");
    }
    const productFind = cart.products.find((p) => {
      return p._id == _idP;
    });
    if (!productFind) {
      cart.products.push({ _id: _idP, quantity: 1 });
    } else {
      productFind.quantity++;
    }
    const updateCart = await cartsDaoMongoose.updateOne(_idC, cart);

    return updateCart.toObject()  ;
  }
  async deleteOne(cid, pid) {
    const cart = await cartsManagerMongoose
      .findByIdAndUpdate(
        cid,
        { $pull: { products: { _id: pid } } },
        { new: true }
      )
      .lean();
    return cart;
  }

  async deleteMany() {
    const newCart = cartsManagerMongoose.findOneAndReplace(
      { _id: cid },
      { products: [] },
      { new: true }
    ).lean;
    return newCart;
  }
}

export const cartsModel = new CartsDaoMonoose();
