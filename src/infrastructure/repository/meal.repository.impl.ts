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

        const meals = new Meal();

        mealEntities.map(meal => {
            switch (meal.type) {
                case 0:
                    meals.setBreakfast(meal.meal);
                    break;
                case 1:
                    meals.setLunch(meal.meal);
                    break;
                case 2:
                    meals.setDinner(meal.meal);
                    break;
            }
        });

        return meals.build();
    }

    async saveMeal(meal: Meal, date: Date): Promise<void> {
        const breakfastPromise =
            meal.breakfast && (await this.mealRepository.save(await this.entity(date, meal.breakfast, meal.breakfast_kcal, 0)));
        const lunchPromise = meal.lunch && (await this.mealRepository.save(await this.entity(date, meal.lunch, meal.lunch_kcal, 1)));
        const dinnerPromise = meal.dinner && (await this.mealRepository.save(await this.entity(date, meal.dinner, meal.dinner_kcal, 2)));

        await breakfastPromise;
        await lunchPromise;
        await dinnerPromise;
    }

    private async entity(date: Date, menu: string[], kcal: string, type: number): Promise<MealEntity> {
        return {
            date: date.toString(),
            meal: menu.concat(kcal).join("||"),
            type
        };
    }

    async findMealByDateBetween(starDate: Date, endDate: Date): Promise<MealWithDate[]> {
        const meals = await this.mealRepository.query(
            `
                select date, max (case when (type = 0) then meal end) breakfast, max (case when (type = 1) then meal end) lunch, max (case when (type = 2) then meal end) dinner
                from meal
                where date between ? and ?
                group by date;
            `,
            [starDate.toString(), endDate.toString()]
        );

        return meals.map(meal => ({
            date: meal.date.toString(),
            ...new Meal().setBreakfast(meal.breakfast).setLunch(meal.lunch).setDinner(meal.dinner).build()
        }));
    }
}
