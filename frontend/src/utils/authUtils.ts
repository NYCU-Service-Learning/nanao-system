import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { getStatus } from "../api/authAPI";
import axios from "axios";
import { API_URL } from "../config";

const HOUR = 60 * 60 * 1000;

export const useAuthHelper = () => {
  const [, setCookie] = useCookies(["user"]);
  const navigate = useNavigate();

  const setUserCookie = (username: string) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + HOUR);
    setCookie("user", username, {
      path: "/",
      expires,
      sameSite: "lax",
    });
  };

  const handleOAuthLogin = (loginType: string, failureMessage: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginStatus = urlParams.get(loginType);
    const username = urlParams.get("username");
    if (loginStatus === "success" && username) {
      setUserCookie(username);
      navigate("/home");
    } else if (loginStatus === "failed" || loginStatus === "error") {
      return failureMessage;
    }
    return "";
  };

  const handleOAuthLinking = (linkType: "googleLink" | "lineLink") => {
    const urlParams = new URLSearchParams(window.location.search);
    const linkStatus = urlParams.get(linkType);

    if (!linkStatus) return "";

    switch (linkStatus) {
      case "Success":
        return "第三方帳號連結成功!";
      case "GoogleAlreadyLinked":
        return "Google 帳號已被其他使用者連結";
      case "LineAlreadyLinked":
        return "Line 帳號已被其他使用者連結";
      case "AccountAlreadyLinked":
        return "此帳號已連結過該第三方服務";
      case "LinkingError":
        return "帳號連結發生錯誤";
      case "Fail":
      default:
        return "帳號連結失敗，請重試";
    }
  };

  const checkAuthStatus = async () => {
    try {
      const data = await getStatus();

      if (data.status === "success") {
        setUserCookie(data.user.username);
        navigate("/home");
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
    }
  };

  const loginWithPwd = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_URL}auth/login`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (response.status === 201) {
        setUserCookie(username);
        navigate("/home");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          return "用戶不存在";
        } else if (error.response.status === 401) {
          return "密碼錯誤";
        } else {
          return "登錄失敗，請稍後再試";
        }
      } else {
        return "網絡錯誤，請檢查您的連接";
      }
    }
    return "";
  };

  return {
    setUserCookie,
    handleOAuthLogin,
    handleOAuthLinking,
    checkAuthStatus,
    loginWithPwd,
  };
};
