import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
    constructor(
        message: string = "You don't have permission to access on this content."
    ) {
        super(403, message)
    }
}