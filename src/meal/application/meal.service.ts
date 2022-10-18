import { Meal } from "@src/meal/domain/meal";
import { GetMonthlyMealResponse } from "@src/meal/application/dto/get-monthly-meal.response";

export interface MealService {
    getDailyMeal(date: Date): Promise<Meal>;
    getMonthlyMeal(year: number, month: number): Promise<GetMonthlyMealResponse>;
}

export const MealServiceToken = "MealService";
