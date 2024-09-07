import { Modal, Radio, Slider, Form } from "antd";
import { useState } from "react";
import { RadioChangeEvent } from "antd/lib/radio";

interface DataFillerProps {
  currentPart: string;
  setCurrentPart: (part: string) => void;
  PainLevel: { [key: string]: number };
  setPainLevel: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  MonthPain: { [key: string]: boolean };
  setMonthPain: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  WeekPain: { [key: string]: boolean };
  setWeekPain: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

const DataFiller: React.FC<DataFillerProps> = (props) => {
  const [Weekvalue, setWeekValue] = useState(false);
  const onChangeWeek = (e: RadioChangeEvent) => {
    setWeekValue(e.target.value);
  };
  const [Monthvalue, setMonthValue] = useState(false);
  const onChangeMonth = (e: RadioChangeEvent) => {
    setMonthValue(e.target.value);
  };
  const [value, setValue] = useState(0);
  const onChangeValue = (value: number) => {
    setValue(value);
  };

  return (
    <>
      <Modal
        title="填寫疼痛資料"
        visible={props.currentPart !== ''}
        onOk={() => {
          props.MonthPain[props.currentPart] = Monthvalue;
          props.WeekPain[props.currentPart] = Weekvalue;
          props.PainLevel[props.currentPart] = value;
          props.setCurrentPart('');
          setMonthValue(false);
          setWeekValue(false);
          setValue(0);
        }}
        onCancel={() => { props.setCurrentPart(''); }}
        mask={false}
      >
        <Form>
          <Form.Item label="過去一年有無疼痛？">
            <Slider onChange={onChangeValue} value={value} max={10} min={0} />
          </Form.Item>
          <Form.Item label="此部位過去一年此部位的疼痛是否影響正常生活？">
            <Radio.Group onChange={onChangeMonth} value={Monthvalue}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="過去一星期中，此部位是否還疼痛？">
            <Radio.Group onChange={onChangeWeek} value={Weekvalue}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DataFiller;
