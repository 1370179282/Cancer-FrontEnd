export interface userDataTyle {
  classification: string;
  id: number;
  model_id: string;
  username: string;
}

export interface modelType {
  isTrue?: boolean;
  model_detial: string;
  model_id: number;
  model_name: string;
  model_path: string;
  model_type: string;
}

//登录的请求/回应类型
export interface loginRequestPara {
  username: string;
  password: string;
}

export interface loginResponse {
  message: string;
  status: number;
  token: string;
}

//注册的请求/回应类型
export interface reguserRequestPara {
  username: string;
  password: string;
}

export interface reguserResponse {
  status: number;
  message: string;
}

//修改默认模型的请求/回应类型
export interface modelDefaultRequestPara {
  model_id: number;
}

export interface modelDefaultResponse {
  status: number;
  message: string;
  data: string;
}

//用户信息的请求/回应类型
export interface userInfoResquestPara {}
export interface userInfoResponse {
  classification: string;
  id: number;
  model_id: string;
  username: string;
}

//获得全部模型的请求/回应类型
export interface getAllmodelsResquestPara {}
export interface getAllmodelsResponse {
  status: number;
  message: string;
  data: Array<modelType>;
}

//添加模型的请求/回应类型
export interface addModelResquestPara {
  comment: string;
  type: string;
  modelurl: string;
  name: string;
}
export interface addModelResponse {
  status: number;
  message: string;
  data: string;
}
