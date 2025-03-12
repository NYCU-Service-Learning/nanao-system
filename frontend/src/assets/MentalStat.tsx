import axios from 'axios';
import { useCookies } from 'react-cookie';
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Select } from 'antd';
import './MentalStat.css';
import { API_URL } from '../config';
import { fetchIdByUsername } from '../api/userAPI';

const { Option } = Select;

const getMentalStat = async (userID) => {
  const response = await axios.get(`${API_URL}mentalform/${userID}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
  return response.data;
};

const parseISOToLocal = (isoString) => {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate;
};

const MentalStat = () => {
  const [cookies] = useCookies(['user']);
  const [mentalData, setMentalData] = React.useState([]);
  const [xLabels, setXLabels] = React.useState([]);
  const [selectedQuestion, setSelectedQuestion] = React.useState('sum'); // Default is 'sum'
  const [chartData, setChartData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const userID = await fetchIdByUsername(cookies.user);
      const mentalStat = await getMentalStat(userID);
      console.log(mentalStat);
      const mentalStatData = mentalStat.map((item) => ({
        date: parseISOToLocal(item.filled_time),
        values: item.problem, // Keep all questions' values
        sum: item.problem.reduce((acc, cur) => acc + cur, 0), // Sum up all problems
      }));
      setMentalData(mentalStatData);
      setXLabels(mentalStatData.map((item) => item.date));
      setChartData(mentalStatData.map((item) => item.sum)); // Default to sum
    };
    fetchData();
  }, [cookies.user]);

  React.useEffect(() => {
    if (mentalData.length > 0) {
      if (selectedQuestion === 'sum') {
        setChartData(mentalData.map((item) => item.sum));
      } else {
        const questionIndex = parseInt(selectedQuestion, 10) - 1;
        setChartData(mentalData.map((item) => item.values[questionIndex]));
      }
    }
  }, [selectedQuestion, mentalData]);

  const valueFormatter = (date) =>
    date.toLocaleDateString('fr-FR', {
      month: '2-digit',
      day: '2-digit',
    });

  const xAxisCommon = {
    data: xLabels,
    scaleType: 'time',
    valueFormatter,
  } as const;

  const getThresholds = () =>
    selectedQuestion === 'sum'
      ? { thresholds: [6, 10, 15], colors: ['green', 'yellow', 'orange', 'red'] }
      : { thresholds: [1, 2, 4], colors: ['green', 'yellow', 'red'] };

  return (
    <div className="chart-container">
      <div className="select-bar">
        <Select
          defaultValue="sum"
          style={{ width: 200 }}
          onChange={(value) => setSelectedQuestion(value)}
        >
          <Option value="sum">總和</Option>
          {[...Array(6).keys()].map((index) => (
            <Option key={index + 1} value={`${index + 1}`}>
              {index == 0 ? '睡眠困難，譬如難以入睡、易醒或早醒。' :
                index == 1 ? '感覺緊張不安。' :
                  index == 2 ? '覺得容易苦惱或動怒。' :
                    index == 3 ? '感覺憂鬱、心情低落。' :
                      index == 4 ? '覺得比不上別人。' :
                        '有自殺的想法。'
              }
            </Option>
          ))}
        </Select>
      </div>
      <LineChart
        width={1000}
        height={600}
        series={[{ data: chartData, label: '心理健康統計' }]}
        xAxis={[{ ...xAxisCommon, scaleType: 'point', data: xLabels, domainLimit: 'nice', reverse: true }]}
        yAxis={[
          {
            min: 0,
            max: selectedQuestion === 'sum' ? 24 : 4,
            colorMap: {
              type: 'piecewise',
              ...getThresholds(),
            },
          },
        ]}
        grid={{ horizontal: true, vertical: true }}
      />
    </div>
  );
};

export default MentalStat;
