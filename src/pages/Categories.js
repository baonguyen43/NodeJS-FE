import React, { useCallback, useState } from "react";
import CategoryForm from "../components/CategoryForm";
import { Form, message } from "antd";
import axiosClient from "../libraries/axiosClient";

const MESSAGE_TYPE = {
  SUCCESS: "success",
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
};
export default function CategoryPage() {
  const [messageApi, contextHolder] = message.useMessage();

  const [createForm] = Form.useForm();
  const [refresh, setRefresh] = useState(0);
  const onShowMessage = useCallback(
    (content, type = MESSAGE_TYPE.SUCCESS) => {
      messageApi.open({
        type: type,
        content: content,
      });
    },
    [messageApi]
  );

  const onFinish = useCallback(
    async (values) => {
      try {
        const res = await axiosClient.post("/categories", {
          ...values,
          isDeleted: false,
        });

        setRefresh((preState) => preState + 1);
        createForm.resetFields();

        onShowMessage(res.data.message);
      } catch (error) {
        if (error?.response?.data?.errors) {
          error.response.data.errors.map((e) =>
            onShowMessage(e, MESSAGE_TYPE.ERROR)
          );
        }
      }
    },
    [createForm, onShowMessage]
  );
  return (
    <>
      {contextHolder}
      <CategoryForm
        form={createForm}
        onFinish={onFinish}
        formName="add-category-form"
        optionStyle={{
          maxWidth: 900,
          margin: "60px auto",
        }}
      />
    </>
  );
}