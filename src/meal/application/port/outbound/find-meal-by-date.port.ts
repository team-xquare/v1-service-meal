import { Meal } from "@src/meal/domain/meal";

export interface FindMealByDatePort {
    findMealByDate(date: Date): Promise<Meal>;
}

export const FindMealByDatePortToken = "FindMealByDatePort";
