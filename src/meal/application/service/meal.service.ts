import { Inject, Injectable } from "@nestjs/common";
import { GetDailyMealUseCase } from "@src/meal/application/port/inbound/get-daily-meal.usecase";
import { Meal } from "@src/meal/domain/meal";
import { FindMealByDatePort, FindMealByDatePortToken } from "@src/meal/application/port/outbound/find-meal-by-date.port";

@Injectable()
export class MealService implements GetDailyMealUseCase {
    constructor(
        @Inject(FindMealByDatePortToken)
        private readonly findMealByDatePort: FindMealByDatePort
    ) {}

    public getDailyMeal(date: Date): Promise<Meal> {
        return this.findMealByDatePort.findMealByDate(date);
    }
}
