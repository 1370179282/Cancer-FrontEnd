import React, { useState } from "react";
import { Button, Upload, Image as Img } from "antd";
import ImgCrop from "antd-img-crop";

export const Uploadimg: React.FC<{
  maxCount: number;
  imagelist?: React.MutableRefObject<undefined>;
  imgRef: React.MutableRefObject<HTMLImageElement>;
}> = ({ maxCount, imagelist, imgRef }) => {
  const [fileList, setFileList] = useState([]);
  const [url, seturl] = useState();
  const refimg = React.useRef<HTMLImageElement>();
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    imagelist.current = newFileList?.[0]?.xhr?.response;
    seturl(imagelist.current);
    imgRef.current = refimg.current;
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  const token = window.localStorage.getItem("token");
  return (
    <>
      <ImgCrop
        rotate
        modalTitle="请对图片进行裁剪"
        beforeCrop={(e) => {
          console.log(e, "e");
          // e.type = "image/png";
          return true;
        }}
      >
        <Upload
          action="http://127.0.0.1:3007/imageUpload"
          method="POST"
          headers={{ Authorization: token }}
          // listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          maxCount={maxCount}
        >
          <Button>添加图片</Button>
        </Upload>
      </ImgCrop>
      {Boolean(url) && (
        <>
          <img
            alt="图片加载失败"
            src={url}
            width={150}
            height={150}
            ref={(api) => {
              refimg.current = api;
            }}
          />
        </>
      )}
    </>
  );
};
