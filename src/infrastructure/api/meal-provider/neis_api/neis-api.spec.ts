import "dotenv/config";
import { Test } from "@nestjs/testing";
import { NeisApiModule } from "@src/global/neis-api/neis-api.module";
import { MealProvider, MealProviderToken } from "../meal-provider";
import { NeisApi } from "./neis-api";

describe("NeisApi", () => {
    let mealProvider: MealProvider;

    beforeEach(async () => {
        Date.prototype.toString = function () {
            const year = this.getFullYear();
            const month = (this.getMonth() + 1).toString().padStart(2, "0");
            const date = this.getDate().toString().padStart(2, "0");
            return [year, month, date].join("-");
        };
        const moduleRef = await Test.createTestingModule({
            imports: [NeisApiModule],
            providers: [
                NeisApi,
                {
                    provide: MealProviderToken,
                    useExisting: NeisApi
                }
            ]
        }).compile();
        mealProvider = moduleRef.get<MealProvider>(MealProviderToken);
    });

    describe("getMealByDate", () => {
        it("should return a menu", async () => {
            expect(await mealProvider.getMealByDate(new Date("2022-08-24"))).toEqual({
                breakfast: ["토마토비타민샐러드", "치킨너겟/머스터드", "시리얼/우유", "모닝빵/딸기잼", "615.8 Kcal"],
                lunch: ["현미밥", "도토리묵채냉국", "비름나물무침", "닭감자볶음탕", "해물파전", "배추김치", "1642.1 Kcal"],
                dinner: ["기장밥", "참치김치찌개", "떡갈비조림", "시금치나물무침", "오이소박이", "야구르트라이트", "742.9 Kcal"]
            });
        });
    });

    describe("existsByDate", () => {
        it("should return true", async () => {
            expect(await mealProvider.existsByDate(new Date("2022-08-24"))).toEqual(true);
        });

        it("should return false", async () => {
            expect(await mealProvider.existsByDate(new Date("부산시여러분담배꽁초"))).toEqual(false);
        });
    });
});
