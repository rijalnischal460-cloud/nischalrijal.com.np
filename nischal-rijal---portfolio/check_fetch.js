
const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
console.log('Fetch descriptor:', desc);
if (desc && desc.set === undefined && desc.writable === false) {
  console.log('Fetch is read-only');
}
