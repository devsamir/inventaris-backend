export default class AppError extends Error {
  public statusCode: number;
  public message: string;
  public status: string;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = "error";
  }
}
