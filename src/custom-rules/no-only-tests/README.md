# No Only Tests

This ESLint rule disallows the use of `it.only` and `describe.only` in test files.

## 💡 Examples

```js
// ❌ Incorrect
describe.only("foo", () => {
  it.only("bar", () => {
    // ...
  })
})
```

```js
// ✅ Correct
describe("foo", () => {
  it("bar", () => {
    // ...
  })
})
```
