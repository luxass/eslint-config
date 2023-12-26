import { expect, it } from "vitest";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { noOnlyTests } from "../../src/custom-rules/no-only-tests";

const tester = new RuleTester({
  parser: "@typescript-eslint/parser",
});

tester.run("no-only-tests", noOnlyTests, {
  valid: [
    "describe(\"Some describe block\", function() {});",
    "it(\"Some assertion\", function() {});",
    "xit.only(\"Some assertion\", function() {});",
    "xdescribe.only(\"Some describe block\", function() {});",
    "xtest.only(\"A test block\", function() {});",
    "other.only(\"An other block\", function() {});",
    "testResource.only(\"A test resource block\", function() {});",
    "var args = {only: \"test\"};",
    "it(\"should pass meta only through\", function() {});",
    "obscureTestBlock.only(\"An obscure testing library test works unless options are supplied\", function() {});",
    {
      options: [{ blocks: ["it"] }],
      code: "test.only(\"Options will exclude this from being caught\", function() {});",
    },
    {
      options: [{ focus: ["focus"] }],
      code: "test.only(\"Options will exclude this from being caught\", function() {});",
    },
  ],
  invalid: [
    {
      code: "describe.only(\"Some describe block\", function() {});",
      output: "describe.only(\"Some describe block\", function() {});",
      errors: [{ messageId: "notPermitted" }],
    },
    {
      code: "it.only(\"Some assertion\", function() {});",
      output: "it.only(\"Some assertion\", function() {});",
      errors: [{ messageId: "notPermitted" }],
    },
    {
      code: "test.only(\"Some test\", function() {});",
      output: "test.only(\"Some test\", function() {});",
      errors: [{ messageId: "notPermitted" }],
    },
    {
      options: [{ blocks: ["obscureTestBlock"] }],
      code: "obscureTestBlock.only(\"An obscure testing library test\", function() {});",
      output: "obscureTestBlock.only(\"An obscure testing library test\", function() {});",
      errors: [{ messageId: "notPermitted" }],
    },
    {
      options: [{ blocks: ["ava.default"] }],
      code: "ava.default.only(\"Block with dot\", function() {});",
      output: "ava.default.only(\"Block with dot\", function() {});",
      errors: [{ messageId: "notPermitted" }],
    },
    {
      code: "it.default.before(console.log).only(\"Some describe block\", function() {});",
      output: "it.default.before(console.log).only(\"Some describe block\", function() {});",
      errors: [{ messageId: "notPermitted" }],
    },
    {
      options: [{ focus: ["focus"] }],
      code: "test.focus(\"An alternative focus function\", function() {});",
      output: "test.focus(\"An alternative focus function\", function() {});",
      errors: [{ messageId: "notPermitted" }],
    },
  ],
});
