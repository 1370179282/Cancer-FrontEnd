import React, { LegacyRef, useEffect, useRef, useState } from "react";
import { Layout, Menu, Button, Space, Image, message } from "antd";
import * as tf from "@tensorflow/tfjs";

import { MnistData } from "./data";

// import * as tfvis from "@tensorflow/tfjs-vis";

const convertCanvasToImage = (canvas) => {
  return canvas.toDataURL("image/png");
};

const Home: React.FC = (props) => {
  const ref = useRef<any>();
  const [list, setlist] = useState<any[]>();
  const [modelPro, setmodel] = useState<any>();
  const imagelist: any[] = [];
  const data = new MnistData();
  const bath_size = 20;
  const model = tf.sequential();
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

      const h = await model.fit(trainXs, trainYs, {
        validationData: [testXs, testYs],
        batchSize: 500,
        epochs: 40,
      });
      setmodel(model);
      console.log(h, "modelhiseory");
    });
  }, []);
  return (
    <>
      <div>
        <canvas
          ref={(api) => (ref.current = api)}
          width={300}
          height={300}
          onMouseMove={(e) => {
            if (e.buttons === 1) {
              const ctx = e.currentTarget.getContext("2d");
              ctx!.fillStyle = "rgb(255,255,255)";
              ctx!.fillRect(
                e.nativeEvent.offsetX,
                e.nativeEvent.offsetY,
                10,
                10
              );
            }
          }}
          style={{ backgroundColor: "gray" }}
        ></canvas>
        <Button
          onClick={() => {
            const input = tf.tidy(() => {
              return tf.image
                .resizeBilinear(
                  tf.browser.fromPixels(ref.current),
                  [28, 28],
                  true
                )
                .slice([0, 0, 0], [28, 28, 1])
                .toFloat()
                .div(255)
                .reshape([1, 28, 28, 1]);
            });
            const pred = modelPro.predict(input).argMax(1);
            message.info(`预测结果为 ${pred.dataSync()[0]}`);
          }}
        >
          开始检测
        </Button>
        <Button
          type="primary"
          onClick={() => {
            const ctx = ref.current.getContext("2d");
            ctx.fillStyle = "rgb(0,0,0)";
            ctx.fillRect(0, 0, 300, 300);
          }}
        >
          清除画布
        </Button>
      </div>
    </>
  );
};

export default Home;
