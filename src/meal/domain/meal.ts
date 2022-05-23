export class Meal {
    constructor(breakfast?: string, lunch?: string, dinner?: string) {
        this.breakfast = breakfast ? breakfast.split("||") : [];
        this.lunch = lunch ? lunch.split("||") : [];
        this.dinner = dinner ? dinner.split("||") : [];
    }

    private breakfast: string[];
    private lunch: string[];
    private dinner: string[];
}
