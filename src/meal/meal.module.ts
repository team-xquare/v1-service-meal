import { Module } from "@nestjs/common";
import { MealController } from "./adaptor/inbound/meal.controller";
import { MealPersistenceAdaptor } from "@src/meal/adaptor/outbound/persistence/dms/meal-persistence.adaptor";
import { MealService } from "@src/meal/application/service/meal.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MealTypeOrmEntity } from "@src/meal/adaptor/outbound/persistence/dms/entity/meal.entity";
import { FindMealByDatePortToken } from "@src/meal/application/port/outbound/find-meal-by-date.port";
import { GetDailyMealUseCaseToken } from "@src/meal/application/port/inbound/get-daily-meal.usecase";

@Module({
    imports: [TypeOrmModule.forFeature([MealTypeOrmEntity])],
    controllers: [MealController],
    providers: [
        MealPersistenceAdaptor,
        MealService,
        {
            provide: FindMealByDatePortToken,
            useClass: MealPersistenceAdaptor
        },
        {
            provide: GetDailyMealUseCaseToken,
            useClass: MealService
        }
    ]
})
export class MealModule {}
