import { Meal } from "@src/meal/domain/meal";

export interface MealRepository {
    findMealByDate(date: Date): Promise<Meal>;
    saveMeal(meal: Meal, date: Date): Promise<void>;
}

export const MealRepositoryToken = "MealRepository";
