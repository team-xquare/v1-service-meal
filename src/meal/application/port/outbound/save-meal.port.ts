import { Meal } from "@src/meal/domain/meal";

export interface SaveMealPort {
    saveMeal(meal: Meal, date: Date): Promise<void>;
}

export const SaveMealPortToken = "SaveMealPort";
