import { FindMealByDatePort } from "@src/meal/application/port/outbound/find-meal-by-date.port";
import { Meal } from "@src/meal/domain/meal";
import { InjectRepository } from "@nestjs/typeorm";
import { MealTypeOrmEntity } from "@src/meal/adaptor/outbound/persistence/dms/entity/meal.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MealPersistenceAdaptor implements FindMealByDatePort {
    constructor(
        @InjectRepository(MealTypeOrmEntity)
        private readonly mealRepository: Repository<MealTypeOrmEntity>
    ) {}

    public async findMealByDate(date: Date): Promise<Meal> {
        const breakfastPromise: Promise<MealTypeOrmEntity> = this.mealRepository.findOne({
            where: { date: date.toISOString().slice(0, 10), type: 0 }
        });
        const lunchPromise: Promise<MealTypeOrmEntity> = this.mealRepository.findOne({
            where: { date: date.toISOString().slice(0, 10), type: 1 }
        });
        const dinnerPromise: Promise<MealTypeOrmEntity> = this.mealRepository.findOne({
            where: { date: date.toISOString().slice(0, 10), type: 2 }
        });

        return new Meal((await breakfastPromise)?.meal, (await lunchPromise)?.meal, (await dinnerPromise)?.meal);
    }
}
