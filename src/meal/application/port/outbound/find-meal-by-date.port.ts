import { Meal } from "@src/meal/domain/meal";

export interface FindMealByDatePort {
    findMealByDate(date: Date): Promise<Meal>;
}

const key = "FindMealByDatePort";
export default key;
