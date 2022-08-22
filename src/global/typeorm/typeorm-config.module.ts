import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

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
            entities: ["dist/**/infrastructure/repository/entity/**/*.entity{.ts,.js}"]
        })
    ]
})
export class TypeOrmConfigModule {}
