import './Profile.css';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import withAuthRedirect from './withAuthRedirect';
import { isNullOrUndef } from 'chart.js/helpers';

// 定義 User 介面，描述從後端獲取的使用者基本信息
interface User {
  name: string;
  username: string;
  role: string;
}

// 定義 UserData 介面，描述使用者詳細資料（如個人資訊）
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

// 自定義的 hook，用 `use` 開頭
// `useQuery` 用於從當前網址中解析查詢的參數
const useQuery = () => {

  // 使用 `useLocation` 來獲取當前的網址，並返回查詢參數物件
  return new URLSearchParams(useLocation().search);
};

// 定義 ProfileProps 介面，描述 Profile 組件所需的屬性
interface ProfileProps {
  user: string | null;
  url: string;
}

// Profile 組件，這是一個 functional component，接收 `user` 和 `url` 作為接收的參數類型
const Profile: React.FC<ProfileProps> = ({ user, url }) => {

  // 定義組件的狀態
  const query = useQuery();
  const id = query.get('id');
  const [users, setUsers] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(id || null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errMsg, setErrMsg] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/default_avatar.jpg');
  const [key, setKey] = useState(0);

  // 定義一個異步函數 `getUserID`，根據使用者名稱從伺服器取得使用者 ID
  const getUserID = async (username: string) => {
    const response = await axios.get(url + `user/find/${username}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  };

  // 使用 useEffect 用於獲取使用者資料
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

  // 使用 useEffect 根據 userData 和 userId 來更新頭像 URL
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

  // 定義一個異步函數 `fetchUserData`，根據 userId 獲取使用者詳細資料
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

  // 定義預設的使用者詳細資料（如果未能取得 userData，則使用該預設值）
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

  // 使用實際取得的資料，或預設資料
  const displayData = userData || defaultData;

  // 性別的對應表，用於將性別代碼轉換為顯示的字串
  const genderMap: { [key: string]: string } = {
    MALE: '男',
    FEMALE: '女',
  };

  return (
    <div className="profile">
      <div>

        {/* 頭像圖片的顯示，如果是預設頭像，則使用預設圖片；否則顯示動態 URL 來強制刷新圖片 */}
        <img key={key} src={avatarUrl === '/default_avatar.jpg' ? '/default_avatar.jpg' :   `${avatarUrl}?${new Date().getTime()}`} alt="Profile Picture" />
      </div>
      <div className="info">

        {/* 顯示使用者的基本和詳細資訊，若資料不存在則顯示 '無' */}
        <div><span className="label">姓名：</span>{users?.name || '無'}</div>
        <div><span className="label">性別：</span>{genderMap[displayData.gender] || '無'}</div>
        <div><span className="label">生日：</span>{displayData.birthday || '無'}</div>
        <div><span className="label">年齡：</span>{displayData.age}</div>
        <div><span className="label">電話：</span>{displayData.phone || '無'}</div>
        <div><span className="label">電子郵件：</span>{displayData.email || '無'}</div>
        <div><span className="label">地址：</span>{displayData.address || '無'}</div>
        <div><span className="label">過去病史：</span>{displayData.medical_History || '無'}</div>
      </div>

      {/* 若有錯誤訊息則顯示 */}
      {errMsg && <div className="errmsg">{errMsg}</div>}
    </div >
  );
};

// 使用 withAuthRedirect 高階組件包裹 Profile 組件
export default withAuthRedirect(Profile);