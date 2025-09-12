import mongoose, { Schema, model } from "mongoose";
import { randomUUID } from "crypto";
import mongoosePaginate from "mongoose-paginate-v2";
import {
  ErrorType,
  NewError,
} from "./../middlewares/errorsManagers.Middleware.js";

const productoSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    title: { type: String, default: "Sin Titulo" },
    description: { type: String },
    price: { type: Number, required: true },
    owner: { type: String, default: "admin", ref: "users.email" },
    stock: { type: Number, default: 0 },
    thumbnail: { type: String },
  },
   {
    collection: "products",
    strict: "throw",
    versionKey: false,
  }
);
productoSchema.methods.addProductMongoose = function (pID) {
  if (!this.productos.includes(pID)) {
    this.productos.push(pID);
  }
};
productoSchema.plugin(mongoosePaginate);
const productsManagerMongoose = model("products", productoSchema);

class ProductsDaoMonoose {
  async create(data) {
    try {
      const newProducto = await productsManagerMongoose.create(data);
      return newProducto.toObject();
    } catch (error) {
      throw new NewError(ErrorType.INVALID_DATA, error.message);
    }
  }

  async readOne(query) {
    const product = await productsManagerMongoose.findById(query).lean();
    return product;
  }
  async readMany(query) {
    const array = await productsManagerMongoose.find().lean();
    return array;
  }
  async paginateProducts(query, options) {
    const productos = await productsManagerMongoose.paginate(query, options);
    return productos;
  }
  async updateOne(query, data) {
    const productUpdate = await productsManagerMongoose
      .findByIdAndUpdate(
        query,
        { $set: data },
        {
          new: true,
        }
      )
      .lean();
    return productUpdate;
  }
  async updateMany(query, data) {}
  async deleteOne(query) {
    const productDelete = await productsManagerMongoose
      .findByIdAndDelete(query)
      .lean();
    return productDelete;
  }
  async deleteMany(query) {}
}

export const productsModel = new ProductsDaoMonoose();
