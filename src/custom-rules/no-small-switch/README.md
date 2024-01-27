# No Small Switch

This ESLint rule disallows the use of `switch` statements with less than 3 cases.

## 💡 Examples

```js
// ❌ Incorrect
const variable = "bar";

switch (variable) {
  case "foo":
    // ...
    break;
  default:
    // ...
    break;
}
```

```js
// ✅ Correct

const variable = "bar";
if (variable === "foo") {
  // ...
} else {
  // ...
}
```
