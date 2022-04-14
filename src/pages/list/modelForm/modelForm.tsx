import { Button, Form, Input, message, Select, Upload } from "antd";
import * as React from "react";
import { UploadOutlined } from "@ant-design/icons";

const ModelForm: React.FC<{ formApi: any }> = ({ formApi }) => {
  const [fileList, setFile] = React.useState<any[]>([]);
  const [uploading, setloading] = React.useState<boolean>(false);

  const [form] = Form.useForm();
  formApi.current = form;
  const token = window.localStorage.getItem("token");
  const handleUpload = (option: any) => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files[]", file);
    });
    // You can use any AJAX library you like
    fetch("http://127.0.0.1:3007/modelUpload", {
      method: "POST",
      body: formData,
      headers: { Authorization: token },
    })
      .then((res) => res.text())
      .then((res) => {
        setFile([]);
        message.success("模型上传成功");
        form.setFieldsValue({ modelurl: res, canOk: true });
      })
      .catch((err) => {
        message.error("模型上传失败" + err);
      })
      .finally(() => {
        setloading(false);
      });
  };
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={(e) => {
          console.log(e);
        }}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item label="模型名字" name={"name"}>
          <Input placeholder="输入模型名字" />
        </Form.Item>
        <Form.Item label="类型" name="type">
          <Select placeholder="选择模型类型">
            <Select.Option value="病理切片">病理切片</Select.Option>
            <Select.Option value="CT图">CT图</Select.Option>
            <Select.Option value="胃镜图像">胃镜图像</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="模型备注" name={"comment"}>
          <Input placeholder="输入备注" />
        </Form.Item>

        <Form.Item label="模型文件">
          <Upload
            // fileList={fileList}
            // customRequest={handleUpload}
            // action="http://127.0.0.1:3007/modelUpload"
            headers={{ Authorization: token }}
            onRemove={(file) => {
              setFile((fileList) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                return newFileList;
              });
            }}
            beforeUpload={(file) => {
              setFile((fileList) => {
                const newfile = [...fileList, file];
                return newfile;
              });
              return false;
            }}
            multiple
            // directory
          >
            <Button icon={<UploadOutlined />}>选择模型文件</Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? "正在分析中" : "确认上传此模型"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ModelForm;
