import { Global, Module } from "@nestjs/common";
import Neis from "@my-school.info/neis-api";
import { ISchoolInfoRow } from "@my-school.info/neis-api/dist/interpaces/response";

export const NeisApiClient = "NeisApiClient";
export const SchoolInfo = "SchoolInfo";

@Global()
@Module({
    providers: [
        {
            provide: NeisApiClient,
            useValue: new Neis({ KEY: process.env.NEIS_API_KEY, Type: "json" })
        },
        {
            inject: [NeisApiClient],
            provide: SchoolInfo,
            useFactory: async (neisApiClient: Neis): Promise<ISchoolInfoRow> => {
                const [school] = await neisApiClient.getSchoolInfo({ SCHUL_NM: "대덕소프트웨어마이스터고등학교" });
                return school;
            }
        }
    ],
    exports: [NeisApiClient, SchoolInfo]
})
export class NeisApiModule {}
