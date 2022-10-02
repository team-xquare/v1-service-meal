import { Inject, Injectable } from "@nestjs/common";
import { NeisApiClient, SchoolInfo } from "@src/global/neis-api/neis-api.module";
import Neis from "@my-school.info/neis-api";
import { IMealInfoRow, ISchoolInfoRow } from "@my-school.info/neis-api/dist/interpaces/response";
import { Meal } from "@src/meal/domain/meal";
import { MealProvider } from "../meal-provider";

@Injectable()
export class NeisApi implements MealProvider {
    constructor(
        @Inject(NeisApiClient)
        private readonly neisApiClient: Neis,

        @Inject(SchoolInfo)
        private readonly schoolInfo: ISchoolInfoRow
    ) {}

    async getMealByDate(date: Date): Promise<Meal> {
        const rows: IMealInfoRow[] = await this.neisApiClient.getMealInfo({
            ATPT_OFCDC_SC_CODE: this.schoolInfo.ATPT_OFCDC_SC_CODE,
            SD_SCHUL_CODE: this.schoolInfo.SD_SCHUL_CODE,
            MLSV_YMD: date.toString().replace(/-/g, "")
        });

        const meal: Meal = new Meal();

        rows.forEach((row: IMealInfoRow) => {
            /**
             * neis 데이터셋의 급식 code 아침: 1, 점심: 2, 저녁: 3
             */
            const type: number = +row.MMEAL_SC_CODE;

            /**
             * 잡곡밥5.<br\>들깨수제비국5.6.9.13.<br\>깻잎&쌈무와 같은 형식을
             * 잡곡밥||들깨수제비국||깻잎&쌈무로 바꿉니다
             */
            const menu: string = row.DDISH_NM.replace(/([0-9]{1,5}\.)+/g, "")
                .replace(/\(\)/g, "")
                .replace(/\s/g, "")
                .replace(/\./g, "")
                .split("<br/>")
                .concat(row.CAL_INFO)
                .join("||");

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
        });

        return meal;
    }

    async existsByDate(date: Date): Promise<boolean> {
        try {
            await this.neisApiClient.getMealInfo({
                ATPT_OFCDC_SC_CODE: this.schoolInfo.ATPT_OFCDC_SC_CODE,
                SD_SCHUL_CODE: this.schoolInfo.SD_SCHUL_CODE,
                MLSV_YMD: date.toString().replace(/-/g, "")
            });
            return true;
        } catch (e) {
            return false;
        }
    }
}
