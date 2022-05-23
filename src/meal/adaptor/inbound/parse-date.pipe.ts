import { ArgumentMetadata, PipeTransform } from "@nestjs/common/interfaces/features/pipe-transform.interface";
import { HttpErrorByCode } from "@nestjs/common/utils/http-error-by-code.util";
import { HttpStatus, Type } from "@nestjs/common";

export class ParseDatePipe implements PipeTransform<Date, Date> {
    constructor() {
        this.exceptionFactory = error => new HttpErrorByCode[HttpStatus.BAD_REQUEST](error);
    }

    transform(value: Date, metadata: ArgumentMetadata): Date {
        const isDates: boolean = value.toString() !== "Invalid Date";

        if (!isDates) {
            throw this.exceptionFactory("Validation failed (invalid string)");
        }

        return new Date(value);
    }

    private readonly exceptionFactory: (error: string) => any;
}
