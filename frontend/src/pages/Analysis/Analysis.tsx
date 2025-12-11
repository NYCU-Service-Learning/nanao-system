import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AxiosError } from 'axios';
import { getIdByUsername } from '../../api/userAPI';
import { fetchUserHealthAnalysis } from '../../api/analysisAPI';
import './Analysis.css';

interface AnalysisData {
    data_analyzed: {
        physical: number;
        mental: number;
    };
    llm_response: string;
    message?: string;
}

const Analysis: React.FC = () => {
    const [cookies] = useCookies(['user']);
    const [data, setData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadAnalysis = async () => {
        try {
            setLoading(true);
            setError(null);

            const username = cookies.user;
            if (!username) {
                setError('請先登入');
                setLoading(false);
                return;
            }

            // 1. Get User ID
            const userId = await getIdByUsername(username);
            if (!userId) {
                setError('找不到使用者');
                setLoading(false);
                return;
            }

            const result = await fetchUserHealthAnalysis(userId);
            setData(result);
        } catch (err: unknown) { 
            console.error('Failed to load analysis:', err);
            
            let errorMsg: string;

            if (err instanceof AxiosError && err.response) {
                errorMsg = `Server Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`;
            } else if (err instanceof Error) {
                errorMsg = `Network/Client Error: ${err.message}`;
            } else {
                errorMsg = 'An unexpected error occurred';
            }
            
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalysis();
    }, [cookies.user]);

    if (loading) {
        return <div className="loading-container">正在為您分析健康狀況，請稍候... (AI 運算中)</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button className="refresh-button" onClick={loadAnalysis}>重試</button>
            </div>
        );
    }

    return (
        <div className="analysis-container">
            <div className="analysis-header">
                <h1>個人健康分析報告</h1>
                {data && (
                    <p className="data-meta">
                        分析範圍：近 5 筆資料 (身體紀錄: {data.data_analyzed.physical}, 心理紀錄: {data.data_analyzed.mental})
                    </p>
                )}
            </div>

            <div className="analysis-content markdown-body">
                {data?.llm_response ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {data.llm_response}
                    </ReactMarkdown>
                ) : (
                    <div className="no-data-container">
                        暫無分析結果
                        <div style={{ marginTop: '20px', fontSize: '0.8em', color: '#999', textAlign: 'left' }}>
                            <h3>Debug Info:</h3>
                            <p>User: {cookies.user}</p>
                            <p>Data: {JSON.stringify(data)}</p>
                        </div>
                    </div>
                )}
            </div>

            <button className="refresh-button" onClick={loadAnalysis}>重新分析</button>
        </div>
    );
};

export default Analysis;
