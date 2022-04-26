import React from "react";
import * as tf from "@tensorflow/tfjs";
import {
  Button,
  Image as Img,
  message,
  Modal,
  Descriptions,
  Badge,
} from "antd";
import { Uploadimg } from "../../compoment/upload/uploadimage";
import { modelType, userDataTyle } from "../../../types/type";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../api/api";
import userStore from "../../store/userstore";
import { observer } from "mobx-react";

const Hittool: React.FC = ({}) => {
  const navigate = useNavigate();
  const imagelist = React.useRef();
  const imageRef = React.useRef();
  const [modelData, setmodelData] = React.useState<modelType>();
  const [modelDetial, setDetial] = React.useState<any>();
  const test = async () => {
    const modelURL =
      modelData?.model_path &&
      (modelData?.model_path || "").indexOf("model.json") === -1
        ? modelData.model_path + "/model.json"
        : modelData.model_path; //模型路径的处理，需要找到model.json文件
    const model: any = await tf.loadLayersModel(modelURL); //根据URL读取模型文件
    let img: any = new Image(96, 96); //生成图片元素
    img.src = imagelist.current; //令图片的URL为上传图片的URL
    img.crossOrigin = "anonymous"; //跨域配置
    img.onload = async () => {
      const ext = tf.tidy(() => {
        //内存管理
        return tf.image
          .resizeBilinear(tf.browser.fromPixels(img), [96, 96]) //将图片设置为tensorflow元素
          .div(255) //python转换的图片格式需要除以255处理
          .reshape([-1, 96, 96, 3]); //返回模型需要的输入形状
      });
      const predictRes = await model.predict(ext).data(); //运行模型推理
      console.log(predictRes[1], "predictRes"); //输出的概率值
      Modal.info({
        title: predictRes[1] > 0.6 ? "检测出癌细胞" : "没有检测出癌细胞",
        content: "相似度为:" + predictRes[1].toFixed(6),
      });

      img = 0;
    };
  };
  React.useEffect(() => {
    const token = window.localStorage.getItem("token");
    getUserInfo().then((r) => {
      console.log(r, "r");
      if (r.status === 0) {
        setmodelData(r.usermodel[0]);
        const modelURL =
          (r.usermodel[0].model_path || "").indexOf("model.json") === -1
            ? r.usermodel[0].model_path + "/model.json"
            : r.usermodel[0].model_path;
        fetch(modelURL, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        })
          .then((r) => r.json())
          .then((r) => {
            console.log(r, "r");
            setDetial(r);
          });
      } else {
        message.error("身份认证失败/过期，请重新登陆");
        navigate("/");
      }
    });
  }, []);
  return (
    <>
      {console.log(modelData, "modelData")}
      <Descriptions title="功能信息" bordered>
        <Descriptions.Item label="名称">
          {modelData?.model_name || ""}
        </Descriptions.Item>
        <Descriptions.Item label="ID">
          {modelData?.model_id || ""}
        </Descriptions.Item>
        <Descriptions.Item label="URL">
          {modelData?.model_path || ""}
        </Descriptions.Item>
        <Descriptions.Item label="详情" span={2}>
          {modelData?.model_detial || ""}
        </Descriptions.Item>
        <Descriptions.Item label="图片类型">
          {modelData?.model_type || ""}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Badge status="processing" text="正常" />
        </Descriptions.Item>
        <Descriptions.Item label="操作">
          <div>
            <Button
              onClick={() => {
                test();
                console.log(imagelist);
              }}
            >
              开始检测
            </Button>
            <Uploadimg
              maxCount={1}
              imagelist={imagelist}
              imgRef={imageRef}
            ></Uploadimg>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default observer(Hittool);
