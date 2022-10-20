import { Test } from "@nestjs/testing";
import { MealProvider, MealProviderToken } from "@src/infrastructure/api/meal-provider/meal-provider";
import { MealRepository, MealRepositoryToken } from "@src/infrastructure/repository/meal.repository";
import { Meal, MealWithDate } from "../domain/meal";
import { MealService, MealServiceToken } from "./meal.service";
import { MealServiceImpl } from "./meal.service.impl";

class MockMealProvider implements MealProvider {
    public async getMealByDate(date: Date): Promise<Meal> {
        return null;
    }
    public async existsByDate(date: Date): Promise<boolean> {
        return null;
    }
}

class MockMealRepository implements MealRepository {
    public async findMealByDate(date: Date): Promise<Meal> {
        return null;
    }
    public async saveMeal(meal: Meal, date: Date): Promise<void> {
        return null;
    }

    public async findMealByDateBetween(startDate: Date, endDate: Date): Promise<MealWithDate[]> {
        return Promise.resolve([]);
    }
}

describe.skip("MealService", () => {
    let mealService: MealService;
    let mealProvider: MealProvider;
    let mealRepository: MealRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                MealServiceImpl,
                {
                    provide: MealServiceToken,
                    useExisting: MealServiceImpl
                },
                {
                    provide: MealProviderToken,
                    useClass: MockMealProvider
                },
                {
                    provide: MealRepositoryToken,
                    useClass: MockMealRepository
                }
            ]
        }).compile();

        mealService = moduleRef.get<MealService>(MealServiceToken);
        mealProvider = moduleRef.get<MealProvider>(MealProviderToken);
        mealRepository = moduleRef.get<MealRepository>(MealRepositoryToken);
    });

    describe("getDailyMeal", () => {
        it("when exist meal in database then should return a menu", async () => {
            jest.spyOn(mealRepository, "findMealByDate").mockImplementation(async (date: Date): Promise<Meal> => {
                const meal = new Meal();
                meal.setBreakfast("a||b||c||d");
                meal.setLunch("a||b||c||d");
                meal.setDinner("a||b||c||d");

                return meal;
            });

            expect(await mealService.getDailyMeal(new Date("2022-08-22"))).toEqual({
                breakfast: ["a", "b", "c", "d"],
                dinner: ["a", "b", "c", "d"],
                lunch: ["a", "b", "c", "d"]
            });
        });

        it("when doesn't exist meal in database and exist meal in neis then should save meal", async () => {
            const mealData = new Meal();
            mealData.setBreakfast("a||b||c||d");
            mealData.setLunch("a||b||c||d");
            mealData.setDinner("a||b||c||d");
            const dateData = new Date("2022-08-22");

            mealRepository.saveMeal = jest.fn();
            jest.spyOn(mealRepository, "findMealByDate").mockImplementation(async (date: Date): Promise<Meal> => {
                return new Meal();
            });
            jest.spyOn(mealProvider, "existsByDate").mockImplementation(async (date: Date): Promise<boolean> => {
                return true;
            });
            jest.spyOn(mealProvider, "getMealByDate").mockImplementation(async (date: Date): Promise<Meal> => {
                return mealData;
            });

            expect(await mealService.getDailyMeal(dateData)).toEqual({
                breakfast: ["a", "b", "c", "d"],
                dinner: ["a", "b", "c", "d"],
                lunch: ["a", "b", "c", "d"]
            });
            expect(mealRepository.saveMeal).toHaveBeenCalledWith(mealData, dateData);
        });
    });
});
