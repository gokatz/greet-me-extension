function greet() {
  let name = document.querySelector('[data-test-input]').value;
  document.getElementById('greetMsg').innerText = `Hello, ${name}!`;
}
document.getElementById('greetButton').addEventListener('click', greet);