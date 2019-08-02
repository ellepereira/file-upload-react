export function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      const result = e.target ? reader.result : null;
      resolve(result);
    };
  });
}
