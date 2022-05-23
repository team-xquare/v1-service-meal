import { Meal } from "@src/meal/domain/meal";

export interface GetDailyMealUseCase {
    getDailyMeal(date: Date): Promise<Meal>;
}

export const GetDailyMealUseCaseToken = "GetDailyMealUseCase";
