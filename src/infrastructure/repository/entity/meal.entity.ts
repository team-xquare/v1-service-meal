import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("meal")
export class MealEntity {
    @PrimaryColumn("date")
    date: string;

    @PrimaryColumn("int")
    type: number;

    @Column({ type: "varchar", length: 300 })
    meal: string;
}
