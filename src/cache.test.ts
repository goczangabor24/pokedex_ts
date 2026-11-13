import { afterEach, describe, expect, test } from "vitest";
import { Cache } from "./cache.js";

describe("Cache", () => {
    const caches: Cache[] = [];

    function newCache(interval: number): Cache {
        const cache = new Cache(interval);
        caches.push(cache);
        return cache;
    }

    afterEach(() => {
        while (caches.length > 0) {
            caches.pop()!.stopReapLoop();
        }
    });

    test("fresh entries stay available", () => {
        const cache = newCache(1000);
        cache.add("hello", "world");

        expect(cache.get<string>("hello")).toBe("world");
    });

    test("old entries are eventually removed", async () => {
        const cache = newCache(20);
        cache.add("hello", "world");

        await new Promise((resolve) => setTimeout(resolve, 60));

        expect(cache.get<string>("hello")).toBeUndefined();
    });
});
