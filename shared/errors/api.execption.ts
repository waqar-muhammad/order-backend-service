import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCode } from "./error-codes";
import { ErrorMessages } from "./error-messages";

export class ApiException extends HttpException {
  constructor(
    code: ErrorCode,
    message?: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        code,
        message: message || ErrorMessages[code],
      },
      status,
    );
  }
}