import { GetMonthlyMealResponse } from "@src/meal/application/dto/get-monthly-meal.response";
import { GetDailyMealResponse } from "@src/meal/application/dto/get-daily-meal.response";

export interface MealService {
    getDailyMeal(date: Date): Promise<GetDailyMealResponse>;

    getMonthlyMeal(year: number, month: number): Promise<GetMonthlyMealResponse>;
}

export const MealServiceToken = "MealService";
