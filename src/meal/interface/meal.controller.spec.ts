import { Meal } from "../domain/meal";
import { MealController } from "./meal.controller";
import { MealService, MealServiceToken } from "../application/service/meal.service";
import { Test } from "@nestjs/testing";

class MockMealService implements MealService {
    public async getDailyMeal(date: Date): Promise<Meal> {
        return null;
    }
}

describe("MealController", () => {
    let mealController: MealController;
    let mealService: MealService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [MealController],
            providers: [
                {
                    provide: MealServiceToken,
                    useClass: MockMealService
                }
            ]
        }).compile();

        mealService = moduleRef.get<MealService>(MealServiceToken);
        mealController = moduleRef.get<MealController>(MealController);
    });

    describe("get", () => {
        it("should return a menu", async () => {
            jest.spyOn(mealService, "getDailyMeal").mockImplementation(async (date: Date): Promise<Meal> => {
                const meal = new Meal();
                meal.setBreakfast("a||b||c||d");
                meal.setLunch("a||b||c||d");
                meal.setDinner("a||b||c||d");

                return meal;
            });

            expect(await mealController.get(new Date("2022-08-22"))).toEqual({
                breakfast: ["a", "b", "c", "d"],
                dinner: ["a", "b", "c", "d"],
                lunch: ["a", "b", "c", "d"]
            });
        });
    });
});
