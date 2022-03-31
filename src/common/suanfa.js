const arr = [2, 1, 4, 2, 3, 6];
const fun4 = function (arr) {
  const res = [];
  const prearr = [...arr];
  const newarr = arr.sort((a, b) => a - b);
  const map = {};
  let cf = 0;
  for (let i in newarr) {
    if (map[i]) {
      cf++;
    } else {
      map[i] = Number(Number(i) + cf);
    }
  }
  for (let j in prearr) {
    res.push(map[j]);
  }
  return res;
};
fun4(arr);
