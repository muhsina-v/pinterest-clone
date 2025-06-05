import CustomError from "../utils/customError.js";

const manageError = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }else if(err.http_code || err.name || err.message){
    return res.status(err.http_code || 500).json({message:err.message || "Something went wrong"})
  }
  console.log("from error middleware", err);
  return res.status(500).json({ message: "Something went wrong" });
};

export default manageError;