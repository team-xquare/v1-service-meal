import { Module } from "@nestjs/common";
import { MealController } from "./interface/meal.controller";
import { MealServiceImpl } from "@src/meal/application/meal.service.impl";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MealEntity } from "@src/infrastructure/repository/entity/meal.entity";
import { NeisApi } from "@src/infrastructure/api/meal-provider/neis_api/neis-api";
import { MealServiceToken } from "./application/service/meal.service";
import { MealProviderToken } from "@src/infrastructure/api/meal-provider/meal-provider";
import { MealRepositoryToken } from "@src/infrastructure/repository/meal.repository";
import { MealRepositoryImpl } from "@src/infrastructure/repository/meal.repository.impl";

@Module({
    imports: [TypeOrmModule.forFeature([MealEntity])],
    controllers: [MealController],
    providers: [
        MealRepositoryImpl,
        MealServiceImpl,
        NeisApi,
        {
            provide: MealRepositoryToken,
            useExisting: MealRepositoryImpl
        },
        {
            provide: MealServiceToken,
            useExisting: MealServiceImpl
        },
        {
            provide: MealProviderToken,
            useExisting: NeisApi
        }
    ]
})
export class MealModule {}
