import { useState } from 'react';
import './BodySelector.css';
import { ReactSVG } from 'react-svg';
import { Radio, RadioChangeEvent } from 'antd';

interface SideSelectorProps {
  control: (value: string) => void;
}

const SideSelector: React.FC<SideSelectorProps> = (props) => {
  const handleChange = (e: RadioChangeEvent) => {
    props.control(e.target.value);
  };

  return (
    <div id='SideSelector'>
      <Radio.Group defaultValue="/m_front.svg" onChange={handleChange}>
        <Radio.Button value="/m_front.svg">前</Radio.Button>
        <Radio.Button value="/m_back.svg">後</Radio.Button>
        <Radio.Button value="/m_left.svg">左</Radio.Button>
        <Radio.Button value="/m_right.svg">右</Radio.Button>
      </Radio.Group>
    </div>
  );
};

interface BodySelectorProps {
  PainLevel: { [key: string]: number };
  MonthPain: { [key: string]: boolean };
  WeekPain: { [key: string]: boolean };
  setCurrentPart: (part: string) => void;
}

const BodySelector: React.FC<BodySelectorProps> = (props) => {
  const [SvgSrc, setSvgSrc] = useState<string>('/m_front.svg');
  const color = ['white', 'green', 'yellow', 'orange', 'red', 'black'];

  return (
    <div className='BodySelector'>
      <div id="bodyPart">
        <ReactSVG
          id="bodySvg"
          src={SvgSrc}
          beforeInjection={svg => {
            svg.querySelectorAll('path').forEach(path => {
              path.setAttribute('style', 'cursor: pointer;');
              path.setAttribute('stroke', '#000000');
              path.setAttribute('stroke-width', '1');
              path.setAttribute('stroke-linecap', 'round');
            });
          }}
          afterInjection={svg => {
            svg.querySelectorAll('path').forEach(path => {
              path.setAttribute("id", path.getAttribute('inkscape:label') ?? '');
              if (props.PainLevel[path.id] === undefined && props.MonthPain[path.id] === undefined && props.WeekPain[path.id] === undefined) {
                props.PainLevel[path.id] = 0;
                props.MonthPain[path.id] = false;
                props.WeekPain[path.id] = false;
              }
              path.setAttribute('fill', color[Math.floor(props.PainLevel[path.id] / 2)]);
              path.addEventListener('click', () => {
                path.setAttribute('fill', color[Math.floor(props.PainLevel[path.id] / 2)]);
                props.setCurrentPart(path.id);
              });
            });
          }}
          renumerateIRIElements={false}
        />
        <SideSelector control={setSvgSrc} />
      </div>
    </div>
  );
};

export default BodySelector;
