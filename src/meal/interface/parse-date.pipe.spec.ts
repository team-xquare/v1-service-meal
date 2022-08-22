import { ArgumentMetadata } from "@nestjs/common/interfaces/features/pipe-transform.interface";
import { ParseDatePipe } from "./parse-date.pipe";

describe("ParseDatePipe", () => {
    let parsePipe: ParseDatePipe;

    beforeEach(async () => {
        parsePipe = new ParseDatePipe();
    });

    describe("transform", () => {
        it("should return a Date", async () => {
            const expected = new Date("2022-08-22")
            const metadata: ArgumentMetadata = {
                type: "param",
                metatype: Date,
                data: "2022-08-22"
            };

            expect(parsePipe.transform(new Date("2022-08-22"), metadata)).toEqual(expected);
        });

        it("should throw a 400 error", async () => {
            const expected = "Validation failed (invalid string)";
            const metadata: ArgumentMetadata = {
                type: "param",
                metatype: Date,
                data: "invalid date"
            };

            try {
                parsePipe.transform(new Date("invalid date"), metadata);
            } catch (err) {
                expect(err.getResponse().message).toEqual(expected);
            }
        });
    });
});
