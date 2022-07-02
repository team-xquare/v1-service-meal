export class Meal {
    constructor() {
        this.breakfast = null;
        this.lunch = null;
        this.dinner = null;
    }

    private breakfast: string[];
    private lunch: string[];
    private dinner: string[];

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
}
