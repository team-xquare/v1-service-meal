import { Meal } from "@src/meal/domain/meal";
import { FindMealByDatePort } from "../outbound/find-meal-by-date.port";

export class GetDailyMealUseCase {
    constructor(private readonly findMealByDatePort: FindMealByDatePort) {}

    public async execute(date: Date): Promise<Meal> {
        return this.findMealByDatePort.findMealByDate(date);
    }
}
