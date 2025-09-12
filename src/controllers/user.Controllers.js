export async function registerController(req, res, next) {
  try {
  return res.status(201).json({ user: req.user });

  } catch (error) {
    next(error)
  }}
  export async function loginController(req, res, next) {
    try {
    return res.status(200).json({ user: req.user });
    } catch (error) {
      next(error)
    }
    }
export async function  currentController(req, res, next) {
  try {
    if (req.user) {
       return res.status(200).json({ user: req.user });
    }
    throw new Error("UNAUTHORIZED USER");
  } catch (error) {
    return res.status(404).json({ status: "error", message: error.message });
  } 
}

export async function logoutController(req, res, next) {
    try{
          return   res.status(200).json({ message: 'Logout exitoso' });
  
    }catch(error){
        next(error)
    }
}