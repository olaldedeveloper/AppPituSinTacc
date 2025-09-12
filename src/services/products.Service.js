import { productsModel } from "../models/products.Models.js";
import {
  ErrorType,
  NewError,
} from "../middlewares/errorsManagers.Middleware.js";

class ProductService {
  async findProductByID(_id) {
    const product = await productsModel.readOne(_id);
    if (!product) {
      throw new NewError(ErrorType.NOT_FOUND, "ID PRODUCT NOT FOUND");
    }
    return product;
  }
  async showManyProducts() {
    const array = await productsModel.readMany();
    if (!array) {
      throw new NewError(ErrorType.NOT_FOUND, "ID PRODUCT NOT FOUND");
    }
    return array;
  }

  async showManyPaginateProducts(req) {
    try {
      const opcionesDePaginacion = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
        lean: true,
      };
      const criterioBusqueda = {};
      if (req.query.sort) {
        opcionesDePaginacion.sort = {
          price: req.query.sort === "desc" ? -1 : 1,
        };
      }
      if (req.query.query) {
      }
      const productos = await productsModel.paginateProducts(
        criterioBusqueda,
        opcionesDePaginacion
      );
      return productos;
      /*

      return {
        status: "success",
        payload: productos.docs, // productos enviados como arreglo
        totalPages: productos.totalPages, //total paginas
        prevPage: productos.prevPage, // link a la pagina siguiente
        nextPage: productos.nextPage, // link a la pagina anterior
        page: productos.page, //pagina actual
        hasPrevPage: productos.hasPrevPage, //si existe pagina anterior
        hasNextPage: productos.hasNextPage, //si existe pagina siguiente
        hayDocs: productos.docs > 0, //si docs es mayor a 0 los envia
        prevLink: productos.prevLink,
        user: req.user, //envia el usser conectado con fist_name , last_name , y isAdmin
      };*/
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async createProduct(newProduct) {
    const productoCreado = await productsModel.create(newProduct);
    return productoCreado;
  }
  async updateProduct(id, product) {
    const productoUpdate = await productsModel.updateOne(id, product);
    if (!productoUpdate) {
      throw new NewError(ErrorType.NOT_FOUND, "ID PRODUCT NOT FOUND");
    }
    return productoUpdate;
  }
  async deleteProductByID(_id) {
    const productoBorrado = await productsModel.deleteOne(_id);
    if (!productoBorrado) {
      throw new NewError(ErrorType.NOT_FOUND, "ID PRODUCT NOT FOUND");
    }
    return productoBorrado;
  }
  async isAllowed(product, user) {
    if (user.role === "admin" || product.owner === user.email ) {
      return true;
    }else{
       throw new NewError(ErrorType.NOT_FOUND, "NOT ADMIN OR OWNER ALLOWED TO CHANGE THIS PRODUCT");
    }
}
}
export const productService = new ProductService();
