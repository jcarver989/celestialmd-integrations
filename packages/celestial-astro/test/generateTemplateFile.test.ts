import { describe, it, expect } from "vitest";
import { generateTemplateFile } from "../src/generateTemplateFile.js";

describe("generateTemplateFile", () => {
  describe("path resolution", () => {
    it("should generate correct relative import path for same directory", () => {
      const result = generateTemplateFile(
        "/project/page.astro",
        "/project/Component.astro",
        {}
      );

      expect(result).toContain('import Component from "./Component.astro";');
    });

    it("should generate correct relative import path for parent directory", () => {
      const result = generateTemplateFile(
        "/project/pages/index.astro",
        "/project/Layout.astro",
        {}
      );

      expect(result).toContain('import Component from "../Layout.astro";');
    });

    it("should generate correct relative import path for nested directories", () => {
      const result = generateTemplateFile(
        "/project/deep/nested/page.astro",
        "/project/components/ui/Button.astro",
        {}
      );

      expect(result).toContain(
        'import Component from "../../components/ui/Button.astro";'
      );
    });
  });

  describe("template structure", () => {
    it("should generate complete template with correct structure", () => {
      const result = generateTemplateFile(
        "/project/page.astro",
        "/project/Component.astro",
        { title: "Test" }
      );

      expect(result).toContain("---");
      expect(result).toContain('import Component from "./Component.astro";');
      expect(result).toContain('<Component title="Test">');
      expect(result).toContain('<div id="slot"></div>');
      expect(result).toContain("</Component>");
    });

    it("should generate template with no props when empty object provided", () => {
      const result = generateTemplateFile(
        "/project/page.astro",
        "/project/Component.astro",
        {}
      );

      expect(result).toContain("<Component >");
    });
  });

  describe("prop string generation - basic types", () => {
    it("should handle string values with quote escaping", () => {
      const result = generateTemplateFile(
        "/project/page.astro",
        "/project/Component.astro",
        { message: 'Say "Hello"', empty: "" }
      );
      expect(result).toContain('message="Say \\"Hello\\""');
      expect(result).toContain('empty=""');
    });

    it("should handle numeric values", () => {
      const result = generateTemplateFile(
        "/project/page.astro",
        "/project/Component.astro",
        { count: 42, price: 19.99, zero: 0 }
      );
      expect(result).toContain("count={42}");
      expect(result).toContain("price={19.99}");
      expect(result).toContain("zero={0}");
    });

    it("should handle boolean and null values", () => {
      const result = generateTemplateFile(
        "/project/page.astro",
        "/project/Component.astro",
        {
          visible: true,
          hidden: false,
          nullable: null,
          undefinedValue: undefined,
        }
      );
      expect(result).toContain("visible={true}");
      expect(result).toContain("hidden={false}");
      expect(result).toContain("nullable={null}");
      expect(result).toContain("undefinedValue={undefined}");
    });
  });

  describe("prop string generation - complex types", () => {
    it("should convert Date to new Date constructor string", () => {
      const date = new Date("2023-12-25T10:30:00.000Z");
      const result = generateTemplateFile(
        "/project/page.astro",
        "/project/Component.astro",
        { created: date }
      );
      expect(result).toContain(
        'created={new Date("2023-12-25T10:30:00.000Z")}'
      );
    });

    it("should convert objects and arrays to JSON", () => {
      const result = generateTemplateFile(
        "/project/page.astro",
        "/project/Component.astro",
        {
          config: { theme: "dark" },
          items: [1, 2, 3],
          nested: { user: { name: "John" } },
        }
      );
      expect(result).toContain('config={{"theme":"dark"}}');
      expect(result).toContain("items={[1,2,3]}");
      expect(result).toContain('nested={{"user":{"name":"John"}}}');
    });

    it("should handle comprehensive mixed types", () => {
      const complexObject = {
        name: "test",
        age: 25,
        active: true,
        created: new Date("2023-01-01T00:00:00.000Z"),
        config: { theme: "dark" },
        tags: ["javascript", "typescript"],
        nullable: null,
        undefinedValue: undefined,
      };

      const result = generateTemplateFile(
        "/project/page.astro",
        "/project/Component.astro",
        complexObject
      );

      expect(result).toContain('name="test"');
      expect(result).toContain("age={25}");
      expect(result).toContain("active={true}");
      expect(result).toContain(
        'created={new Date("2023-01-01T00:00:00.000Z")}'
      );
      expect(result).toContain('config={{"theme":"dark"}}');
      expect(result).toContain('tags={["javascript","typescript"]}');
      expect(result).toContain("nullable={null}");
      expect(result).toContain("undefinedValue={undefined}");
    });
  });

  describe("edge cases", () => {
    it("should handle invalid dates", () => {
      const invalidDate = new Date("invalid");
      expect(() =>
        generateTemplateFile(
          "/project/page.astro",
          "/project/Component.astro",
          { invalid: invalidDate }
        )
      ).toThrow("Invalid time value");
    });

    it("should handle circular references", () => {
      const obj: any = { name: "test" };
      obj.self = obj;

      expect(() =>
        generateTemplateFile(
          "/project/page.astro",
          "/project/Component.astro",
          obj
        )
      ).toThrow(); // JSON.stringify throws on circular references
    });

    it("should handle special property names", () => {
      const result = generateTemplateFile(
        "/project/page.astro",
        "/project/Component.astro",
        { "data-test": "value", "123": "numeric key" }
      );
      expect(result).toContain('data-test="value"');
      expect(result).toContain('123="numeric key"');
    });
  });
});
