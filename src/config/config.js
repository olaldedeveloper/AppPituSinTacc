import "dotenv/config";

export const PORT = process.env.PORT || 8080;


//JASON WEB TOKEN
export const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; 

//MONGO DATA BASE
export const URL_MONGO_ATLAS = process.env.URL_MONGO_ATLAS || 'mongodb+srv://jpola';