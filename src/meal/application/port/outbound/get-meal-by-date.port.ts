import { Meal } from "@src/meal/domain/meal";

export interface GetMealByDatePort {
    getMealByDate(date: Date): Promise<Meal>;
}

export const GetMealByDatePortToken = "GetMealByDatePort";
