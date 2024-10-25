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
    props.setWeekPain({ ...props.WeekPain, [props.currentPart]: e.target.value });
  };
  const [Monthvalue, setMonthValue] = useState(false);
  const onChangeMonth = (e: RadioChangeEvent) => {
    props.setMonthPain({ ...props.MonthPain, [props.currentPart]: e.target.value });
  };
  const [value, setValue] = useState(0);
  const onChangeValue = (value: number) => {
    props.setPainLevel({ ...props.PainLevel, [props.currentPart]: value });
  };
  const [valueBefore, setValueBefore] = useState(0);
  const [MonthvalueBefore, setMonthValueBefore] = useState(false);
  const [WeekvalueBefore, setWeekValueBefore] = useState(false);
  return (
    <>
      <Modal
        maskClosable={false}
        title="填寫疼痛資料"
        open={props.currentPart !== ''}
        afterOpenChange={
          (open: boolean) => {
            if(open) {
              console.log('open');
              // save the value of the current part
              // if cancel, set the value back to the saved value
              setValueBefore(props.PainLevel[props.currentPart] || 0);
              setMonthValueBefore(props.MonthPain[props.currentPart] || false);
              setWeekValueBefore(props.WeekPain[props.currentPart] || false);
            }
          }
        }
        onOk={() => {
          props.setCurrentPart('');
          setMonthValue(false);
          setWeekValue(false);
          setValue(0);
        }}
        onCancel={() => { 
          // set the value back to the saved value
          props.setPainLevel({ ...props.PainLevel, [props.currentPart]: valueBefore });
          props.setMonthPain({ ...props.MonthPain, [props.currentPart]: MonthvalueBefore });
          props.setWeekPain({ ...props.WeekPain, [props.currentPart]: WeekvalueBefore });
          props.setCurrentPart(''); 
        }}
        mask={false}
      >
        <Form>
          <Form.Item label="過去一年有無疼痛？">
            <Slider onChange={onChangeValue} value={props.PainLevel[props.currentPart]} max={10} min={0} />
          </Form.Item>
          <Form.Item label="此部位過去一年此部位的疼痛是否影響正常生活？">
            <Radio.Group onChange={onChangeMonth} value={props.MonthPain[props.currentPart]}>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="過去一星期中，此部位是否還疼痛？">
            <Radio.Group onChange={onChangeWeek} value={props.WeekPain[props.currentPart]}>
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
