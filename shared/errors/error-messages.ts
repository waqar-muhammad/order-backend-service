import { ErrorCode } from "./error-codes";

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.STUDENT_NOT_FOUND]: "Student not found",
  [ErrorCode.PARENT_NOT_FOUND]: "Parent not found",
  [ErrorCode.MENU_ITEM_NOT_FOUND]: "Menu item not found",
  [ErrorCode.ITEM_UNAVAILABLE]: "Menu item is unavailable",
  [ErrorCode.ALLERGEN_CONFLICT]: "Student has allergen restriction",
  [ErrorCode.INSUFFICIENT_BALANCE]: "Insufficient wallet balance",
};