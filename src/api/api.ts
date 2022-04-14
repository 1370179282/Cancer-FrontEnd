import {
  addModelResponse,
  addModelResquestPara,
  getAllmodelsResponse,
  getAllmodelsResquestPara,
  loginRequestPara,
  loginResponse,
  modelDefaultRequestPara,
  modelDefaultResponse,
  reguserRequestPara,
  reguserResponse,
  userInfoResponse,
  userInfoResquestPara,
} from "../../types/type";

export const goLogin = (l: loginRequestPara): Promise<loginResponse> => {
  const { username, password } = l;
  return fetch("http://127.0.0.1:3007/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `username=${username}&password=${password}`,
  }).then((r) => r.json());
};

export const goReguser = (r: reguserRequestPara): Promise<reguserResponse> => {
  const { username, password } = r;
  return fetch("http://127.0.0.1:3007/api/reguser", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `username=${username}&password=${password}`,
  }).then((r) => r.json());
};

export const getUserInfo = (
  r?: userInfoResquestPara
): Promise<userInfoResponse> => {
  const token = window.localStorage.getItem("token");
  return fetch("http://127.0.0.1:3007/my/userinfo", {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then((r) => r.json());
};

export const changeDefaultModel = (
  m: modelDefaultRequestPara
): Promise<modelDefaultResponse> => {
  const { model_id } = m;
  const token = window.localStorage.getItem("token");
  return fetch("http://127.0.0.1:3007/my/usermodel", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `model_id=${model_id}`,
  }).then((r) => r.json());
};

export const getAllmodel = (
  g?: getAllmodelsResquestPara
): Promise<getAllmodelsResponse> => {
  const token = window.localStorage.getItem("token");
  return fetch("http://127.0.0.1:3007/model/allModel", {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then((r) => r.json());
};

export const addModel = (
  r: addModelResquestPara
): Promise<addModelResponse> => {
  const { comment, type, modelurl, name } = r;
  const token = window.localStorage.getItem("token");
  return fetch("http://127.0.0.1:3007/model/addModel", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `model_detial=${comment}&model_type=${type}&model_path=${modelurl}&model_name=${name}`,
  }).then((r) => r.json());
};
