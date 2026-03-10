import "./Profile.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { API_URL } from "../../config";
import { getIdByUsername, getUserById } from "../../api/userAPI";
import { getUserDetailById } from "../../api/userDetailAPI";
import useQuery from "../../hooks/useQuery";
import {
  getAuthConfig,
  getLinkedAccounts,
  type AuthConfig,
  type LinkedAccounts,
} from "../../api/authConfigAPI";
import { useAuthHelper } from "../../utils/authUtils";

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

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/default_avatar.jpg");
  const [isYourUser, setIsYourUser] = useState(false);
  const [currentProfileUserId, setCurrentProfileUserId] = useState("");
  const [authConfig, setAuthConfig] = useState<AuthConfig | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccounts | null>(
    null,
  );

  const { handleOAuthLinking } = useAuthHelper();

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

  // Fetch auth configuration
  useEffect(() => {
    const fetchAuthConfig = async () => {
      try {
        const config = await getAuthConfig();
        console.log("Auth config loaded:", config);
        setAuthConfig(config);
      } catch (error) {
        console.error("Failed to fetch auth config:", error);
      }
    };
    fetchAuthConfig();
  }, []);

  // Fetch linked accounts for current user
  useEffect(() => {
    const fetchLinkedAccounts = async () => {
      if (!isYourUser || !user) {
        return;
      }

      try {
        const accounts = await getLinkedAccounts();
        setLinkedAccounts(accounts);
      } catch (error) {
        console.error("Failed to fetch linked accounts:", error);
        // Set a fallback so the UI still works
        setLinkedAccounts({
          status: "error",
          linkedAccounts: { google: false, line: false },
          accountInfo: { googleEmail: null, lineId: null },
        });
      }
    };
    fetchLinkedAccounts();
  }, [isYourUser, user]);

  const linkMsg = useMemo(() => {
    const googleMsg = handleOAuthLinking("googleLink");
    const lineMsg = handleOAuthLinking("lineLink");
    return googleMsg || lineMsg;
  }, [handleOAuthLinking]);

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
    if (!authConfig?.auth.google) {
      setErrMsg("Google 連結服務未設置");
      return;
    }
    if (linkedAccounts?.linkedAccounts?.google) {
      setErrMsg("Google 帳號已連結");
      return;
    }
    window.location.href = `${API_URL}auth/google/link`;
  }, [authConfig, linkedAccounts]);

  const handleLineLink = useCallback(() => {
    if (!authConfig?.auth.lineLink) {
      setErrMsg("Line 連結服務未設置");
      return;
    }
    if (linkedAccounts?.linkedAccounts?.line) {
      setErrMsg("Line 帳號已連結");
      return;
    }
    window.location.href = `${API_URL}auth/line/link`;
  }, [authConfig, linkedAccounts]);

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

        {/* Account linking buttons for current user */}
        {isYourUser && !errMsg && authConfig && (
          <div
            className="account-linking"
            style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
          >
            {/* Google Link Button */}
            <button
              className={`btn btn-outline-primary ${
                !authConfig.auth.google ||
                linkedAccounts?.linkedAccounts?.google
                  ? "disabled"
                  : ""
              }`}
              onClick={handleGoogleLink}
              disabled={
                !authConfig.auth.google ||
                linkedAccounts?.linkedAccounts?.google
              }
              style={{ whiteSpace: "nowrap" }}
            >
              {!authConfig.auth.google
                ? "Google 登入未設置"
                : linkedAccounts?.linkedAccounts?.google
                  ? `已連結 Google`
                  : "連結 Google"}
            </button>

            {/* Line Link Button */}
            <button
              className={`btn btn-outline-primary ${
                !authConfig.auth.lineLink ||
                linkedAccounts?.linkedAccounts?.line
                  ? "disabled"
                  : ""
              }`}
              onClick={handleLineLink}
              disabled={
                !authConfig.auth.lineLink ||
                linkedAccounts?.linkedAccounts?.line
              }
              style={{ whiteSpace: "nowrap" }}
            >
              {!authConfig.auth.lineLink
                ? "Line 登入未設置"
                : linkedAccounts?.linkedAccounts?.line
                  ? "已連結 Line"
                  : "連結 Line"}
            </button>
          </div>
        )}

        {/* Show linking messages */}
        {linkMsg && (
          <span
            className="linkmsg"
            style={{
              color: linkMsg.includes("成功") ? "green" : "red",
              display: "block",
              marginTop: "10px",
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
