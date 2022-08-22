import { Meal } from "@src/meal/domain/meal";

export interface MealProvider {
    getMealByDate(date: Date): Promise<Meal>;
    existsByDate(date: Date): Promise<boolean>;
}

export const MealProviderToken = "MealProvider";
