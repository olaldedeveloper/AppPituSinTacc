import { cartsModel } from "../models/carts.Models.js";
import {
  NewError,
  ErrorType,
} from "../middlewares/errorsManagers.Middleware.js";
import { productService } from "./products.Service.js";
class CartsService {
  async findCartById(_id) {
    const carts = await cartsModel.readOne(_id);
    if (!carts) {
      throw new NewError(ErrorType.NOT_FOUND, "ID CART NOT FOUND");
    }
    return carts;
  }
  async showmManyCarts() {
    try {
      const array = await cartsModel.readMany();
      return array;
    } catch {
      error;
    }
    {
      throw new NewError(ErrorType.ERROR_REQUEST, error.message);
    }
  }
  async createNewCart(newcarts) {
    const cartCreado = await cartsModel.create(newcarts);
    if (!cartCreado) {
      throw new NewError(ErrorType.ERROR_REQUEST, "CREATE CART ERROR");
    }
    return cartCreado;
  }
  async updateneCart(id, carts) {
    const cartsoUpdate = await cartsModel.updateOne(id, carts);
    if (!cartsoUpdate) {
      throw new NewError(ErrorType.ERROR_REQUEST, "UPDATE CART ERROR");
    }
    return cartsoUpdate;
  }
  async deleteCartsById(_id) {
    const cartsBorrado = await cartsModel.deleteMany(_id);
    if (!cartsBorrado) {
      throw new NewError(ErrorType.NOT_FOUND, "ID CART ERROR");
    }
    return cartsBorrado;
  }
  async addProductToCart(_idC, product) {
    const productoSumado = await cartsModel.addProductCart(
      _idC,
      product._id
    );
    return productoSumado;
  }

  async deleteProductOfCart(_idC, _idP) {
    const cart = await cartsModel.deleteOne(_idC, _idP);
    return cart;
  }
  async checkStock(cart) {
    for (let index = 0; index < cart.products.length; index++) {
      let element = cart.products[index];
      let product = await productService.findProductByID(element._id);
      if (!(product.stock > element.quantity)) {
        return false;
      }
    }
    return true;
  }
  async AddAndRemoveProducts(cart) {
    let total = 0;
    for (let index = 0; index < cart.products.length; index++) {
      let element = cart.products[index];
      let product = await productService.buscarPorID(element._id);
      total = total + element.quantity * product.price;
      product.stock = product.stock - element.quantity;
      await productService.actualizarProducto(product._id, {
        stock: product.stock,
      });
    }
    return total;
  }
}

export const cartsService = new CartsService();
