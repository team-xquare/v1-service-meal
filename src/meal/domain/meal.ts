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
    breakfast_kcal: string;

    @ApiProperty()
    lunch: string[];

    @ApiProperty()
    lunch_kcal: string;

    @ApiProperty()
    dinner: string[];

    @ApiProperty()
    dinner_kcal: string;

    setBreakfast(breakfast: string): Meal {
        if(!breakfast) return this;

        const menu: string[] = breakfast?.split("||");
        this.breakfast_kcal = menu.pop();
        this.breakfast = menu;
        return this;
    }

    setLunch(lunch: string): Meal {
        if(!lunch) return this;

        const menu: string[] = lunch?.split("||");
        this.lunch_kcal  = menu.pop();
        this.lunch = menu;
        return this;
    }

    setDinner(dinner: string): Meal {
        if(!dinner) return this;

        const menu: string[] = dinner?.split("||");
        this.dinner_kcal = menu.pop();
        this.dinner = menu;
        return this;
    }

    build(): Meal {
        return this;
    }

    isNull(): boolean {
        return !this.breakfast && !this.lunch && !this.dinner;
    }
}

export type MealWithDate = Meal & { date: string };
