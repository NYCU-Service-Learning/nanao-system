import { Modal, Radio, Slider, Form } from "antd";
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
  // Weekvalue 狀態：用於追蹤該部位過去一週的疼痛狀態
  const [Weekvalue, setWeekValue] = useState(false); // 更新 Weekvalue 狀態
  const onChangeWeek = (e: RadioChangeEvent) => {
    setWeekValue(e.target.value);
  };
  // Monthvalue 狀態：用於追蹤該部位過去一年的疼痛狀態
  const [Monthvalue, setMonthValue] = useState(false);

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
// 組件的返回內容，使用 Modal 來顯示和填寫疼痛資料
  return (
    <>
      <Modal
        title="填寫疼痛資料"
        visible={props.currentPart !== ''} // 組件的返回內容，使用 Modal 來顯示和填寫疼痛資料
        onOk={() => {
          // 組件的返回內容，使用 Modal 來顯示和填寫疼痛資料
          props.MonthPain[props.currentPart] = Monthvalue;
          props.WeekPain[props.currentPart] = Weekvalue;
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
            <Slider onChange={onChangeValue} value={value} max={10} min={0} />
          </Form.Item>
          {/* 是否在過去一年影響正常生活的 Radio 選項 */}
          <Form.Item label="此部位過去一年此部位的疼痛是否影響正常生活？">
            <Radio.Group onChange={onChangeMonth} value={Monthvalue}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
          {/* 是否在過去一年影響正常生活的 Radio 選項 */}
          <Form.Item label="過去一星期中，此部位是否還疼痛？">
            <Radio.Group onChange={onChangeWeek} value={Weekvalue}>
              <Radio value={true}>Yes</Radio> {/* 是的，過去一週有疼痛 */}
              <Radio value={false}>No</Radio> {/* 否，過去一週無疼痛 */}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DataFiller;  // 導出 DataFiller 組件
