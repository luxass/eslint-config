import { RuleTester } from "@typescript-eslint/rule-tester";
import { RULE_NAME, noSmallSwitch } from "../../src/custom-rules/no-small-switch";

const tester = new RuleTester({
  parser: "@typescript-eslint/parser",
});

tester.run(RULE_NAME, noSmallSwitch, {
  valid: [
    { code: "switch (a) { case 1: case 2: break; default: doSomething(); break; }" },
    { code: "switch (a) { case 1: break; default: doSomething(); break; case 2: }" },
    { code: "switch (a) { case 1: break; case 2: }" },
  ],
  invalid: [
    {
      code: "switch (a) { case 1: doSomething(); break; default: doSomething(); }",
      errors: [
        {
          messageId: "small-switch",
          column: 1,
          endColumn: 7,
        },
      ],
    },
    {
      code: "switch (a) { case 1: break; }",
      errors: [
        {
          messageId: "small-switch",
          column: 1,
          endColumn: 7,
        },
      ],
    },
    {
      code: "switch (a) {}",
      errors: [
        {
          messageId: "small-switch",
          column: 1,
          endColumn: 7,
        },
      ],
    },
  ],
});
