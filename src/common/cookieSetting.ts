export const setCookie = (name, value, day) => {
  if (day !== 0) {
    //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
    const expires = day * 24 * 60 * 60 * 1000;
    const date = new Date(+new Date() + expires);
    document.cookie =
      name + "=" + encodeURI(value) + ";expires=" + date.toUTCString();
  } else {
    document.cookie = name + "=" + encodeURI(value);
  }
};

export const getCookie = (name) => {
  let arr;
  const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) return encodeURI(arr[2]);
  else return null;
};

export const delCookie = (name) => {
  setCookie(name, " ", -1);
};
