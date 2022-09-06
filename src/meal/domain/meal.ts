import { ApiProperty } from "@nestjs/swagger";

export class Meal {
    constructor() {
        this.breakfast = null;
        this.lunch = null;
        this.dinner = null;
    }
    @ApiProperty()
    breakfast: string[];
    @ApiProperty()
    lunch: string[];
    @ApiProperty()
    dinner: string[];

    setBreakfast(breakfast: string): Meal {
        this.breakfast = breakfast?.split("||") || null;
        return this;
    }

    setLunch(lunch: string): Meal {
        this.lunch = lunch?.split("||") || null;
        return this;
    }

    setDinner(dinner: string): Meal {
        this.dinner = dinner?.split("||") || null;
        return this;
    }

    build(): Meal {
        return this;
    }

    isNull(): boolean {
        return !this.breakfast && !this.lunch && !this.dinner;
    }
}
