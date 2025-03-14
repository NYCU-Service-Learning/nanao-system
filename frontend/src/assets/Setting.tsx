import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Setting.css';
import withAuthRedirect from './withAuthRedirect';
import { UploadOutlined } from '@ant-design/icons';
import { Button as AntButton, message, Upload } from 'antd';
import type { UploadProps, UploadFile } from 'antd';
import { useAuth } from '../context/AuthContext';

interface User {
    name: string;
    username: string;
    role: string;
}

interface Userdata {
    gender: string;
    birthday: string;
    age: number;
    medical_History: string;
    address: string;
    email: string;
    phone: string;
    headshot: string;
}

interface SettingProps {
    url: string;
}

const Setting: React.FC<SettingProps> = ({ url }) => {
    const { user, loading } = useAuth();
    const [users, setUsers] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newName, setNewName] = useState('');

    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState('');
    const [editUsername, setEditUsername] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editUserrole, setEditUserrole] = useState('');

    const [showEditModal2, setShowEditModal2] = useState(false);
    const [editUsername2, setEditUsername2] = useState('');
    const [editName2, setEditName2] = useState('');
    const [editGender2, setEditGender2] = useState('');
    const [editUserbirth2, setEditUserbirth2] = useState('');
    const [editUserage2, setEditUserage2] = useState(0);
    const [editUserphone2, setEditUserphone2] = useState('');
    const [editUseremail2, setEditUseremail2] = useState('');
    const [editUseraddr2, setEditUseraddr2] = useState('');
    const [editUsermhis2, setEditUsermhis2] = useState('');
    const [editUserhs2, setEditUserhs2] = useState('0');
    const [errMsg, setErrMsg] = useState('');

    const [showEditImgModal, setShowEditImgModal] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [editNameImg, setEditNameImg] = useState('');
    const [showUploadImgModal, setShowUploadImgModal] = useState(false);
    const [showEditAiModal, setShowEditAiModal] = useState(false);
    const [aiImgSrc1, setAiImgSrc1] = useState<string>();
    const [aiImgSrc2, setAiImgSrc2] = useState<string>();
    const [aiImgSrc3, setAiImgSrc3] = useState<string>();

    // useNavigate 是一個 React Hook，用於導航到其他routes
    const navigate = useNavigate();


    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate('/home');
            } else {
                fetchUsers();
            }
        }
    }, [user, loading, navigate]);

    if (loading) {
        // return <div>Loading...</div>;
        return null;
    }

    // 如果用戶未登入或不是 ADMIN，避免渲染 Admin 組件內容
    if (!user) {
        return null;
    }
    
    // 定義一個異步函數 `getUserID`，根據使用者名稱取得 ID
    const getUserID = async (username: string) => {
        // 使用 axios 發送 GET 請求到後端的 /user/find/{username} 路由
        const response = await axios.get(`${url}user/find/${username}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        // 回傳資料
        return response.data;
    };

    const fetchUsers = async () => {
        try {
            const UserId = await getUserID(user.username);
            // 使用 axios 發送 GET 請求到後端的 /user 路由
            const response = await axios.get(`${url}user/${UserId}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            // console.log(response.data);
            // 從 GET 請求 response 中取出用戶資料，更新用戶列表
            const users = response.data;
            setUsers(users);
        } catch (error) {
            // 錯誤處理
            console.error('Error fetching users:', error);
        }
    };

    // 定義一個異步函數 `fetchUserdata`，根據使用者 ID 取得詳細用戶資料
    const fetchUserdata = async (id: number): Promise<Userdata | null> => {
        try {
            // 使用 axios 發送 GET 請求到後端的 /user-detail/{ID} 路由
            const response = await axios.get(`${url}user-detail/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            // console.log(response.data);
            return response.data;
        } catch (error) {
            // 錯誤處理，return null 表示失敗
            setErrMsg('Error fetching users.');
            return null;
        }
    };

    // 定義函數 handleEditUser，用於打開編輯用戶帳密的編輯表單
    const handleEditUser = (user: User) => {
        // 設定編輯表單中的用戶資料
        setEditName(user.name);
        setEditUsername(user.username);
        setEditUserrole(user.role);
        // 打開編輯視窗
        setShowEditModal(true);
    };

    // 定義一個異步函數 `handleUpdate`，根據使用者名稱和 role 更新用戶資料
    const handleUpdate = async (username: string, role: string) => {
        // 根據用戶名稱取得用戶 ID
        const editUserId = await getUserID(username);
        try {
            // 建立更新的用戶資料
            const updatedUser = {
                name: editName,
                username: editUsername,
                password: editPassword,
                role: role
            };
            // 使用 axios 發送 PATCH 請求到後端的 /user/{editUserID} 路由
            await axios.patch(`${url}user/${editUserId}`, updatedUser, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            // 重新取得用戶列表
            fetchUsers();
            // 關閉編輯視窗，清空表單
            setShowEditModal(false);
            setEditUsername('');
            setEditPassword('');
        } catch (error) {
            // 錯誤處理
            setErrMsg('Error updating user.');
        }
    };

    // 定義一個異步函數 `handleEditUser2`，編輯使用者詳細資料
    const handleEditUser2 = async (user: User) => {
        // 設定編輯表單中的用戶資料，根據使用者名稱取得 ID 及詳細資料
        setEditUsername2(user.username);
        setEditName2(user.name);
        const editUserId = await getUserID(user.username);
        const userdata = await fetchUserdata(editUserId);

        if (userdata) {
            // 如果取得用戶資料，將其設定到編輯表單中
            setEditGender2(userdata.gender);
            setEditUserbirth2(userdata.birthday);
            setEditUserage2(userdata.age);
            setEditUserphone2(userdata.phone);
            setEditUseremail2(userdata.email);
            setEditUseraddr2(userdata.address);
            setEditUsermhis2(userdata.medical_History);
            setEditUserhs2(userdata.headshot)
            
        } else {
            setEditGender2('');
            setEditUserbirth2('');
            setEditUserage2(0);
            setEditUserphone2('');
            setEditUseremail2('');
            setEditUseraddr2('');
            setEditUsermhis2('');
            setEditUserhs2('0');
        }

        // 打開編輯資料的視窗
        setShowEditModal2(true);
    };
    // 定義一個異步函數 `handleEditImg`，開啟編輯使用者頭像的視窗
    const handleEditImg = async (user: User) => {
        setEditNameImg(user.username);
        setShowEditImgModal(true);
    };

    // 定義一個異步函數 `handleUploadImg`，根據使用者名稱更改使用者頭像圖片
    const handleUploadImg = async (username: string) => {
        // 建立 FormData 來處理資料，根據使用者名稱取得 ID
        const formData = new FormData();
        const editUserID = await getUserID(username);
        try {
            if (fileList.length > 0) {
                // 取得上傳的第一個文件，append 到 formData
                const file = fileList[0] as unknown as File;
                formData.append('file', file); 
            }
            // 設定上傳狀態為 true
            setUploading(true);
            // 使用 axios 發送 POST 請求到指定 url
            const response = await axios.post(`http://localhost:8001/upload?user_id=${editUserID.toString()}`,
                formData
                , {
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });
            // 200 OK
            if (response.status == 200) {
                message.success('上傳成功');
                // 更新用戶頭像資料
                const updatedUser = {
                    headshot: '4'
                };
                // 使用 axios 發送 PATCH 請求到後端的 /user-detail/{editUserID} 路由
                await axios.patch(`${url}user-detail/${editUserID}`, updatedUser, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
            } else {
                // 錯誤處理
                message.error('上傳失敗');
            }
        } catch (error) {
            // 錯誤處理
            message.error('上傳失敗');
        } finally {
            // 設定上傳狀態回 false
            setUploading(false);
        }
    };

    // 定義一個異步函數 `handleUpdate2`，根據使用者名稱更新使用者詳細資料
    const handleUpdate2 = async (username: string) => {
        // 根據使用者名稱取得 ID
        const editUserId = await getUserID(username);
        try {
            // 建立更新的用戶詳細資料
            const updatedUser = {
                gender: editGender2,
                birthday: editUserbirth2,
                age: editUserage2,
                medical_History: editUsermhis2,
                address: editUseraddr2,
                email: editUseremail2,
                phone: editUserphone2,
                headshot: editUserhs2
            };
            // 使用 axios 發送 PATCH 請求到後端的 /user-detail/{editUserID} 路由
            await axios.patch(`${url}user-detail/${editUserId}`, updatedUser, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            // 重新取得用戶列表
            fetchUsers();
            // 關閉編輯視窗，清空表單
            setShowEditModal2(false);
            setEditUsername2('');
            setEditName2('');
            setEditGender2('');
            setEditUserbirth2('');
            setEditUserage2(0);
            setEditUserphone2('');
            setEditUseremail2('');
            setEditUseraddr2('');
            setEditUsermhis2('');
            setEditUserhs2('0');
        } catch (error) {
            // 錯誤處理
            setErrMsg('Error updating user.');
        }
    };

    // 定義一個異步函數 `handleAddUser`，用於新增用戶
    const handleAddUser = async () => {
        try {
            // 建立新用戶資料
            const newUser = {
                name: newName,
                username: newUsername,
                password: newPassword,
                // 預設新用戶 role 為 "USER"
                role: "USER",
                userDetail: {
                    create: {
                        gender: null,
                        birthday: "",
                        age: 0,
                        medical_History: "",
                        address: "",
                        email: "",
                        phone: "",
                        headshot: "0"
                    }
                }
            };
            // 使用 axios 發送 POST 請求到後端的 /user 路由
            await axios.post(`${url}user`, newUser, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            // 重新取得用戶列表
            fetchUsers();
            // 關閉視窗，清除資料
            setShowModal(false);
            setNewName('');
            setNewUsername('');
            setNewPassword('');
        } catch (error) {
            // 錯誤處理
            message.error('新增用戶時發生錯誤');  
            setNewName('');
            setNewUsername('');
            setNewPassword('');
        }
    };

    
    // 定義一個異步函數 `handleEditUploadImg`，開啟上傳圖片的視窗
    const handleEditUploadImg = async () => {
        setShowEditImgModal(false);
        setShowUploadImgModal(true);
    }

    // 定義一個異步函數 `handleEditAiImg`，用於設定 AI 頭像並打開 AI 頭像選擇視窗
    const handleEditAiImg = async (username: string) => {
        // 根據使用者名稱取得 ID
        const editUserID = await getUserID(username);   
        const userData = await fetchUserdata(editUserID);
        if (!userData) {
            message.error('無法取得用戶資料');
            return;
        }
        const hasUploadedImage = userData.headshot !== '0';

        if (!hasUploadedImage) {
            message.error('尚未上傳用戶頭像');  
            return;
        }
        // 設定AI生成的頭像圖片 url
        setAiImgSrc1(`http://localhost:8001/avatar_styled/styled-ca1-${editUserID}.jpg`);
        setAiImgSrc2(`http://localhost:8001/avatar_styled/styled-ca2-${editUserID}.jpg`);
        setAiImgSrc3(`http://localhost:8001/avatar_styled/styled-ca3-${editUserID}.jpg`);
        
        setShowEditAiModal(true);
        setShowEditImgModal(false);
    }

    // 定義一個異步函數 `handleAiClick`，根據使用者名稱設定 AI 頭像
    const handleAiClick = async (username: string, imgNum: string) => {
        message.info('正在設定用戶頭像，請耐心等待');  
        // 根據使用者名稱取得 ID
        const editUserID = await getUserID(username);
        try {
            // 建立更新的用戶頭像資料，設定頭像為選取之 AI 頭像編號
            const updatedUser = {
                headshot: imgNum
            };
            // 使用 axios 發送 PATCH 請求到後端的 /user-detail/{editUserID} 路由
            await axios.patch(`${url}user-detail/${editUserID}`, updatedUser, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            // 3秒處理時間，顯示成功訊息
            setTimeout(() => {
                message.success('用戶頭像更新成功');
            }, 3000);
        } catch (error) {
            // 錯誤處理，回傳 null
            console.error('Failed to update user avatar:', error);  
            message.error('無法更新用戶頭像，請檢查網路連接並重試');  
            setErrMsg('無法更新用戶頭像，請檢查網路連接並重試');  
            return null;
        }
    }    

    // 定義 uploadProps 物件，設定上傳圖片的相關屬性
    const uploadProps: UploadProps = {
        // 指定上傳的文件名稱，限制文件類型為 jpeg jpg png
        name: 'file',
        accept: '.jpeg,.jpg,.png',
        // 定義刪除文件的處理方式
        onRemove: (file) => {
            // 找出被刪除文件在 fileList 中的 index，刪除後更新 fileList
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        // 定義上傳前的處理方式
        beforeUpload: (file) => {
            const isJpgOrJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
            // 阻止錯誤文件類型上傳
            if (!isJpgOrJpeg) {
                message.error('You can only upload JPEG/PNG file!');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            // 阻止超過 2M 文件上傳
            if (!isLt2M) {
                message.error('Image must be smaller than 2MB!');
                return false;
            }
            // 更新 fileList 狀態，手動觸發上傳
            setFileList([file]);
            return false;
        },
        fileList,
    };

    return (
        <div className="admin">
            <Container>
                <h1>個人帳號設定</h1>
                {/*用戶列表表格*/}
                <Table striped bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>姓名</th>
                            <th>帳號</th>
                            <th>角色</th>
                            <th>連結</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/*遍歷users數組，為每個用戶創建一行*/}
                        {users && (
                            <tr key={users.username}>
                                {/* 姓名 */}
                                <td className="name-column">{users.name}</td>
                                {/* 帳號 */}
                                <td className="username-column">{users.username}</td>
                                {/* 角色 */}
                                <td className="role-column">{users.role === "ADMIN" ? "管理員" : "使用者"}</td>
                                <td className="link-column">
                                    {/* 個人資料按鈕 */}
                                    <Button variant="outline-secondary" onClick={async () => navigate(`/profile?id=${await getUserID(users.username)}`)}>個人資料</Button>
                                    &nbsp;
                                    {/* 疼痛統計按鈕 */}
                                    <Button variant="outline-secondary" onClick={async () => navigate(`/stat?id=${await getUserID(users.username)}`)}>疼痛統計</Button>
                                    &nbsp;
                                </td>
                                <td className="actions-column">
                                    {/* 編輯帳密按鈕 */}
                                    <Button variant="outline-secondary" onClick={() => handleEditUser(users)}>編輯帳密</Button>
                                    &nbsp;
                                    {/* 編輯資料按鈕 */}
                                    <Button variant="outline-secondary" onClick={() => handleEditUser2(users)}>編輯資料</Button>
                                    &nbsp;
                                    {/* 個人頭像按鈕 */}
                                    <Button variant="outline-secondary" onClick={() => handleEditImg(users)}>個人頭像</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                {/*點擊新增帳號後的彈出介面*/}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>新增帳號</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (newName && newUsername && newPassword) {
                                    handleAddUser();
                                } else {
                                    setErrMsg("所有欄位皆為必填");
                                }
                            }}
                        >
                            {/*姓名輸入欄位*/}
                            <Form.Group controlId="formName">
                                <Form.Label>姓名</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            {/*帳號輸入欄位*/}
                            <Form.Group controlId="formUsername" className="mt-3">
                                <Form.Label>帳號</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            {/*密碼輸入欄位*/}
                            <Form.Group controlId="formPw" className="mt-3">
                                <Form.Label>密碼</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            {/*送出按鈕，點擊時調用handleAddUser函數*/}
                            <div className="d-flex justify-content-end">
                                <Button type="submit" variant="outline-primary" className="mt-3">
                                    送出
                                </Button>
                            </div>
                        </Form>
                        {/*錯誤訊息顯示區*/}
                        <div className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</div>
                    </Modal.Body>
                    {/* <Modal.Footer>
                    </Modal.Footer> */}
                </Modal>

                {/*點擊編輯帳密後的彈出介面*/}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>編輯帳密</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <Form>
                            {/*姓名編輯欄位*/}
                            <Form.Group controlId="formEditUsername" className="mt-3">
                                <Form.Label>姓名</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            {/*帳號顯示欄位（不可編輯）*/}
                            <Form.Group controlId="formEditUsername" className="mt-3">
                                <Form.Label>帳號</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editUsername}
                                    onChange={(e) => setEditUsername(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                            {/*密碼編輯欄位*/}
                            <Form.Group controlId="formEditName" className="mt-3">
                                <Form.Label>密碼</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={editPassword}
                                    onChange={(e) => setEditPassword(e.target.value)}
                                    required
                                /> 
                            </Form.Group>
                        </Form>
                        {/*錯誤訊息顯示區*/}
                        <div className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</div>
                    </Modal.Body>
                    <Modal.Footer className="modal-footer">
                        {/*送出按鈕，點擊時調用handleUpdate函數*/}
                        <Button variant="outline-primary" onClick={() => handleUpdate(editUsername, editUserrole)}>
                            送出
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/*點擊編輯資料後的彈出介面*/}
                <Modal show={showEditModal2} onHide={() => setShowEditModal2(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>編輯資料</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <Form>
                            {/*姓名編輯欄位(不可更改)*/}
                            <Form.Group controlId="formEditName2" >
                                <Form.Label>姓名</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editName2}
                                    disabled
                                />
                            </Form.Group>
                            {/*帳號編輯欄位(不可更改)*/}
                            <Form.Group controlId="formEditUsername2" className="mt-3">
                                <Form.Label>帳號</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editUsername2}
                                    disabled
                                />
                            </Form.Group>
                            {/*性別編輯欄位*/}
                            <Form.Group controlId="formEditGender2" className="mt-3">
                                <Form.Label>性別</Form.Label>
                                <Form.Control
                                    as="select"  // 將輸入框渲染為下拉選擇框
                                    value={editGender2 || ""}  // 綁定性別值,如果為空則顯示空字符串
                                    onChange={(e) => setEditGender2(e.target.value)}  // 當選擇改變時更新性別值
                                >
                                    <option value="">選擇</option>  // 默認選項
                                    <option value="MALE">男</option>  // 男性選項
                                    <option value="FEMALE">女</option>  // 女性選項
                                </Form.Control>
                            </Form.Group>

                            {/*生日編輯欄位*/}
                            <Form.Group controlId="formEditBirth2" className="mt-3">
                                <Form.Label>生日</Form.Label>
                                <Form.Control
                                    as="input"  // 渲染為輸入框
                                    type="date"  // 指定輸入類型為日期
                                    value={editUserbirth2}  // 綁定生日值
                                    onChange={(e) => setEditUserbirth2(e.target.value)}  // 當日期改變時更新生日值
                                    min="0001-01-01"
                                    max="9999-12-31"
                                />
                            </Form.Group>

                            {/*年齡編輯欄位*/}
                            <Form.Group controlId="formEditUserage" className="mt-3">
                                <Form.Label>年齡</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    max="999"
                                    value={editUserage2}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || (/^\d+$/.test(value) && Number(value) <= 999)) {
                                            setEditUserage2(Number(e.target.value));
                                        }
                                    }}
                                />
                            </Form.Group>

                            {/*電話編輯欄位*/}
                            <Form.Group controlId="formEditUserphone" className="mt-3">
                                <Form.Label>電話</Form.Label>
                                <Form.Control
                                    type="text"  // 文本輸入框
                                    value={editUserphone2}  // 綁定電話號碼值
                                    onChange={(e) => setEditUserphone2(e.target.value)}  // 當輸入改變時更新電話號碼
                                />
                            </Form.Group>

                            {/*電子郵件編輯欄位*/}
                            <Form.Group controlId="formEditUseremail" className="mt-3">
                                <Form.Label>電子郵件</Form.Label>
                                <Form.Control
                                    type="email"  // 電子郵件輸入框,提供基本的郵件格式驗證
                                    value={editUseremail2}  // 綁定電子郵件值
                                    onChange={(e) => setEditUseremail2(e.target.value)}  // 當輸入改變時更新電子郵件
                                />
                            </Form.Group>

                            {/*地址編輯欄位*/}
                            <Form.Group controlId="formEditUseraddr" className="mt-3">
                                <Form.Label>地址</Form.Label>
                                <Form.Control
                                    type="text"  // 文本輸入框
                                    value={editUseraddr2}  // 綁定地址值
                                    onChange={(e) => setEditUseraddr2(e.target.value)}  // 當輸入改變時更新地址
                                />
                            </Form.Group>

                            {/*過去病史編輯欄位*/}
                            <Form.Group controlId="formEditUsermhis" className="mt-3">
                                <Form.Label>過去病史 (以、分隔)</Form.Label>
                                <Form.Control
                                    type="text"  // 文本輸入框
                                    value={editUsermhis2}  // 綁定病史值
                                    onChange={(e) => setEditUsermhis2(e.target.value)}  // 當輸入改變時更新病史
                                />
                            </Form.Group>
                        </Form>
                        <div className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</div>
                    </Modal.Body>
                    <Modal.Footer className="modal-footer">
                        {/*送出按鈕，點擊時調用handleUpdate2函數*/}
                        <Button variant="outline-primary" onClick={() => handleUpdate2(editUsername2)}>
                            送出
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/*點擊編輯頭像後的彈出介面*/}
                <Modal show={showEditImgModal} onHide={() => setShowEditImgModal(false)} className="edit-avatar-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>個人頭像</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/*上傳圖片按鈕*/}
                        <Button variant="outline-secondary" style={{ width: '80%' }} onClick={() => handleEditUploadImg()}>上傳圖片</Button>
                        {/*使用AI生成頭像按鈕*/}
                        <Button variant="outline-secondary" style={{ width: '80%' }} onClick={() => handleEditAiImg(editNameImg)}>使用AI頭貼</Button>
                    </Modal.Body>
                </Modal>

                {/*點擊上傳圖片後的彈出介面*/}
                <Modal show={showUploadImgModal} onHide={() => setShowUploadImgModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>上傳圖片</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        {/*文件上傳組件*/}
                        <Upload {...uploadProps}>
                            <AntButton icon={<UploadOutlined />}>選擇檔案</AntButton>
                        </Upload>
                        {/*開始上傳按鈕*/}
                        <AntButton
                            type="primary"
                            onClick={() => handleUploadImg(editNameImg)}
                            disabled={fileList.length === 0}  // 如果沒有選擇文件則禁用按鈕
                            loading={uploading}  // 上傳中顯示加載狀態
                            style={{ marginTop: 16 }}
                        >
                            {uploading ? '正在上傳' : '開始上傳'}
                        </AntButton>
                        {/*錯誤信息顯示區*/}
                        <div className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</div>
                    </Modal.Body>
                </Modal>

                {/*點擊使用AI頭貼後的彈出介面*/}
                <Modal show={showEditAiModal} onHide={() => setShowEditAiModal(false)} className='ai-modal'>
                    <Modal.Header closeButton>
                        <Modal.Title>選擇一張圖片作為頭像</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/*AI生成的第一張圖片選項*/}
                        <div>
                            <button onClick={() => handleAiClick(editNameImg, "1")} style={{ cursor: 'pointer' }}>
                                <img src={aiImgSrc1} style={{ maxWidth: '100%' }} />
                            </button>
                        </div>
                        {/*AI生成的第二張圖片選項*/}
                        <div>
                            <button onClick={() => handleAiClick(editNameImg, "2")} style={{ cursor: 'pointer' }}>
                                <img src={aiImgSrc2} style={{ maxWidth: '100%' }} />
                            </button>
                        </div>
                        {/*AI生成的第三張圖片選項*/}
                        <div>
                            <button onClick={() => handleAiClick(editNameImg, "3")} style={{ cursor: 'pointer' }}>
                                <img src={aiImgSrc3} style={{ maxWidth: '100%' }} />
                            </button>
                        </div>
                    </Modal.Body>
                    {/*錯誤訊息顯示區*/}
                    <div className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                        <Modal.Footer>
                            {errMsg}
                        </Modal.Footer>
                    </div>
                </Modal>
            </Container>
        </div>
    );
};

export default withAuthRedirect(Setting);