import { Inject, Injectable } from "@nestjs/common";
import { MealService } from "./meal.service";
import { Meal } from "@src/meal/domain/meal";
import { MealRepository, MealRepositoryToken } from "@src/infrastructure/repository/meal.repository";
import { MealProvider, MealProviderToken } from "@src/infrastructure/api/meal-provider/meal-provider";

@Injectable()
export class MealServiceImpl implements MealService {
    constructor(
        @Inject(MealProviderToken)
        private readonly mealProvider: MealProvider,

        @Inject(MealRepositoryToken)
        private readonly mealRepository: MealRepository
    ) {}

    public async getDailyMeal(date: Date): Promise<Meal> {
        let meal: Meal = await this.mealRepository.findMealByDate(date);

        if (meal.isNull() && (await this.mealProvider.existsByDate(date))) {
            meal = await (async () => {
                const meal = await this.mealProvider.getMealByDate(date);
                await this.mealRepository.saveMeal(meal, date);
                return meal;
            })();
        }

        return meal;
    }
}
