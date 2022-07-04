import { Module } from "@nestjs/common";
import { MealController } from "./adaptor/inbound/meal.controller";
import { MealPersistenceAdaptor } from "@src/meal/adaptor/outbound/persistence/dms/meal-persistence.adaptor";
import { MealService } from "@src/meal/application/service/meal.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MealTypeOrmEntity } from "@src/meal/adaptor/outbound/persistence/dms/entity/meal.entity";
import { FindMealByDatePortToken } from "@src/meal/application/port/outbound/find-meal-by-date.port";
import { GetDailyMealUseCaseToken } from "@src/meal/application/port/inbound/get-daily-meal.usecase";
import { NeisApiAdaptor } from "@src/meal/adaptor/outbound/api/neis/neis-api.adaptor";
import { GetMealByDatePortToken } from "@src/meal/application/port/outbound/get-meal-by-date.port";
import { ExistsByDatePortToken } from "@src/meal/application/port/outbound/exists-by-date.port";
import { SaveMealPortToken } from "@src/meal/application/port/outbound/save-meal.port";

@Module({
    imports: [TypeOrmModule.forFeature([MealTypeOrmEntity])],
    controllers: [MealController],
    providers: [
        MealPersistenceAdaptor,
        MealService,
        NeisApiAdaptor,
        {
            provide: FindMealByDatePortToken,
            useExisting: MealPersistenceAdaptor
        },
        {
            provide: SaveMealPortToken,
            useExisting: MealPersistenceAdaptor
        },
        {
            provide: GetDailyMealUseCaseToken,
            useExisting: MealService
        },
        {
            provide: GetMealByDatePortToken,
            useExisting: NeisApiAdaptor
        },
        {
            provide: ExistsByDatePortToken,
            useExisting: NeisApiAdaptor
        }
    ]
})
export class MealModule {}
