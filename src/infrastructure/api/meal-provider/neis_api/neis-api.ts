import { Inject, Injectable } from "@nestjs/common";
import { NeisApiClient, SchoolInfo } from "@src/global/neis-api/neis-api.module";
import Neis from "@my-school.info/neis-api";
import { IMealInfoRow, ISchoolInfoRow } from "@my-school.info/neis-api/dist/interpaces/response";
import { Meal } from "@src/meal/domain/meal";
import { MealProvider } from "../meal-provider";
import { MealRepositoryImpl } from "@src/infrastructure/repository/meal.repository.impl";
import { MealRepository } from "@src/infrastructure/repository/meal.repository";

@Injectable()
export class NeisApi implements MealProvider {
    constructor(
        @Inject(NeisApiClient)
        private readonly neisApiClient: Neis,
        @Inject(SchoolInfo)
        private readonly schoolInfo: ISchoolInfoRow,
        @Inject(MealRepositoryImpl)
        private readonly mealRepository: MealRepository
    ) {}

    async saveMonthlyMeal() {
        const currentDate = new Date();
        const lastDateOfMonth = this.getLastDateOfMonth(currentDate.getFullYear(), currentDate.getMonth());
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        for (let i = 1; i <= lastDateOfMonth; i++) {
            firstDayOfMonth.setDate(i);
            const rows: IMealInfoRow[] = await this.getNeisMealInfo(firstDayOfMonth);

            if (rows == undefined) {
                continue;
            }

            const meal: Meal = new Meal();

            rows.forEach((row: IMealInfoRow) => {
                const type: number = +row.MMEAL_SC_CODE;
                const menu: string = this.replaceMenu(row);
                this.setMealType(meal, type, menu);
            });

            await this.mealRepository.saveMeal(meal, firstDayOfMonth);
        }
    }

    replaceMenu(row: IMealInfoRow): string {
        /*
         * neis 데이터셋의 급식 code 아침: 1, 점심: 2, 저녁: 3
         * 잡곡밥5.<br\>들깨수제비국5.6.9.13.<br\>깻잎&쌈무와 같은 형식을
         * 잡곡밥||들깨수제비국||깻잎&쌈무로 바꿉니다
         */
        return row.DDISH_NM.replace(/(\d{1,5}\.)+/g, "")
            .replace(/\(\)/g, "")
            .replace(/\s/g, "")
            .replace(/\./g, "")
            .replace(/\(\d+\)/g, "")
            .split("<br/>")
            .concat(row.CAL_INFO)
            .join("||");
    }

    getLastDateOfMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    setMealType(meal: Meal, type: number, menu: string) {
        switch (type) {
            case 1:
                meal.setBreakfast(menu);
                break;
            case 2:
                meal.setLunch(menu);
                break;
            case 3:
                meal.setDinner(menu);
                break;
        }
    }

    async getNeisMealInfo(date: Date): Promise<IMealInfoRow[] | undefined> {
        try {
            return await this.neisApiClient.getMealInfo({
                ATPT_OFCDC_SC_CODE: this.schoolInfo.ATPT_OFCDC_SC_CODE,
                SD_SCHUL_CODE: this.schoolInfo.SD_SCHUL_CODE,
                MLSV_YMD: date.toString().replace(/-/g, "")
            });
        } catch (e) {
            return undefined;
        }
    }

    async getMealByDate(date: Date): Promise<Meal> {
        const rows: IMealInfoRow[] = await this.getNeisMealInfo(date);

        const meal: Meal = new Meal();

        rows.forEach((row: IMealInfoRow) => {
            const type: number = +row.MMEAL_SC_CODE;
            const menu: string = this.replaceMenu(row);
            this.setMealType(meal, type, menu);
        });

        return meal;
    }

    async existsByDate(date: Date): Promise<boolean> {
        return (await this.getNeisMealInfo(date)) != undefined;
    }
}
