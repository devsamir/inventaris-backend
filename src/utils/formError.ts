import { ValidationError } from "class-validator";
import { Response } from "express";

const formError = (errors: ValidationError[], res: Response): void => {
  const errorObj = errors.reduce((acc: any, curr: ValidationError) => {
    acc[curr.property] = curr.constraints && curr.constraints[Object.keys(curr.constraints)[0]];
    return acc;
  }, {});
  res.status(400).json({
    status: "fail",
    message: `Input Invalid : ${errorObj[Object.keys(errorObj)[0]]}`,
  });
};

export default formError;
