import './Interact.css';
import React from 'react';
import BodySelector from './BodySelector';
import DataFiller from './DataFiller';
import { Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import withAuthRedirect from '../withAuthRedirect';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { getIdByUsername } from '../../api/userAPI';
import { httpPost } from '../../api/APIUtils';

// 定義 PainLevelType 和 PainStatusType 介面，用於描述疼痛狀態的數據結構
interface PainLevelType {
  [key: string]: number; // 定義 PainLevelType 和 PainStatusType 介面，用於描述疼痛狀態的數據結構
}

// 定義 PainLevelType 和 PainStatusType 介面，用於描述疼痛狀態的數據結構
interface PainStatusType {
  [key: string]: boolean; // 定義 PainLevelType 和 PainStatusType 介面，用於描述疼痛狀態的數據結構
}

/**
 * Interact 組件
 * 用於呈現疼痛資料的選擇與填寫介面，包含 BodySelector 和 DataFiller。
 * 最終數據會通過按鈕提交到後端 API 進行儲存。
 */
const Interact: React.FC = () => {
  const [cookies] = useCookies(['user']); // 取得 cookies 中的使用者資訊
  const [PainLevel, setPainLevel] = React.useState<PainLevelType>({}); // 儲存每個部位的疼痛等級
  const [currentPart, setCurrentPart] = React.useState<string>(''); // 記錄當前選擇的部位 ID
  const [MonthPain, setMonthPain] = React.useState<PainStatusType>({}); // 每年疼痛狀態
  const [WeekPain, setWeekPain] = React.useState<PainStatusType>({}); // 每週疼痛狀態
  const navigate = useNavigate(); // 用於導航的 hook

  const handleSubmit = async () => {
    try {
      // 根據 cookies 中的使用者名稱取得使用者 ID
      const userid = await getIdByUsername(cookies.user);

      // 發送多個 POST 請求，分別提交每年、每週疼痛狀態和疼痛等級
      await Promise.all([
        httpPost(`${API_URL}hurtform/${userid}`, PainLevel),
        httpPost(`${API_URL}weekform/${userid}`, WeekPain),
        httpPost(`${API_URL}yearform/${userid}`, MonthPain),
      ]);
      // 成功提交後導航至統計頁面
      navigate('/stat');
    } catch (error) {
      // 捕捉錯誤並在控制台輸出錯誤訊息
      console.error('Error submitting forms:', error);
    }
  };
  // 組件返回的 JSX，包含 BodySelector、DataFiller 組件和提交按鈕
  return (
    <div className="container">
      {/* 傳遞疼痛等級、當前部位、每年和每週疼痛狀態到 BodySelector */}
      <BodySelector
        PainLevel={PainLevel}
        setCurrentPart={setCurrentPart}
        MonthPain={MonthPain}
        WeekPain={WeekPain}
      />
      {/* 傳遞當前部位、疼痛狀態和更新函數到 DataFiller */}
      <DataFiller
        currentPart={currentPart}
        setCurrentPart={setCurrentPart}
        PainLevel={PainLevel}
        setPainLevel={setPainLevel}
        MonthPain={MonthPain}
        setMonthPain={setMonthPain}
        WeekPain={WeekPain}
        setWeekPain={setWeekPain}
      />
      {/* 提交按鈕，按下後執行 handleSubmit 函數 */}
      <Button variant="outline-primary" className='float-end' onClick={handleSubmit}>
        送出
      </Button>
    </div>
  );
};

export default withAuthRedirect(Interact);
