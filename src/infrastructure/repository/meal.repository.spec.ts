import { Test } from "@nestjs/testing";
import { MealRepository, MealRepositoryToken } from "@src/infrastructure/repository/meal.repository";
import { Repository } from "typeorm";
import { MealEntity } from "./entity/meal.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { MealRepositoryImpl } from "./meal.repository.impl";
import { Meal } from "@src/meal/domain/meal";

class MockMealEntityRepository {}

describe.skip("MealRepository", () => {
    let mealRepository: MealRepository;
    let repository: Repository<MealEntity>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                MealRepositoryImpl,
                {
                    provide: MealRepositoryToken,
                    useExisting: MealRepositoryImpl
                },
                {
                    provide: getRepositoryToken(MealEntity),
                    useClass: MockMealEntityRepository
                }
            ]
        }).compile();

        mealRepository = moduleRef.get<MealRepository>(MealRepositoryToken);
        repository = moduleRef.get<Repository<MealEntity>>(getRepositoryToken(MealEntity));
    });

    describe("findMealByDate", () => {
        it("should return a menu", async () => {
            const breakFastData: MealEntity = new MealEntity();
            breakFastData.date = "2022-08-22";
            breakFastData.type = 1;
            breakFastData.meal = "돼지||국밥||마라탕";
            const lunchData: MealEntity = new MealEntity();
            lunchData.date = "2022-08-22";
            lunchData.type = 2;
            lunchData.meal = "안은결||국밥||마라탕";

            repository.find = jest.fn().mockReturnValue([breakFastData, lunchData, new MealEntity()]);

            expect(await mealRepository.findMealByDate(new Date("2022-08-22"))).toEqual({
                breakfast: ["돼지", "국밥", "마라탕"],
                lunch: ["안은결", "국밥", "마라탕"],
                dinner: null
            });
        });
    });

    describe("saveMeal", () => {
        it("show store a menu", async () => {
            const mealData = new Meal();
            mealData.setBreakfast("돼지||국밥||소주");
            mealData.setLunch("안은결||국밥||소주");
            mealData.setDinner("");
            const dateData = new Date("2022-08-22");

            repository.save = jest.fn();

            await mealRepository.saveMeal(mealData, dateData);
            expect(repository.save).toHaveBeenCalledTimes(3);
            expect(repository.save).toHaveBeenCalledWith({ date: dateData.toString(), meal: "돼지||국밥||소주", type: 0 });
            expect(repository.save).toHaveBeenCalledWith({ date: dateData.toString(), meal: "안은결||국밥||소주", type: 1 });
            expect(repository.save).toHaveBeenCalledWith({ date: dateData.toString(), meal: "", type: 2 });
        });
    });
});
