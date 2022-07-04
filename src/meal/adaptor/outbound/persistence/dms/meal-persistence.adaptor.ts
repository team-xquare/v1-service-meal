import { FindMealByDatePort } from "@src/meal/application/port/outbound/find-meal-by-date.port";
import { Meal } from "@src/meal/domain/meal";
import { InjectRepository } from "@nestjs/typeorm";
import { MealTypeOrmEntity } from "@src/meal/adaptor/outbound/persistence/dms/entity/meal.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { SaveMealPort } from "@src/meal/application/port/outbound/save-meal.port";

@Injectable()
export class MealPersistenceAdaptor implements FindMealByDatePort, SaveMealPort {
    constructor(
        @InjectRepository(MealTypeOrmEntity)
        private readonly mealRepository: Repository<MealTypeOrmEntity>
    ) {}

    public async findMealByDate(date: Date): Promise<Meal> {
        const mealTypeOrmEntities: MealTypeOrmEntity[] = await this.mealRepository.find({
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
