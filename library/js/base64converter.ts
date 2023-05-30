export const main = () => {
  const object = {
    category: 'fruits',
    name: 'apple',
  }
  const base64String = 'eyJjYXRlZ29yeSI6ImZydWl0cyIsIm5hbWUiOiJhcHBsZSJ9';

  // Object to JSON to Base64.
  const objectToJson = JSON.stringify(object);
  console.log('Object to JSON =>', objectToJson);

  // JSON to Base64.
  const jsonToBase64 = Buffer.from(objectToJson).toString("base64");
  console.log('JSON to Base64 =>', jsonToBase64);

  // Base64 to JSON.
  const base64ToJson = Buffer.from(base64String, "base64").toString();
  console.log('Base64 to JSON =>', base64ToJson);

  // JSON to Object.
  const JsonToObject = JSON.parse(base64ToJson);
  console.log('JSON to Object =>', JsonToObject);
};

main();

/*
%ts-node <THIS FILE>

Object to JSON => {"category":"fruits","name":"apple"}
JSON to Base64 => eyJjYXRlZ29yeSI6ImZydWl0cyIsIm5hbWUiOiJhcHBsZSJ9
Base64 to JSON => {"category":"fruits","name":"apple"}
JSON to Object => { category: 'fruits', name: 'apple' }
*/