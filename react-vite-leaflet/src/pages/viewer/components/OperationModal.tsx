import React, { FC, useEffect, useRef } from "react";
// @ts-ignore
import moment from "moment";
import { Modal, Form, Input } from "antd";
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";

interface OperationModalProps {
  done: boolean;
  visible: boolean;
  current: Partial<API.Project> | undefined;
  onDone: () => void;
  onSubmit: (values: API.Project) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const OperationModal: FC<OperationModalProps> = (props) => {
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const { visible, current, onCancel, onSubmit } = props;

  useEffect(() => {
    if (formRef.current) {
      if (!visible) {
        form.resetFields();
      }
    }
  }, [formRef, visible]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
        createdAt: current.createdAt ? moment(current.createdAt) : null,
      });
    }
  }, [current]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = async (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(values as API.Project);
    }
  };

  const modalFooter = { okText: "保存", onOk: handleSubmit, onCancel };

  const getModalContent = () => {
    return (
      <Form {...formLayout} form={form} ref={formRef} onFinish={handleFinish}>
        <ProFormText
          name="name"
          // @ts-ignore
          label={formatMessage({ id: "app.project.name" })}
          rules={[
            {
              required: true,
              // @ts-ignore
              message: formatMessage({ id: "app.project.nameRequired" }),
            },
          ]}
        ></ProFormText>

        <ProFormTextArea
          name="description"
          // @ts-ignore
          label={formatMessage({ id: "app.project.description" })}
          rules={[
            {
              required: true,
              // @ts-ignore
              message: formatMessage({ id: "app.project.descriptionRequired" }),
              min: 5,
            },
          ]}
        />
      </Form>
    );
  };

  return (
    <Modal
      title={`项目${current ? "编辑" : "添加"}`}
      width={640}
      bodyStyle={{ padding: "28px 0 0" }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default OperationModal;
