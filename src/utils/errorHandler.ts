import { NextFunction, Response, Request } from "express";

const duplicateInput = (err: any, res: Response) => {
  const key = err.message.split(" key ")[1].replace(/['"]+/g, "");
  let message = `duplikasi data, sudah ada data ${key} yang sama didatabase`;
  const status = err.status || "error";

  return res.status(400).json({
    status,
    message: `400 : ${message}`,
  });
};

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  let message = err.message || "internal server error";
  const statusCode = err.statusCode || "500";
  const status = err.status || "error";

  if (err.errno === 1062 || err.code === "ER_DUP_ENTRY")
    return duplicateInput(err, res);

  return res.status(statusCode).json({
    status,
    message: `${statusCode} : ${message}`,
    err,
  });
}
