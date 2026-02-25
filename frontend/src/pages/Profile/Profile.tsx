import "./Profile.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getIdByUsername, getUserById } from "../../api/userAPI";
import { getUserDetailById } from "../../api/userDetailAPI";
import useQuery from "../../hooks/useQuery";

// 定義 User 介面，描述從後端獲取的使用者基本信息
interface User {
  name: string;
  username: string;
  role: string;
  email: string;
  lineId: string;
}

// 定義 UserData 介面，描述使用者詳細資料（如個人資訊）
interface UserDetail {
  gender: string;
  birthday: string;
  age: number;
  medical_History: string;
  address: string;
  phone: string;
  headshot: string;
}

// 定義 ProfileProps 介面，描述 Profile 組件所需的屬性
interface ProfileProps {
  user: string | null;
}

// Profile 組件，這是一個 functional component，接收 `user` 和 `url` 作為接收的參數類型
const Profile: React.FC<ProfileProps> = ({ user }) => {
  // 定義組件的狀態
  const query = useQuery();
  const queryId = query.get("id");
  const googleStatus = query.get("googleLink");
  const lineStatus = query.get("lineLink");

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/default_avatar.jpg");
  const [isYourUser, setIsYourUser] = useState(false);
  const [currentProfileUserId, setCurrentProfileUserId] = useState("");

  // 使用 useEffect 用於獲取使用者資料
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const loggedInUserId = await getIdByUsername(user);
        // 查詢的id優先，如果沒有的話那就是自己的id
        const profileUserId = queryId || loggedInUserId;
        if (!profileUserId) return;
        setCurrentProfileUserId(profileUserId);

        const [fetchedUser, fetchedUserDetail] = await Promise.all([
          getUserById(profileUserId),
          getUserDetailById(profileUserId),
        ]);
        setUserInfo(fetchedUser);
        setUserDetail(fetchedUserDetail);
        setIsYourUser(loggedInUserId === profileUserId);
      } catch (err) {
        console.error(err);
        setErrMsg("Error fetching user data.");
      }
    };

    if (user) fetchUserId();
  }, [queryId, user]);

  const linkMsg = useMemo(() => {
    if (googleStatus === "Success" || lineStatus === "Success") {
      return "第三方帳號連結成功!";
    } else if (googleStatus === "Fail" || lineStatus === "Fail") {
      return "帳號連結失敗, 請重試";
    }
    return "";
  }, [googleStatus, lineStatus]);

  // 使用 useEffect 根據 userData 和 userId 來更新頭像 URL
  useEffect(() => {
    if (userDetail && userInfo) {
      if (userDetail.headshot === "4") {
        setAvatarUrl(
          `https://elk-on-namely.ngrok-free.app/avatar_original/original-${currentProfileUserId}.jpg`,
        );
      } else if (userDetail.headshot !== "0") {
        setAvatarUrl(
          `https://elk-on-namely.ngrok-free.app/avatar_styled/styled-ca${userDetail.headshot}-${currentProfileUserId}.jpg`,
        );
      }
    }
  }, [currentProfileUserId, userDetail, userInfo]);

  const handleGoogleLink = useCallback(() => {
    window.location.href = `/auth/google/link`;
  }, []);

  const handleLineLink = useCallback(() => {
    window.location.href = `/auth/line/link`;
  }, []);

  // 定義預設的使用者詳細資料（如果未能取得 userData，則使用該預設值）
  const defaultData: UserDetail = {
    gender: "無",
    birthday: "無",
    age: 0,
    medical_History: "無",
    address: "無",
    phone: "無",
    headshot: "0",
  };

  // 使用實際取得的資料，或預設資料
  const displayData = userDetail || defaultData;

  // 性別的對應表，用於將性別代碼轉換為顯示的字串
  const genderMap: Record<string, string> = {
    MALE: "男",
    FEMALE: "女",
  };

  const avatarSrc =
    avatarUrl === "/default_avatar.jpg"
      ? "/default_avatar.jpg"
      : `${avatarUrl}?${new Date().getTime()}`;

  return (
    <div className="profile">
      <img src={avatarSrc} alt="Profile Picture" />
      <div className="info">
        {/* 顯示使用者的基本和詳細資訊，若資料不存在則顯示 '無' */}
        <div>
          <span className="label">姓名：</span>
          {userInfo?.name || "無"}
        </div>
        <div>
          <span className="label">性別：</span>
          {genderMap[displayData.gender] || "無"}
        </div>
        <div>
          <span className="label">生日：</span>
          {displayData.birthday || "無"}
        </div>
        <div>
          <span className="label">年齡：</span>
          {displayData.age}
        </div>
        <div>
          <span className="label">電話：</span>
          {displayData.phone || "無"}
        </div>
        <div>
          <span className="label">電子郵件：</span>
          {userInfo?.email || "無"}
        </div>
        <div>
          <span className="label">地址：</span>
          {displayData.address || "無"}
        </div>
        <div>
          <span className="label">過去病史：</span>
          {displayData.medical_History || "無"}
        </div>
        {/* Same user */}
        {isYourUser && !errMsg && !userInfo?.email && (
          <button
            className="btn btn-outline-primary"
            onClick={handleGoogleLink}
          >
            連結 Google 帳號
          </button>
        )}
        &nbsp;
        {isYourUser && !errMsg && !userInfo?.lineId && (
          <button className="btn btn-outline-primary" onClick={handleLineLink}>
            連結 Line 帳號
          </button>
        )}
        {/* show google link message */}
        {linkMsg && (
          <span
            className="linkmsg"
            style={{
              color:
                (googleStatus || lineStatus) === "Success" ? "green" : "red",
            }}
          >
            {linkMsg}
          </span>
        )}
      </div>

      {/* 若有錯誤訊息則顯示 */}
      {errMsg && <div className="errmsg">{errMsg}</div>}
    </div>
  );
};

export default Profile;
