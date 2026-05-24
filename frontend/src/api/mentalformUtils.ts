import { instance } from './APIUtils'; 
import { API_URL } from '../config';

export const exportMentalformCsv = async () => {
  try {
    const response = await instance.get(`${API_URL}mentalform/export`, {
      responseType: 'blob', 
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '心理狀態紀錄表.csv');
    document.body.appendChild(link);
    link.click();
    
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('匯出失敗', error);
    alert('匯出失敗，請稍後再試！');
  }
};