import { Form, Table, Radio } from "antd";
import "./Mentalform.css"; // Import the CSS file
type QuestionData = {
  key: string; // Assuming keys are strings
  question: string; // Question text
};
interface FormValues {
  [key: string]: string;
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
          <Radio value="完全沒有" />
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
          <Radio value="輕微" />
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
          <Radio value="中等程度" />
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
          <Radio value="嚴重" />
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
          <Radio value="非常嚴重" />
        </Radio.Group>
      </Form.Item>
    ),
  },
];

const MentalForm = () => {
  const onFinish = (values: FormValues) => {
    console.log("Received values of form: ", values);
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
