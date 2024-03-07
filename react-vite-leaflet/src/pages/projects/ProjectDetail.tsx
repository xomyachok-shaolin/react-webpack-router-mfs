
import { PageContainer } from "@ant-design/pro-layout";
import { Button, Card, Dropdown, List, Menu, message, Modal, PaginationProps, Progress, Space, Tag, Typography } from "antd";
import { PlusOutlined, EllipsisOutlined, RobotFilled, RobotOutlined, UserOutlined } from "@ant-design/icons";

import React, { FC, useRef, useState } from "react";
import { findDOMNode } from "react-dom";
import OperationModal from "./components/OperationModal";
import { useAddProject, useBatchDeleteProject, useUpdateProject } from "@/api";
import { ProList } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";
const { Text, Title } = Typography;


  const TableList: FC = ({ }) => {

  const addBtn = useRef(null);

  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<API.Project> | undefined>(
    undefined
  );

  const [pagination, setPagination] = useState<Partial<PaginationProps>>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // const { data, error, isLoading, refetch } = useGetProjects(pagination, filters);

  const { mutateAsync } = useAddProject();
  const { mutateAsync: update } = useUpdateProject();
  const { mutateAsync: batchDelete } = useBatchDeleteProject();

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: API.Project) => {
    setVisible(true);
    setCurrent(item);
  };

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();

    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const addProject = async (data: API.Project) => {
    await mutateAsync(data);
  };
  const updateProject = async (data: API.Project) => {
    await update(data);
  };
  const handleSubmit = async (values: API.Project) => {
    values.id = current && current.id ? current.id : 0;

    setAddBtnblur();
    setVisible(false);

    const hide = message.loading("正在添加/更新");
    try {
      if (values.id === 0) {
        await addProject(values);
      } else {
        await updateProject(values);
      }

      hide();

      message.success("操作成功");// @ts-ignore
      refetch();

      return true;
    } catch (error) {
      hide();
      message.error("操作失败请重试！");
      return false;
    }
  };
  /**
   * 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: API.Project[]) => {
    const hide = message.loading("正在删除");
    if (!selectedRows) return true;
    try {
      await batchDelete(selectedRows.map((row) => row.id));
      setPagination({ ...pagination, current: 1 });
      hide();
      message.success("删除成功，即将刷新");
      return true;
    } catch (error) {
      hide();
      message.error("删除失败，请重试");
      return false;
    }
  };


  const data = [
    'TechUI',
    'TechUI 2.0',
    'Bigfish',
    'Umi',
    'Ant Design Pro',
  ].map((item) => ({
    title: item,
    subTitle: <Tag color="#5BD8A6">语雀专栏</Tag>,
    actions: [<a key="run">邀请</a>, <a key="delete">删除</a>],
    avatar:
      'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
    content: (
      <div
        style={{
          flex: 1,
        }}
      >
        <div
          style={{
            width: 200,
          }}
        >
          <div>发布中</div>
          <Progress percent={80} />
        </div>
      </div>
    ),
  }));

  // title, description, updatedAt, evaluated, predicted, action
  const listData = [
    { id: 1, title: 'item 1', updatedAt: '1-1-2023', description: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg' },
    { id: 2, title: 'item 2' },
    { id: 3, title: 'item 3' },
  ];

  const navigate = useNavigate()

  return (
    <PageContainer>
      <Button style={{ marginBottom: '10px' }} type="primary" key="primary" onClick={showModal}>
        <PlusOutlined /> ID
      </Button>
    </PageContainer>
  );
};

export default TableList;
