import { Form, Table, Radio } from "antd";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import React from "react";
import axios from 'axios';
import "./Mentalform.css"; // Import the CSS file
type QuestionData = {
  key: string; // Assuming keys are strings
  question: string; // Question text
};
interface FormValues {
  [key: string]: number;
}
interface MentalFormProps {
  [key: string]: number[];
}

const dataSource = [
  { key: "1", question: "睡眠困難，譬如難以入睡、易醒或早醒。" },
  { key: "2", question: "感覺緊張不安。" },
  { key: "3", question: "覺得容易苦惱或動怒。" },
  { key: "4", question: "感覺憂鬱、心情低落。" },
  { key: "5", question: "覺得比不上別人。" },
  { key: "6", question: "有自殺的想法。" },
];

import { ColumnsType } from "antd/es/table";
import { API_URL } from "../config";
import { fetchIdByUsername } from "../api/userAPI";

const columns: ColumnsType<QuestionData> = [
  {
    title: "編號",
    align: "center",
    key: "key",
    width: "10%",
    dataIndex: "key",
  },
  {
    title: "題目",
    dataIndex: "question",
    key: "question",
    width: "40%",
  },
  {
    title: "完全沒有",
    key: "完全沒有",
    align: "center",
    render: (_, record) => (
      <Form.Item name={`response-${record.key}`} style={{ margin: 0 }}>
        <Radio.Group>
          <Radio value={0} />
        </Radio.Group>
      </Form.Item>
    ),
  },
  {
    title: "輕微",
    key: "輕微",
    align: "center",
    render: (_, record) => (
      <Form.Item name={`response-${record.key}`} style={{ margin: 0 }}>
        <Radio.Group>
          <Radio value={1} />
        </Radio.Group>
      </Form.Item>
    ),
  },
  {
    title: "中等程度",
    key: "中等程度",
    align: "center",
    render: (_, record) => (
      <Form.Item name={`response-${record.key}`} style={{ margin: 0 }}>
        <Radio.Group>
          <Radio value={2} />
        </Radio.Group>
      </Form.Item>
    ),
  },
  {
    title: "嚴重",
    key: "嚴重",
    align: "center",
    render: (_, record) => (
      <Form.Item name={`response-${record.key}`} style={{ margin: 0 }}>
        <Radio.Group>
          <Radio value={3} />
        </Radio.Group>
      </Form.Item>
    ),
  },
  {
    title: "非常嚴重",
    key: "非常嚴重",
    align: "center",
    render: (_, record) => (
      <Form.Item name={`response-${record.key}`} style={{ margin: 0 }}>
        <Radio.Group>
          <Radio value={4} />
        </Radio.Group>
      </Form.Item>
    ),
  },
];

const MentalForm = () => {
  const [cookies] = useCookies(['user']); // 取得 cookies 中的使用者資訊
  const navigate = useNavigate(); // 用於導航的 hook
  const [userID, setUserID] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserID = async () => {
      const id = await fetchIdByUsername(cookies.user);
      setUserID(id);
    };
    fetchUserID();
  }, [cookies.user]);

  const onFinish = (values: FormValues) => {
    const data: MentalFormProps = {
      problem: [],
    };
    for (const key in values) {
      data["problem"].push(values[key]);
    }
    console.log(data);
    axios.post(`${API_URL}mentalform/${userID}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }).then(() => {
      navigate("/home");
    }
    );

  };

  return (
    <div className="mental-form-container">
      <Form onFinish={onFinish} className="mental-form">
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          pagination={false}
          style={{ marginBottom: "16px" }}
        />
        <Form.Item style={{ textAlign: "center" }}>
          <button
            type="submit"
            className="submit-button"
          >
            送出
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MentalForm;
