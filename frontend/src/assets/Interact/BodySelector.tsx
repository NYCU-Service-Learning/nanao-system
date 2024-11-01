import { useState } from 'react';
import './BodySelector.css';
import { ReactSVG } from 'react-svg';
import { Radio, RadioChangeEvent } from 'antd';

// SideSelectorProps 介面定義，指定 control 為接收字串值的函數，用於切換不同視角的 SVG
interface SideSelectorProps {
  control: (value: string) => void; // control 函數傳入新的 SVG 源
}
/**
 * SideSelector 組件
 * 用於選擇身體的前、後、左、右視角，根據選項更換 BodySelector 中顯示的 SVG。
 * @param props control 函數來切換 SVG 源
 */

const SideSelector: React.FC<SideSelectorProps> = (props) => {
  const handleChange = (e: RadioChangeEvent) => {
    props.control(e.target.value);
  };
  // 渲染 Radio 組件，包含四個按鈕以選擇身體的四個視角（前、後、左、右）
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
}; // 渲染 Radio 組件，包含四個按鈕以選擇身體的四個視角（前、後、左、右）

// BodySelectorProps 介面定義，包含三個狀態對象 (PainLevel, MonthPain, WeekPain) 和 setCurrentPart 函數
interface BodySelectorProps {
  PainLevel: { [key: string]: number }; // 痛感等級的映射表
  MonthPain: { [key: string]: boolean }; // 每月痛感標記
  WeekPain: { [key: string]: boolean }; // 每週痛感標記
  setCurrentPart: (part: string) => void; // 設置當前選擇的身體部位
}

/**
 * BodySelector 組件
 * 用於顯示和互動式選擇身體部位，根據痛感等級及每週、每月痛感狀態動態渲染。
 * 支援通過 SideSelector 切換不同視角。
 * @param props 包含痛感等級和狀態，並更新當前選中部位的函數
 */

const BodySelector: React.FC<BodySelectorProps> = (props) => {
  // SvgSrc 狀態管理當前顯示的 SVG 圖像路徑，默認顯示前視角
  const [SvgSrc, setSvgSrc] = useState<string>('/m_front.svg');

   // 顏色數組，根據痛感等級設置顏色，等級從低到高為白、綠、黃、橙、紅、黑
  const color = ['white', 'green', 'yellow', 'orange', 'red', 'black']; 

  // 組件的返回內容，包含 SVG 圖像及視角切換組件
  return (
    <div className='BodySelector'>
      <div id="bodyPart">
        <ReactSVG
          id="bodySvg"
          src={SvgSrc} // 設置當前 SVG 圖像的來源
          beforeInjection={svg => {
            // 對 SVG 路徑進行預處理，設置樣式和點擊時的顏色變化
            svg.querySelectorAll('path').forEach(path => {
              path.setAttribute('style', 'cursor: pointer;');// 設置游標為指標以顯示可點擊
              path.setAttribute('stroke', '#000000');// 設置黑色描邊
              path.setAttribute('stroke-width', '1');// 設置描邊寬度為 1
              path.setAttribute('stroke-linecap', 'round');// 設置描邊樣式為圓形
            });
          }}
          afterInjection={svg => {
            // 將 SVG 加載後執行，用於設置部位標識及痛感顏色s
            svg.querySelectorAll('path').forEach(path => {
              // 使用 Inkscape 中定義的 'inkscape:label' 屬性作為部位 IDs
              path.setAttribute("id", path.getAttribute('inkscape:label') ?? '');
              // 初始化 pain level 和 pain flag 為 0 和 false 如果 path id 未定義
              if (props.PainLevel[path.id] === undefined && props.MonthPain[path.id] === undefined && props.WeekPain[path.id] === undefined) {
                props.PainLevel[path.id] = 0;
                props.MonthPain[path.id] = false;
                props.WeekPain[path.id] = false; // 更新當前選中的部位 ID
              }
              // 根據 PainLevel 設置部位顏色，顏色由 pain level 決定
              path.setAttribute('fill', color[Math.floor(props.PainLevel[path.id] / 2)]);
              // 增加點擊事件，點擊後設置顏色並更新當前選擇的部位
              path.addEventListener('click', () => {
                path.setAttribute('fill', color[Math.floor(props.PainLevel[path.id] / 2)]);
                props.setCurrentPart(path.id);
              });
            });
          }}
          renumerateIRIElements={false} // 防止 SVG ID 重複生成，保持一致性
        /> {/* SideSelector 組件，用於控制 SVG 的前後左右視角 */}
        <SideSelector control={setSvgSrc} />
      </div>
    </div>
  );
};

// 將 BodySelector 組件導出
export default BodySelector;// 將組件導出
