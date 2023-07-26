import { Controller, Get, Inject, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Meal } from "@src/meal/domain/meal";
import { MealService, MealServiceToken } from "../application/meal.service";
import { ParseDatePipe } from "./parse-date.pipe";
import { GetDailyMealResponse } from "@src/meal/application/dto/get-daily-meal.response";

@ApiTags("meals")
@Controller("meals")
export class MealController {
    constructor(
        @Inject(MealServiceToken)
        private readonly mealService: MealService
    ) {}

    @Get("/:date")
    @ApiParam({
        name: "date",
        type: String,
        required: true,
        example: "2022-03-09"
    })
    @ApiResponse({
        status: 200,
        description: "Get meal of specific date",
        type: Meal
    })
    public get(@Param("date", new ParseDatePipe()) date: Date): Promise<GetDailyMealResponse> {
        return this.mealService.getDailyMeal(date);
    }

    @Get()
    public getMonthly(@Query("year", new ParseIntPipe()) year: number, @Query("month", new ParseIntPipe()) month: number) {
        return this.mealService.getMonthlyMeal(year, month);
    }
}
