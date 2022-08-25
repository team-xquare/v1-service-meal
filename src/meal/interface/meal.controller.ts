import { Controller, Get, Inject, Param } from "@nestjs/common";
import { Meal } from "@src/meal/domain/meal";
import { MealService, MealServiceToken } from "../application/meal.service";
import { ParseDatePipe } from "./parse-date.pipe";

@Controller("meals")
export class MealController {
    constructor(
        @Inject(MealServiceToken)
        private readonly mealService: MealService
    ) {}

    @Get("/:date")
    public get(@Param("date", new ParseDatePipe()) date: Date): Promise<Meal> {
        return this.mealService.getDailyMeal(date);
    }
}
