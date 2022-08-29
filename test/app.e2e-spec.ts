import * as request from "supertest";
import "dotenv/config";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { CoreModule } from "../src/core.module";

describe("MealController", () => {
    let app: INestApplication;

    beforeAll(async () => {
        Date.prototype.toString = function () {
            const year = this.getFullYear();
            const month = (this.getMonth() + 1).toString().padStart(2, "0");
            const date = this.getDate().toString().padStart(2, "0");

            return [year, month, date].join("-");
        };

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [CoreModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true
            })
        );
        await app.init();
    });

    describe("/meals/:date", () => {
        it("GET 200", () => {
            return request(app.getHttpServer())
                .get("/meals/2022-08-29")
                .expect(200, {
                    breakfast: ["현미밥", "김치어묵국", "감자엿장조림", "비엔나케첩볶음", "총각김치", "콘푸라이트바", "905.4 Kcal"],
                    lunch: ["차조밥", "등뼈감자탕", "도토리묵야채무침", "양파닭", "깍두기", "1130.7 Kcal"],
                    dinner: ["강황쌀밥", "소고기버섯전골", "돈육고추장조림", "양배추찜/우렁쌈장", "배추김치", "783.3 Kcal"]
                });
        });
        it("GET 404", () => {
            return request(app.getHttpServer()).get("/404").expect(404);
        });
        it("GET null", () => {
            return request(app.getHttpServer()).get("/meals/999").expect(200, { breakfast: null, lunch: null, dinner: null });
        });
    });
});
