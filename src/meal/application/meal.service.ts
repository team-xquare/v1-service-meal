import { Meal, MealWithDate } from "@src/meal/domain/meal";

export interface MealService {
    getDailyMeal(date: Date): Promise<Meal>;
    getMonthlyMeal(year: number, month: number): Promise<MealWithDate[]>;
}

export const MealServiceToken = "MealService";
