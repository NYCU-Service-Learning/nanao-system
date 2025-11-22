import './Interact.css';
import React, { useEffect } from 'react';
import BodySelector from './BodySelector';
import DataFiller from './DataFiller';
import { Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { getIdByUsername } from '../../api/userAPI';
import { httpPost, httpPost_reco } from '../../api/APIUtils';

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
  const [audioData, setAudioData] = React.useState<Blob | null>(null); // 用來儲存錄音的 Blob 數據
  const [isRecording, setIsRecording] = React.useState(false); // 用來控制錄音的開關
  const navigate = useNavigate(); // 用於導航的 hook

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  // 讀取 query parameter
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search);
  const current_part = queryParam.get('current_part');

  // 變動 currentPart 觸發 DataFiller 中的 useEffect
  useEffect(() => {
    if(current_part){
      setCurrentPart(current_part);
    }
  }, [current_part])

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
  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;
          audioChunksRef.current = [];

          recorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);// 收集錄音數據
          };
          
          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            setAudioData(audioBlob);//設置錄音數據
          };

          recorder.start();
          setIsRecording(true); // 改變錄音狀態
        })
        .catch((error) => {
          console.error('錄音設備錯誤:', error);
        });
    } else {
      console.error('瀏覽器不支持錄音');
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();//停止錄音
      setIsRecording(false);//改變錄音狀態
    }
  };

  // 提交錄音並處理
  const handleSubmitRecording = async () => {
    if (audioData) {
      await recordAndSubmit(audioData); // 提交錄音數據
    } else {
      console.error('沒有錄音數據');
    }
  };

  const recordAndSubmit = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav'); // 後端以file搜尋

      const response = await httpPost_reco( "http://localhost:4000/process", formData); //傳送給後端
      if (response.voice_reco_success) {
        console.log('音頻處理成功');
        console.log(response.text);
      } else {
        console.error('音頻處理失敗');
      }
    } catch (error) {
      console.error('錯誤:', error);
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
      {/* ai */}
      <Button onClick={startRecording} disabled={isRecording}>
        開始錄音
      </Button>
      <Button onClick={stopRecording} disabled={!isRecording}>
        停止錄音
      </Button>
      <Button onClick={handleSubmitRecording} disabled={!audioData}>
        AI
      </Button>
    </div>
  );
};

export default Interact;
