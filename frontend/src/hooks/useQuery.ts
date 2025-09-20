import { useLocation } from 'react-router-dom';

// 自定義的 hook，用 `use` 開頭
// `useQuery` 用於從當前網址中解析查詢的參數
const useQuery = () => {
  // 使用 `useLocation` 來獲取當前的網址，並返回查詢參數物件
  return new URLSearchParams(useLocation().search);
};

export default useQuery;