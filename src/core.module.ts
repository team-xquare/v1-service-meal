import { Module } from "@nestjs/common";
import { TypeOrmConfigModule } from "@src/global/typeorm/typeorm-config.module";
import { MealModule } from "@src/meal/meal.module";

@Module({
    imports: [TypeOrmConfigModule, MealModule]
})
export class CoreModule {}
