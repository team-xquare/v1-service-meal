import { MealRepository } from "./meal.repository";
import { Meal } from "@src/meal/domain/meal";
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
        const mealTypeOrmEntities: MealEntity[] = await this.mealRepository.find({
            where: { date: date.toString() },
            order: { type: "asc" }
        });

        return new Meal()
            .setBreakfast(mealTypeOrmEntities[0]?.meal)
            .setLunch(mealTypeOrmEntities[1]?.meal)
            .setDinner(mealTypeOrmEntities[2]?.meal)
            .build();
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
}
