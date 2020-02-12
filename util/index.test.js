const { sortCharacters } = require("./index");

describe("util", () => {
  describe("sortCharacters()", () => {
    it("creates the same string for objects with the same properties in a different order", () => {
      expect(sortCharacters({ foo: "foo", bar: "bar" })).toEqual(
        sortCharacters({ bar: "foo", foo: "bar" })
      );
    });

    it("creates a different strings for different objects", () => {
      expect(sortCharacters({ foo: "foo" })).not.toEqual(
        sortCharacters({ bar: "bar" })
      );
    });
  });
});
