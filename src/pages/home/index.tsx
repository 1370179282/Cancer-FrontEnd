import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Space, Image } from "antd";
import * as tf from "@tensorflow/tfjs";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { MnistData } from "./data";
import csv from "csv-parser";
// import * as tfvis from "@tensorflow/tfjs-vis";

const convertCanvasToImage = (canvas) => {
  return canvas.toDataURL("image/png");
};

const Home: React.FC = (props) => {
  const [list, setlist] = useState<any[]>();
  const imagelist: any[] = [];
  const data = new MnistData();
  const bath_size = 20;
  const tensor = tf.tensor2d([
    [1, 2],
    [3, 4],
  ]);
  console.log(tensor.arraySync(), "ssss");

  useEffect(() => {
    //加载图片
    data.load().then(async () => {
      const list = data.nextTestBatch(bath_size);
      for (let i = 0; i < 20; i++) {
        const imageTensor = tf.tidy(() => {
          return list.xs.slice([i, 0], [1, 784]).reshape([28, 28, 1]);
        });
        const canvas = document.createElement("canvas");
        canvas.height = 28;
        canvas.width = 28;
        // @ts-ignore
        tf.browser.toPixels(imageTensor, canvas).then((res) => {
          imagelist.push(convertCanvasToImage(canvas));
          if (imagelist.length === bath_size) {
            setlist(imagelist);
          }
        });
      }
      const model = tf.sequential();
      model.add(
        tf.layers.conv2d({
          inputShape: [28, 28, 1],
          kernelSize: 5,
          filters: 8,
          strides: 1,
          activation: "relu",
          kernelInitializer: "varianceScaling",
        })
      );
      model.add(
        tf.layers.maxPool2d({
          poolSize: [2, 2],
          strides: [2, 2],
        })
      );
      model.add(
        tf.layers.conv2d({
          kernelSize: 5,
          filters: 16,
          strides: 1,
          activation: "relu",
          kernelInitializer: "varianceScaling",
        })
      );
      model.add(
        tf.layers.maxPool2d({
          poolSize: [2, 2],
          strides: [2, 2],
        })
      );
      model.add(tf.layers.flatten());
      model.add(
        tf.layers.dense({
          units: 10,
          activation: "softmax",
          kernelInitializer: "varianceScaling",
        })
      );
      model.compile({
        loss: "categoricalCrossentropy",
        optimizer: tf.train.adam(),
        metrics: ["accuracy"],
      });
      const [trainXs, trainYs] = tf.tidy(() => {
        const d = data.nextTrainBatch(1000);
        return [d.xs.reshape([1000, 28, 28, 1]), d.labels];
      });
      const [testXs, testYs] = tf.tidy(() => {
        const d = data.nextTestBatch(200);
        return [d.xs.reshape([200, 28, 28, 1]), d.labels];
      });
      for (let i = 0; i < 20; i++) {
        const h = await model.fit(trainXs, trainYs, {
          validationData: [testXs, testYs],
          batchSize: 500,
          epochs: 4,
        });
        console.log("Loss after Epoch " + i + " : " + h.history.loss[0]);
        console.log("acc after Epoch " + i + " : " + h.history.acc[0]);
      }
    });
  }, []);
  //shuchu
  return (
    <>
      {(list || []).map((i) => {
        return (
          <a style={{ marginLeft: 10 }} key={i}>
            <Image src={i} width={100} height={100} style={{}}></Image>
          </a>
        );
      })}
    </>
  );
};

export default Home;
