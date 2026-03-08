import React, { useEffect, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AxiosError } from "axios";
import { getIdByUsername } from "../../api/userAPI";
import { fetchUserHealthAnalysis } from "../../api/analysisAPI";
import "./Analysis.css";

interface AnalysisData {
  data_analyzed: {
    physical: number;
    mental: number;
  };
  llm_response: string;
  message?: string;
}

const Analysis: React.FC = () => {
  const [cookies] = useCookies(["user"]);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const username = cookies.user;
      if (!username) {
        setError("請先登入");
        setLoading(false);
        return;
      }

      // 1. Get User ID
      const userId = await getIdByUsername(username);
      if (!userId) {
        setError("找不到使用者");
        setLoading(false);
        return;
      }

      const result = await fetchUserHealthAnalysis(userId);
      setData(result);
    } catch (err: unknown) {
      console.error("Failed to load analysis:", err);

      let errorMsg: string;

      if (err instanceof AxiosError && err.response) {
        errorMsg = `Server Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`;
      } else if (err instanceof Error) {
        errorMsg = `Network/Client Error: ${err.message}`;
      } else {
        errorMsg = "An unexpected error occurred";
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [cookies.user]);

  useEffect(() => {
    loadAnalysis();
  }, [loadAnalysis]);

  const cleanMarkdown = (content: string) => {
    if (!content) return "";
    // Remove ```markdown or ``` at the start
    let cleaned = content.replace(/^```(markdown)?\s*/i, "");
    // Remove ``` at the end
    cleaned = cleaned.replace(/\s*```$/, "");
    return cleaned;
  };

  const renderAnalysisContent = (content: string) => {
    const cleaned = cleanMarkdown(content);

    // Split by "## " followed by a number
    const parts = cleaned.split(/(?=^##\s+\d+\.)/gm);

    return parts.map((part, index) => {
      // Check if this part starts with a numbered header
      const match = part.match(/^(##\s+\d+\..*?)(?:\n|$)([\s\S]*)/);

      if (match) {
        // It's a numbered section
        const title = match[1].replace(/^##\s+/, ""); // Remove '## '
        const body = match[2];
        return (
          <details key={index} open={true} className="analysis-section">
            <summary className="analysis-summary">{title}</summary>
            <div className="analysis-details-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            </div>
          </details>
        );
      } else {
        // It's intro text or something else
        if (!part.trim()) return null;
        return (
          <div key={index} className="analysis-intro">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{part}</ReactMarkdown>
          </div>
        );
      }
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        正在為您分析健康狀況，請稍候... (AI 運算中)
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button className="refresh-button" onClick={loadAnalysis}>
          重試
        </button>
      </div>
    );
  }

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h1>個人健康分析報告</h1>
        {data && (
          <p className="data-meta">
            分析範圍：近 5 筆資料 (身體紀錄: {data.data_analyzed.physical},
            心理紀錄: {data.data_analyzed.mental})
          </p>
        )}
      </div>

      <div className="analysis-content markdown-body">
        {data?.llm_response ? (
          renderAnalysisContent(data.llm_response)
        ) : (
          <div className="no-data-container">
            暫無分析結果
            <div
              style={{
                marginTop: "20px",
                fontSize: "0.8em",
                color: "#999",
                textAlign: "left",
              }}
            >
              <h3>Debug Info:</h3>
              <p>User: {cookies.user}</p>
              <p>Data: {JSON.stringify(data)}</p>
            </div>
          </div>
        )}
      </div>

      <button className="refresh-button" onClick={loadAnalysis}>
        重新分析
      </button>
    </div>
  );
};

export default Analysis;
