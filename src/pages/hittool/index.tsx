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
        : modelData.model_path;
    const model: any = await tf.loadLayersModel(modelURL);
    console.log(model, "model");
    let img: any = new Image(96, 96);
    img.src = imagelist.current;
    img.crossOrigin = "anonymous";
    setTimeout(async () => {
      const ext = tf.tidy(() => {
        return tf.image
          .resizeBilinear(tf.browser.fromPixels(img), [96, 96])
          .div(255)
          .reshape([-1, 96, 96, 3]);
      });
      const predictRes = await model.predict(ext).data();
      console.log(predictRes[1], "predictRes");
      if (predictRes[1] > 0.6) {
        Modal.error({
          title: "检测出癌细胞",
          content: "相似度为:" + predictRes[1].toFixed(6),
        });
      } else {
        Modal.success({
          title: "没有检测出癌细胞",
          content: "相似度为:" + predictRes[1].toFixed(6),
        });
      }
      img = 0;
    }, 300);
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
      </Descriptions>
      <Button
        onClick={() => {
          test();
          console.log(imagelist);
        }}
      >
        test
      </Button>
      <Uploadimg
        maxCount={1}
        imagelist={imagelist}
        imgRef={imageRef}
      ></Uploadimg>
    </>
  );
};

export default Hittool;
