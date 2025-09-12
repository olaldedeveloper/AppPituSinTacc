
import { cartsService } from "../services/carts.Service.js";
import { productService } from "../services/products.Service.js";
// import { ticketService } from "../../services/ticket.service.js";
import { usersService } from "../services/users.Service.js";
// import { logger } from "../utils/winston.js";
import {
  ErrorType,
  NewError } from "./errorsManagers.Middleware.js";

//Crea un nuevo carrito vacio
export async function createNewCart(req, res, next) {
  try {
    const cartN = await cartsService.createNewCart({});
    await usersService.addCartToUser(req.user.email, cartN._id);

    res.json(cartN);
  } catch (error) {
    next(error);
  }
}

// Agrega el producto (pID) al carrito, verifica si existe, si es asi lo agrega al carrito o lo suma, si no existe el id del carrito o producto lo informa
export async function addProductArrayByID(req, res, next) {
  try {
    const cart = await cartsService.addProductToCart(req.cid, req.product);
    res.json(cart);
  } catch (error) {
    next(error);
  }
}
export async function checkIsOwner(req, res, next) {
  try {
    req["cid"] = req.params.cId;
    req["product"] = await productService.findProductByID(req.params.pid);
    if (!(req.user.email === req.product.owner)) {
      next();
    } else {
      throw new NewError(
        ErrorType.UNAUTHORIZED_USER,
        "OWNER OF THE PRODUCT CAN NOT ADD IT IN THE CART"
      );
    }
  } catch (error) {
    next(error);
  }
}

// Devuelve el arreglo de productos del carrito enviado, en caos que no lo encuentre lo devuelve
export async function getCartsByID(req, res, next) {
  try {
    const cart = await cartsService.findCartById(req.params.cId);
    res.result(cart.products);
  } catch (error) {
    next(error);
  }
}

// Envia todos los carritos que esten guardados en la base de datos.
export async function showCartList(req, res, next) {
  try {
    const listaCarrito = await cartsService.showmManyCarts();
    res.result(listaCarrito);
  } catch (error) {
    next(error);
  }
}

//Se borra del arreglo del carrito el producto(pid) enviado
export async function deleteOneProductOfCart(req, res, next) {
  try {
    const pid = req.params.pid;
    const cid = req.params.cId;

    const carritoEncontrar = await cartsService.deleteProductOfCart(cid, pid);
    if (carritoEncontrar) {
      return res.result(carritoEncontrar);
    }
    throw new NewError(ErrorType.NOT_FOUND, "ID ERROR");
  } catch (error) {
    next(error);
  }
}

//Se reemplaza el arreglo de productos en el carrito(cid) indicado por un arreglo vacio
export async function deleteAllProductsOfCart(req, res, next) {
  try {
    const cid = req.params.cId;

    const carrito = await cartsMongoose.findOneAndReplace(
      { _id: cid },
      { products: [] },
      { new: true }
    );

    if (carrito) {
      return res.result(carrito);
    } else {
      throw new NewError(ErrorType.NOT_FOUND, "ID CART NOT FOUND");
    }
  } catch (error) {
    next(error);
  }
}



export async function checkStockAndAdd(req, res, next) {
  let suma = 1;
  try {
    const cart = await cartsService.buscarCartPorID(req.params.cId);
    if (!cart) {
      throw new NewError(ErrorType.NOT_FOUND, "ID CART NOT FOUND");
    } else {
      const valid = await cartsService.validarStock(cart);
      if (!valid) {
        throw new NewError(ErrorType.ERROR_REQUEST, "NOT ENOUGHT STOCK");
      }
      req["cart"] = cart;
      next();
    }
  } catch (error) {
    next(error);
  }
}
export async function checkUserIsOwnerOfCart(req, res, next) {
  try {
    const cart = await usersService.findIdCartByUserEmail(
      req.cid,
      req.user.email
    );
    next();
  } catch (error) {
    next(error);
  }
}
export async function subtractProducts(req, res, next) {
  const total = await cartsService.sumarYSacarProductos(req["cart"]);
  req["total"] = total;
  next();
}

export async function endShop(req, res, next) {
  /*const newTicket = await ticketService.crearTicket(
    req["total"],
    req.user.email
  );
  res.result(newTicket);*/}


