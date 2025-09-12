// import { managerProducts } from "../dao/models/fs/productManager.js";
import { productsModel } from "../models/products.Models.js";
import {
  ErrorType,
  NewError,
} from "../middlewares/errorsManagers.Middleware.js";
// import { changeNameAndId } from "../../middlewares/multer.Middlewares.js";
import { productService } from "../services/products.Service.js";
import cloudinaryService from "../services/cloudinary.Service.js";
import { deleteLocalIMG } from "../config/multer.Config.js";
export async function getProductsController(req, res, next) {
  try {
    const array = await productService.showManyProducts();
    res.json(array);
  } catch (error) {
    next(error);
  }
}
export async function getProductsPaginate(req, res, next) {
  try {
    const productPaginate = await productService.showManyPaginateProducts(req);
    res.json(productPaginate);
  } catch (error) {
    next(error);
  }
}

export async function updateIMG(req, res, next) {
  try {
    if (req.file) {
      const product = await cloudinaryService.updateIMG(
        req.file.path,
       `${req.body.title}-${Date.now()}`        
      );
      req.body.thumbnail = product;
      deleteLocalIMG(req.file.path);
    }
    next();
   }
    catch (error) {
      next(error);
    }
  }

// Devuelve el producto con el ID especifico, en caso de no existir deuelve False
export async function getProductsById(req, res, next) {
  try {
    req["product"] = await productService.findProductByID(req.params.pid);
    next();
  } catch (error) {
    next(error);
  }
}
//Se envia la funcion agregada en res["sendProducts"]() del socket para actualizar los productos
export async function postAgregarProductController(req, res, next) {
  try {
    res["sendProducts"]();
    return res.result(res["productBody"]);
  } catch (error) {
    next(error);
  }
}
export async function checkAdmin(req, res, next) {
  try {
    if (!(req.user.role === "admin")) {
      throw new NewError(ErrorType.UNAUTHORIZED_USER, "YOU ARE NOT ADMIN");
    }
    next();
  } catch (error) {
    next(error);
  }
}
export async function addNewProduct(req, res, next) {
  try {
    req.body["owner"] = req.user.email;
    const nuevoProduct = await productService.createProduct(req.body);
    return res.json(nuevoProduct);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const _id = req.params.pid;
    const productUpdate = await productService.updateProduct(
      _id,
      req.body
    );
    return res.json(productUpdate);
  } catch (error) {
    next(error);
  }
}
export async function checkIsAllowed(req, res, next) {
  try {
    const isAllowed = await productService.isAllowed(req.product, req.user);
    next();
} catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const productoEliminado = await productService.deleteProductByID(
      req.params.pid
    );
    return res.json(productoEliminado);
  } catch (error) {
    next(error);
  }
}

export async function agregarImg(req, res, next) {}

export async function checkDataProduct(req, res, next) {
  try {
    const productoBody = req.body;
    const esValido = await productsModel.create(productoBody); //managerProducts.addProduct(productoBody);
    if (!esValido) {
      throw error("Campos Invalidos");
    } else {
      res["productBody"] = productoBody;
      next();
    }
  } catch (error) {
    res
      .status(400)
      .json({ status: "error", message: "error al agregar el producto" });
  }
}
