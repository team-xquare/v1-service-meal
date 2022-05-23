export class Meal {
    constructor(breakfast?: string, lunch?: string, dinner?: string) {
        this.breakfast = breakfast ? breakfast.split("||") : [];
        this.lunch = lunch ? lunch.split("||") : [];
        this.dinner = dinner ? dinner.split("||") : [];
    }

    breakfast: string[];
    lunch: string[];
    dinner: string[];
}
