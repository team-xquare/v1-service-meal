import { Controller, Get, Param } from "@nestjs/common";
import { GetDailyMealUseCase } from "@src/meal/application/port/inbound/get-daily-meal.usecase";
import { Meal } from "@src/meal/domain/meal";
import { ParseDatePipe } from "./parse-date.pipe";

@Controller("meal")
export class MealController {
    constructor(private readonly getDailyMealUseCase: GetDailyMealUseCase) {}

    @Get("/:date")
    public get(@Param("date", new ParseDatePipe()) date: Date): Promise<Meal> {
        return this.getDailyMealUseCase.execute(date);
    }
}
