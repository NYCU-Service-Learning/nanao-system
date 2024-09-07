import './Profile.css';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import withAuthRedirect from './withAuthRedirect';
import { isNullOrUndef } from 'chart.js/helpers';

interface User {
  name: string;
  username: string;
  role: string;
}
interface UserData {
  gender: string;
  birthday: string;
  age: number;
  medical_History: string;
  address: string;
  email: string;
  phone: string;
  headshot: string;
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

interface ProfileProps {
  user: string | null;
  url: string;
}

const Profile: React.FC<ProfileProps> = ({ user, url }) => {
  const query = useQuery();
  const id = query.get('id');
  const [users, setUsers] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(id || null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/default_avatar.jpg');
  const [key, setKey] = useState(0);
  const getUserID = async (username: string) => {
    const response = await axios.get(url + `user/find/${username}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  };

  useEffect(() => {
    const fetchUserId = async () => {

      if (!userId && user) {
        const fetchedId = await getUserID(user);
        if (fetchedId) {
          setUserId(fetchedId);
          fetchUserData(fetchedId);
        }
      } else if (userId) {
        fetchUserData(userId);
      }
    };

    fetchUserId();

  }, [userId, user]);



  useEffect(() => {
    if(userData){
      if(userData.headshot !== "0"){
        setAvatarUrl(`https://elk-on-namely.ngrok-free.app/avatar_styled/styled-ca${userData.headshot}-${userId}.jpg`);
      }
      if(userData.headshot === "4"){
        setAvatarUrl(`https://elk-on-namely.ngrok-free.app/avatar_original/original-${userId}.jpg`);
      }
    }
  }, [userData, userId]);

  const fetchUserData = async (id: string) => {
    try {
      const response1 = await axios.get(`${url}user/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setUsers(response1.data);
      const response2 = await axios.get(`${url}user-detail/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setUserData(response2.data);
    } catch (error) {
      console.log(error)
      setErrMsg('Error fetching user data.');
    }
  };

  const defaultData: UserData = {
    gender: '無',
    birthday: '無',
    age: 0,
    medical_History: '無',
    address: '無',
    email: '無',
    phone: '無',
    headshot: '0'
  };

  const displayData = userData || defaultData;

  const genderMap: { [key: string]: string } = {
    MALE: '男',
    FEMALE: '女',
  };

  return (
    <div className="profile">
      <div>
        <img key={key} src={avatarUrl === '/default_avatar.jpg' ? '/default_avatar.jpg' :   `${avatarUrl}?${new Date().getTime()}`} alt="Profile Picture" />
      </div>
      <div className="info">
        <div><span className="label">姓名：</span>{users?.name || '無'}</div>
        <div><span className="label">性別：</span>{genderMap[displayData.gender] || '無'}</div>
        <div><span className="label">生日：</span>{displayData.birthday || '無'}</div>
        <div><span className="label">年齡：</span>{displayData.age}</div>
        <div><span className="label">電話：</span>{displayData.phone || '無'}</div>
        <div><span className="label">電子郵件：</span>{displayData.email || '無'}</div>
        <div><span className="label">地址：</span>{displayData.address || '無'}</div>
        <div><span className="label">過去病史：</span>{displayData.medical_History || '無'}</div>
      </div>
      {errMsg && <div className="errmsg">{errMsg}</div>}
    </div >
  );
};

export default withAuthRedirect(Profile);