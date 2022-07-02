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
        const mealTypeOrmEntities: MealTypeOrmEntity[] = await this.mealRepository.find({
            where: { date: date.toString() },
            order: { type: "asc" }
        });

        // mealTypeOrmEntities.length === 0 && date.getFullYear() === (new Date()).getFullYear()

        return new Meal()
            .setBreakfast(mealTypeOrmEntities[0]?.meal)
            .setLunch(mealTypeOrmEntities[1]?.meal)
            .setDinner(mealTypeOrmEntities[2]?.meal)
            .build();
    }
}
