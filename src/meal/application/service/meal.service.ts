import { Inject, Injectable } from "@nestjs/common";
import { GetDailyMealUseCase } from "@src/meal/application/port/inbound/get-daily-meal.usecase";
import { Meal } from "@src/meal/domain/meal";
import { FindMealByDatePort, FindMealByDatePortToken } from "@src/meal/application/port/outbound/find-meal-by-date.port";
import { ExistsByDatePort, ExistsByDatePortToken } from "@src/meal/application/port/outbound/exists-by-date.port";
import { GetMealByDatePort, GetMealByDatePortToken } from "@src/meal/application/port/outbound/get-meal-by-date.port";
import { SaveMealPort, SaveMealPortToken } from "@src/meal/application/port/outbound/save-meal.port";

@Injectable()
export class MealService implements GetDailyMealUseCase {
    constructor(
        @Inject(FindMealByDatePortToken)
        private readonly findMealByDatePort: FindMealByDatePort,

        @Inject(ExistsByDatePortToken)
        private readonly existsByDatePort: ExistsByDatePort,

        @Inject(GetMealByDatePortToken)
        private readonly getMealByDatePort: GetMealByDatePort,

        @Inject(SaveMealPortToken)
        private readonly saveMealPort: SaveMealPort
    ) {}

    public async getDailyMeal(date: Date): Promise<Meal> {
        const meal: Meal = await this.findMealByDatePort.findMealByDate(date);

        if (meal.isNull() && (await this.existsByDatePort.existsByDate(date))) {
            (async () => {
                const meal = await this.getMealByDatePort.getMealByDate(date);
                await this.saveMealPort.saveMeal(meal, date);
                return `${date.toString()}: 급식저장완료`;
            })()
                .then(console.log)
                .catch(console.error);
        }

        return meal;
    }
}
