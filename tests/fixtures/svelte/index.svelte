<script>
  // Logic goes here
  let count = 0;

  function handleClick() {
    // Trigger an update when `count` changes
    count += 1;
  }

  // Example of a prop with a default initial value
  export let format = (n) => n.toFixed(2);

  // Readonly props can be accessed using `bind:this`
  /** @type {string} */
  let className;
  export { className as class };
</script>

<style>
  /* Styles go here */
  .container {
    padding: 1rem;
    background-color: #f0f0f0;
  }
</style>

<div class="container">
  <h1>Advanced Component</h1>
  <p>Click the button to increment the count: {count}</p>
  <button on:click={handleClick}>Increment</button>

  <!-- Example of using a prop -->
  <p>Formatted value: {format(123.456)}</p>

  <!-- Example of using a readonly prop -->
  <p bind:this={className}>Class name: {className}</p>
</div>
