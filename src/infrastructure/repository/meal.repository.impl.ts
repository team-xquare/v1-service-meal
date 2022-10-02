import { MealRepository } from "./meal.repository";
import { Meal, MealWithDate } from "@src/meal/domain/meal";
import { InjectRepository } from "@nestjs/typeorm";
import { MealEntity } from "@src/infrastructure/repository/entity/meal.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MealRepositoryImpl implements MealRepository {
    constructor(
        @InjectRepository(MealEntity)
        private readonly mealRepository: Repository<MealEntity>
    ) {}

    public async findMealByDate(date: Date): Promise<Meal> {
        const mealEntities: MealEntity[] = await this.mealRepository.find({
            where: { date: date.toString() },
            order: { type: "asc" }
        });

        return new Meal().setBreakfast(mealEntities[0]?.meal).setLunch(mealEntities[1]?.meal).setDinner(mealEntities[2]?.meal).build();
    }

    async saveMeal(meal: Meal, date: Date): Promise<void> {
        const breakfastPromise =
            meal.breakfast && this.mealRepository.save({ date: date.toString(), meal: meal.breakfast.join("||"), type: 0 });
        const lunchPromise = meal.lunch && this.mealRepository.save({ date: date.toString(), meal: meal.lunch.join("||"), type: 1 });
        const dinnerPromise = meal.dinner && this.mealRepository.save({ date: date.toString(), meal: meal.dinner.join("||"), type: 2 });

        await breakfastPromise;
        await lunchPromise;
        await dinnerPromise;
    }

    async findMealByDateBetween(starDate: Date, endDate: Date): Promise<MealWithDate[]> {
        const meals = await this.mealRepository.query(
            `
            select date,
                   max(case when (type = 0) then meal end) breakfast,
                   max(case when (type = 1) then meal end) lunch,
                   max(case when (type = 2) then meal end) dinner
              from meal
             where date between ? and ?
             group by date;
        `,
            [starDate, endDate]
        );

        return meals.map(meal => ({
            date: meal.date.toString(),
            ...new Meal().setBreakfast(meal.breakfast).setLunch(meal.lunch).setDinner(meal.dinner).build()
        }));
    }
}
