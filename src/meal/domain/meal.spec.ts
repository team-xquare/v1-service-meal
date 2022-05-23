import { Meal } from "./meal";

describe("Meal", () => {
    it("should menu", () => {
        const menu = "a||b||c||d";
        const list = ["a", "b", "c", "d"];

        const meal = new Meal(menu, menu, menu);

        expect(meal.breakfast).toEqual(list);
    });
});
