import './Interact.css';
import React from 'react';
import BodySelector from './BodySelector';
import DataFiller from './DataFiller';
import { Button } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import withAuthRedirect from '../withAuthRedirect';
import { useNavigate } from 'react-router-dom';

const url = 'http://localhost:3000/';

const getUserID = async (username: string): Promise<string> => {
  const response = await axios.get(`${url}user/find/${username}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
  return response.data;
};

interface PainLevelType {
  [key: string]: number;
}

interface PainStatusType {
  [key: string]: boolean;
}

const Interact: React.FC = () => {
  const [cookies] = useCookies(['user']);
  const [PainLevel, setPainLevel] = React.useState<PainLevelType>({});
  const [currentPart, setCurrentPart] = React.useState<string>('');
  const [MonthPain, setMonthPain] = React.useState<PainStatusType>({});
  const [WeekPain, setWeekPain] = React.useState<PainStatusType>({});
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const userid = await getUserID(cookies.user);

      await Promise.all([
        axios.post(`${url}hurtform/${userid}`, PainLevel, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }),
        axios.post(`${url}weekform/${userid}`, WeekPain, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }),
        axios.post(`${url}yearform/${userid}`, MonthPain, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }),
      ]);

      navigate('/stat');
    } catch (error) {
      console.error('Error submitting forms:', error);
    }
  };

  return (
    <div className="container">
      <BodySelector
        PainLevel={PainLevel}
        setCurrentPart={setCurrentPart}
        MonthPain={MonthPain}
        WeekPain={WeekPain}
      />
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
      <Button variant="outline-primary" className='float-end' onClick={handleSubmit}>
        送出
      </Button>
    </div>
  );
};

export default withAuthRedirect(Interact);
