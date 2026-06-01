import { Form, Table, Radio, Modal } from "antd";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import React from "react";
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

import { ColumnsType } from "antd/es/table";
import { API_URL } from "../../config";
import { getIdByUsername } from "../../api/userAPI";
import { httpPost } from "../../api/APIUtils";
import { dataSource } from "../../utils/questions";

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
      const id = await getIdByUsername(cookies.user);
      setUserID(id);
    };
    fetchUserID();
  }, [cookies.user]);

  const onFinish = async (values: FormValues) => {
    const data: MentalFormProps = {
      problem: [],
    };
    for (const key in values) {
      data["problem"].push(values[key]);
    }
    console.log("Data about to be submitted:",data);

    try{
      const response= await httpPost(`${API_URL}mentalform/${userID}`, data);
      
      // obtain the scores from backend
      console.log("後端回傳:", response); // 偷印出來看
      const resultdata= response.score !== undefined ? response : response.data;
      const {score, message, link}=resultdata || {};

      // 修改得分的警示顏色
      let scoreColor= '#1677ff'; // default blue
      if(score<=5){
        scoreColor= '#52c41a'; // well: green
      } else if (score<=14){
        scoreColor= '#faad14'; // warning: orange
      } else{
        scoreColor= '#ff4d4f'; // emergent: red
      }

      Modal.info({
        title: '問卷分析結果',
        content:(
          <div style={{marginTop: '16px'}}>
            <p style={{fontSize: '16px', fontWeight: 'bold', color: scoreColor }}>
              您的總分是：{score} 分
            </p>
            <p>{message}</p>
            {link && (
              <p style={{marginTop: '12px'}}>
                👉 <a href={link} target="_blank" rel="noopener noreferrer">點此前往校內諮商中心</a>
              </p>
            )}
          </div>
        ),

        // when users finish reading, navigate home
        onOk() {
          navigate('/home');
        },
      });
    }

    catch(error){
      console.error("Submission denied", error);
      Modal.error({
        title: "發生錯誤",
        content: "問卷送出失敗，請重新嘗試。"
      });
    }

    //await httpPost(`${API_URL}mentalform/${userID}`, data);
    //navigate('/home');
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
          scroll={{ x: 'max-content' }}
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
