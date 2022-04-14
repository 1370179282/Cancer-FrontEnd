import {
  Button,
  Space,
  Table,
  Tag,
  Typography,
  Modal,
  message,
  Form,
  Input,
  Select,
  FormInstance,
} from "antd";
import React from "react";
import { modelType } from "../../../types/type";
import { addModel, changeDefaultModel, getAllmodel } from "../../api/api";
import ModelForm from "./modelForm/modelForm";

const { Option } = Select;
const { Text, Link } = Typography;
const columns: any = (token) => [
  {
    title: "ID",
    dataIndex: "model_id",
    key: "model_id",
    render(t) {
      return t;
    },
  },
  {
    title: "模型名称",
    dataIndex: "model_name",
    key: "model_name",
    render: (t) => {
      return t;
    },
  },
  {
    width: 200,
    title: "模型URL",
    dataIndex: "model_path",
    key: "model_path",
    render(t) {
      return (
        <>
          <Text
            ellipsis={{
              tooltip: true,
            }}
          >
            {t}
          </Text>
        </>
      );
    },
  },
  {
    title: "模型类型",
    key: "model_type",
    dataIndex: "model_type",
    render(t, all) {
      const map = {
        病理切片: "cyan",
        CT图: "blue",
        胃镜图像: "purple",
      };
      return (
        <>
          <Tag
            color={map[t]}
            onClick={() => {
              console.log(all);
            }}
          >
            {t}
          </Tag>
        </>
      );
    },
  },
  {
    title: "备注",
    key: "model_detial",
    dataIndex: "model_detial",
    render(t) {
      return (
        <>
          <Text
            ellipsis={{
              tooltip: true,
            }}
          >
            {t}
          </Text>
        </>
      );
    },
  },
  {
    title: "操作",
    fixed: "right",
    dataIndex: "action",
    render(t, all) {
      return (
        <>
          <Link
            onClick={() => {
              Modal.info({
                title: "是否确认设置为系统默认模型？",
                cancelText: "取消",
                onOk: () => {
                  changeDefaultModel({ model_id: all.model_id })
                    .then((res) => {
                      if (res.status === 0) {
                        message.success("修改成功");
                      } else {
                        message.error("修改失败");
                      }
                    })
                    .catch((err) => message.error("修改失败"));
                },
              });
            }}
          >
            设置为默认模型
          </Link>
        </>
      );
    },
  },
];

const List: React.FC = () => {
  const [list, setlist] = React.useState<modelType[]>();
  const formApi = React.useRef<FormInstance>();
  const token = window.localStorage.getItem("token");
  React.useEffect(() => {
    getAllmodel().then((res) => {
      if (res.status === 0) {
        setlist(res.data);
      }
    });
  }, []);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography.Title>模型列表</Typography.Title>
        <div style={{ lineHeight: 3 }}>
          <Button
            onClick={() => {
              const instance = Modal.info({
                title: "填写模型基本信息",
                content: <ModelForm formApi={formApi} />,
                onCancel: () => {
                  instance.destroy();
                },
                closable: true,
                okText: "确认提交",
                onOk: () => {
                  const values = formApi.current.getFieldsValue(true);
                  console.log(values, "values");
                  if (values.canOk) {
                    addModel({
                      comment: values.comment,
                      type: values.type,
                      modelurl: values.modelurl,
                      name: values.name,
                    }).then((res) => {
                      if (res.status === 0) {
                        message.success("上传模型成功！");
                      }
                    });
                  } else {
                    message.error("请先确认上传模型！");
                    return Promise.reject();
                  }
                },
              });
            }}
          >
            上传模型
          </Button>
        </div>
      </div>
      <Table
        key={Math.random()}
        columns={columns(token)}
        // pagination={{ position: [this.state.top, this.state.bottom] }}
        dataSource={list}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 1000 }}
      />
    </>
  );
};

export default List;
