import { Modal, Radio, Slider, Form, Typography } from "antd";
import { useState } from "react";
import { RadioChangeEvent } from "antd/lib/radio";

// 定義 DataFillerProps 介面，包含組件需要的屬性，主要是當前部位和疼痛狀態的設定函數
interface DataFillerProps {
  currentPart: string;  // 當前選擇的身體部位 ID
  setCurrentPart: (part: string) => void;  // 更新當前部位的函數
  PainLevel: { [key: string]: number };  // 每個部位的疼痛等級映射
  setPainLevel: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;  // 更新疼痛等級的狀態函數
  MonthPain: { [key: string]: boolean };  // 每個部位是否在過去一年有疼痛
  setMonthPain: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;  // 更新每年疼痛狀態的函數
  WeekPain: { [key: string]: boolean };  // 每個部位是否在過去一週有疼痛
  setWeekPain: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;  // 更新每週疼痛狀態的函數
}


/**
 * DataFiller 組件
 * 用於選擇並填寫身體部位的疼痛數據，包括過去一年和過去一週的疼痛狀態，以及當前的疼痛等級。
 * 組件所需的屬性，包含疼痛狀態及其更新函數
 */

const DataFiller: React.FC<DataFillerProps> = (props) => {
  const [infoOpen, setInfoOpen] = useState(false);
  
  // Weekvalue 狀態：用於追蹤該部位過去一週的疼痛狀態
  const [WeekValue, setWeekValue] = useState(false); // 更新 Weekvalue 狀態
  const onChangeWeek = (e: RadioChangeEvent) => {
    setWeekValue(e.target.value);
  };
  // Monthvalue 狀態：用於追蹤該部位過去一年的疼痛狀態
  const [MonthValue, setMonthValue] = useState(false);

  /**
   * 處理 Monthvalue 變更的函數
   * 包含變更後的值的 RadioChangeEvent 事件對象
   */

  const onChangeMonth = (e: RadioChangeEvent) => {
    setMonthValue(e.target.value);  // 更新 Monthvalue 狀態
  };

  // value 狀態：記錄疼痛等級
  const [value, setValue] = useState(0);
  //處理疼痛等級滑塊值變更的函數
  
  const onChangeValue = (value: number) => {
    setValue(value);
  };

  const getPainLevelText = (value: number) => {
    if (0 <= value && value <= 1) return "沒有疼痛";
    else if (2 <= value && value <= 3) return "輕微疼痛";
    else if (4 <= value && value <= 5) return "疼痛不舒服";
    else if (6 <= value && value <= 7) return "疼痛很困擾";
    else if (8 <= value && value <= 9) return "疼痛很嚴重";
    else if (value === 10) return "最痛";
    return "";
  };
  // 組件的返回內容，使用 Modal 來顯示和填寫疼痛資料
  return (
      <Modal
        title="填寫疼痛資料"
        open={props.currentPart !== ''} // 組件的返回內容，使用 Modal 來顯示和填寫疼痛資料
        onOk={() => {
          // 組件的返回內容，使用 Modal 來顯示和填寫疼痛資料
          props.MonthPain[props.currentPart] = MonthValue;
          props.WeekPain[props.currentPart] = WeekValue;
          props.PainLevel[props.currentPart] = value;
          // 組件的返回內容，使用 Modal 來顯示和填寫疼痛資料
          props.setCurrentPart('');
          setMonthValue(false);
          setWeekValue(false);
          setValue(0);
        }}
        onCancel={() => { props.setCurrentPart(''); }}// 按下 Cancel 後清除當前選擇的部位
        mask={false}// 組件的返回內容，使用 Modal 來顯示和填寫疼痛資料
      > {/* 表單，用於填寫疼痛資料 */}
        <Form>
          {/* 疼痛等級滑塊，範圍從 0 到 10 */}
          <Form.Item label="過去一年有無疼痛？">
              <Slider 
                onChange={onChangeValue} 
                value={value} 
                max={10} 
                min={0}
                marks={{
                  0: "0",
                  1: "1",
                  2: "2",
                  3: "3",
                  4: "4",
                  5: "5",
                  6: "6",
                  7: "7",
                  8: "8",
                  9: "9",
                  10: "10"
                }}
              />
            
              <Typography.Text strong>疼痛程度：</Typography.Text>
              <Typography.Text style={{
                color:
                  value <= 1 ? '#999999' : // 0-1 分：灰色
                  value <= 3 ? 'green' : // 2-3 分：綠色
                  value <= 5 ? '#FFB81C' : // 4-5 分：較深黃色
                  value <= 7 ? '#ff8c00' : // 6-7 分：橙色
                  value <= 9 ? 'red' : // 8-9 分：紅色
                  'black' // 10 分：黑色
              }}>
                {getPainLevelText(value)} ({value}分)
              </Typography.Text>
            
            <div style={{ textAlign: 'right' }}>
              <Typography.Link onClick={() => setInfoOpen(true)}>疼痛分級說明</Typography.Link>
            </div>

          </Form.Item>
          {/* 是否在過去一年影響正常生活的 Radio 選項 */}
          <Form.Item label="此部位過去一年此部位的疼痛是否影響正常生活？">
            <Radio.Group onChange={onChangeMonth} value={MonthValue}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
          {/* 是否在過去一星期影響正常生活的 Radio 選項 */}
          <Form.Item label="過去一星期中，此部位是否還疼痛？">
            <Radio.Group onChange={onChangeWeek} value={WeekValue}>
              <Radio value={true}>Yes</Radio> {/* 是的，過去一週有疼痛 */}
              <Radio value={false}>No</Radio> {/* 否，過去一週無疼痛 */}
            </Radio.Group>
          </Form.Item>
        </Form>
        {/* 疼痛分級說明視窗 */}
        <Modal
          open={infoOpen}
          onCancel={() => setInfoOpen(false)}
          footer={null}
          title="疼痛分級說明"
        >
          <ul>
            <li><strong>0-1 分</strong>：沒有疼痛</li>
            <li><strong>2-3 分</strong>：輕微疼痛</li>
            <li><strong>4-5 分</strong>：疼痛不舒服</li>
            <li><strong>6-7 分</strong>：疼痛很困擾</li>
            <li><strong>8-9 分</strong>：疼痛很嚴重</li>
            <li><strong>10 分</strong> ：最痛</li>
          </ul>
        </Modal>
      </Modal>
  );
};

export default DataFiller;  // 導出 DataFiller 組件