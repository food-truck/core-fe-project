import {describe, test, expect} from "vitest";
import {Interval} from "../../src";

describe("Interval decorator", () => {
    test("should assign tickInterval to onTick method", () => {
        class Person {
            @Interval(10)
            async onTick() {}

            // @ts-expect-error
            @Interval(123)
            getSomeValue() {}
        }
        // @ts-ignore
        expect(new Person().onTick.tickInterval).toBe(10);
    });

    test("should not able to re-assign tickInterval to onTick method", () => {
        class Person {
            @Interval(10)
            async onTick() {}
        }
        expect(() => {
            const person = new Person();
            // @ts-ignore
            person.onTick.tickInterval = 20;
        }).toThrow();
    });
});
