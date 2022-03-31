export default function debounce(fn, delay) {
  let timer = null;
  let self = this;
  return function () {
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    setTimeout(function () {
      fn.apply(self, args);
    }, delay);
  };
}
