export class ResponseHandler {
  static success(res, message, data = {}) {
    res.status(200).json({
      success: true,
      message,
      receivedData: data,
    });
  }

  static error(res, message, statusCode = 500) {
    console.log(message);

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
