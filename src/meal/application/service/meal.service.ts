import { Meal } from "@src/meal/domain/meal";

export interface MealService {
    getDailyMeal(date: Date): Promise<Meal>;
}

export const MealServiceToken = "MealService";
