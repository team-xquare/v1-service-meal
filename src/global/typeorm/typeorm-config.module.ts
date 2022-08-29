import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MealEntity } from "@src/infrastructure/repository/entity/meal.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.DATABASE_HOST,
            port: +process.env.DATABASE_PORT,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
            logging: false,
            entities: [MealEntity]
        })
    ]
})
export class TypeOrmConfigModule {}
