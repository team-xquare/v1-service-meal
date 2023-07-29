import { Inject, Injectable } from "@nestjs/common";
import { MealService } from "./meal.service";
import { Meal, MealWithDate } from "@src/meal/domain/meal";
import { MealRepository, MealRepositoryToken } from "@src/infrastructure/repository/meal.repository";
import { MealProvider, MealProviderToken } from "@src/infrastructure/api/meal-provider/meal-provider";
import { GetMonthlyMealResponse } from "@src/meal/application/dto/get-monthly-meal.response";
import { GetDailyMealResponse } from "@src/meal/application/dto/get-daily-meal.response";

@Injectable()
export class MealServiceImpl implements MealService {
    constructor(
        @Inject(MealProviderToken)
        private readonly mealProvider: MealProvider,

        @Inject(MealRepositoryToken)
        private readonly mealRepository: MealRepository
    ) {}

    public async getDailyMeal(date: Date): Promise<GetDailyMealResponse> {
        let meal: Meal = await this.mealRepository.findMealByDate(date);

        if (meal.isNull() && (await this.mealProvider.existsByDate(date))) {
            meal = await (async () => {
                const meal = await this.mealProvider.getMealByDate(date);
                await this.mealRepository.saveMeal(meal, date);
                return meal;
            })();
        }

        return { ...meal, date: date.toString() };
    }

    public getMonthlyMeal(year: number, month: number): Promise<GetMonthlyMealResponse> {
        return this.mealRepository.findMealByDateBetween(new Date(year, month - 1, 1), new Date(year, month, 0)).then(meals => ({ meals }));
    }
}
