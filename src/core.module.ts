import { Module } from "@nestjs/common";
import { TypeOrmConfigModule } from "@src/global/typeorm/typeorm-config.module";
import { MealModule } from "@src/meal/meal.module";
import { NeisApiModule } from "@src/global/neis-api/neis-api.module";

@Module({
    imports: [TypeOrmConfigModule, NeisApiModule, MealModule]
})
export class CoreModule {}
