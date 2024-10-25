import './NotFound.css'

const NotFound = () => {
  // 這個頁面是在進到不存在的網址出現的
  // 我們自定義了Not found的頁面
  return (
    <div className="notfound">
      <h1>Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist. It might have been moved or deleted.</p>
    </div>
  );
}
 
export default NotFound;