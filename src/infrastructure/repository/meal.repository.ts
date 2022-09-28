import { Meal, MealWithDate } from "@src/meal/domain/meal";

export interface MealRepository {
    findMealByDate(date: Date): Promise<Meal>;
    findMealByDateBetween(startDate: Date, endDate: Date): Promise<MealWithDate[]>;
    saveMeal(meal: Meal, date: Date): Promise<void>;
}

export const MealRepositoryToken = "MealRepository";
