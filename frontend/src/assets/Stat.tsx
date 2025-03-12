import './Stat.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Container, Table, Button, Navbar, Form, FormControl, Dropdown, Modal } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import 'chart.js/auto';
import moment from 'moment';
import 'moment-timezone';
import { Userhurt, Usertime } from './ts/types';
import { bodyParts } from './ts/constants';
import withAuthRedirect from './withAuthRedirect';
import * as XLSX from 'xlsx';
import { API_URL } from '../config';
import { getIdByUsername } from '../api/userAPI';
import { deleteHurtformById, deleteWeekformById, deleteYearformById } from '../api/fromAPI';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

// 使用自定義 Hook 取得 URL query string
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

// Define a type for the query parameters
interface QueryParams {
    start?: string;
    end?: string;
}


// 定義 Stat component 為一個 React Function Component，傳入參數的 interface 為 StatProps
const Stat: React.FC = () => {

    // 使用 cookies Hook 取得當前 user
    const [cookies] = useCookies(["user"]);
    const user = cookies.user;

    // 使用 useQuery Hook 取得 URL query string 中的 id
    const query = useQuery();
    const id = query.get('id');

    // 使用 id 來設定 userId 的 state，並設定初始值為 null
    const [userId, setUserId] = useState<string | null>(id || null);

    // userhurt 用來儲存使用者的疼痛指數，userweek 用來儲存使用者的一週內是否疼痛，useryear 用來儲存使用者的一年內是否影響正常生活
    const [userhurt, setUserhurt] = useState<Userhurt[]>([]);
    const [userweek, setUserweek] = useState<Usertime[]>([]);
    const [useryear, setUseryear] = useState<Usertime[]>([]);

    // selectedBodyPart 用來儲存使用者選擇的部位，searchDatefrom 用來儲存使用者選擇的起始日期，searchDateto 用來儲存使用者選擇的結束日期
    const [selectedBodyPart, setSelectedBodyPart] = useState("default");
    const [searchDatefrom, setSearchDatefrom] = useState('');
    const [searchDateto, setSearchDateto] = useState('');

    // 設定圖表的類型為 bar (長條圖)
    const [chartType, setChartType] = useState('bar');
    // const [filteredBodyParts, setFilteredBodyParts] = useState(bodyParts);

    // chartData 用來儲存圖表的資料，包含 labels 和 datasets
    const [chartData, setChartData] = useState({
        labels: [] as string[],
        datasets: [
            {
                label: '疼痛指數平均',
                data: [] as number[],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    });

    // showModal 用來控制 Modal 的顯示與隱藏
    const [showModal, setShowModal] = useState(false);

    // handleShow 用來顯示 Modal，handleClose 用來隱藏 Modal
    // Modal 用來提供刪除功能 (僅限 admin)
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    // 若 userId 或 user 更新時，更新 userhurt、userweek、useryear 的資料
    useEffect(() => {
        const fetchUserId = async () => {
            if (!userId && user) {
                const fetchedId = await getIdByUsername(user);
                if (fetchedId) {
                    setUserId(fetchedId);
                    await fetchUserhurt(fetchedId);
                    await fetchUserweek(fetchedId);
                    await fetchUseryear(fetchedId);
                }
            } else if (userId) {
                await fetchUserhurt(userId);
                await fetchUserweek(userId);
                await fetchUseryear(userId);
            }
        };
        fetchUserId();
    }, [userId, user]);

    // 當圖表相關資料(userhurt, selectedBodyPart, chartType, userweek, useryear)更新時，更新圖表(chartData)
    useEffect(() => {

        // 設定圖表類型
        if (selectedBodyPart && selectedBodyPart !== 'default') {
            setChartType('line');
        } else {
            setChartType('bar');
        }

        const painData = calculatePainAverage(userhurt, selectedBodyPart);
        const individualPainData = calculatePainData(userhurt);

        // 設定長條圖資料
        const barChartData = {
            labels: painData.map(item => item.name),
            datasets: [
                {
                    label: '疼痛指數平均',
                    data: painData.map(item => item.pain),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }
            ]
        };

        // 設定折線圖資料
        const lineChartData = {
            labels: individualPainData.map(item => moment(item.name).format('YYYY-MM-DD HH:mm')),
            datasets: [
                {
                    label: '疼痛指數',
                    data: individualPainData.map(item => item.pain),
                    fill: false,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(75, 192, 192, 0.6)',
                    pointBorderColor: 'rgba(75, 192, 192, 1)',
                    yAxisID: 'y1',
                    order: 1
                },
                {
                    label: '一週內是否疼痛',
                    type: 'bar',
                    data: userweek.map(item => item[selectedBodyPart as keyof Usertime] ? 1 : 0),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    yAxisID: 'y2',
                    maxBarThickness: 20,
                    barPercentage: 0.5,
                    order: 2
                },
                {
                    label: '一年內是否影響正常生活',
                    type: 'bar',
                    data: useryear.map(item => item[selectedBodyPart as keyof Usertime] ? 1 : 0),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    yAxisID: 'y2',
                    maxBarThickness: 20,
                    barPercentage: 0.5,
                    order: 3
                }
            ]
        };

        setChartData(chartType === 'bar' ? barChartData : lineChartData);
    }, [userhurt, selectedBodyPart, chartType, userweek, useryear]);

    // 取得特定部位的疼痛指數，並依時間排序
    const calculatePainData = (data: Userhurt[]) => {
        return data.map(item => ({
            name: item.fill_time,
            pain: item[selectedBodyPart]
        })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    };

    // 計算 全部/指定 部位平均疼痛指數
    const calculatePainAverage = (data: Userhurt[], selectedPart: string) => {
        if (selectedPart && selectedPart !== 'default') {
            const totalPain = data.reduce((acc, curr) => acc + curr[selectedPart], 0);
            const averagePain = totalPain / data.length;
            return [{
                name: bodyParts.find(bp => bp.value === selectedPart)?.label || '',
                pain: averagePain
            }];
        } else {
            const partKeys = bodyParts.filter(part => part.value !== 'default').map(part => part.value);
            const averages = partKeys.map(part => {
                const totalPain = data.reduce((acc, curr) => acc + curr[part], 0);
                const averagePain = totalPain / data.length;
                return {
                    name: bodyParts.find(bp => bp.value === part)?.label || '',
                    pain: averagePain
                };
            });
            return averages;
        }
    };

    // 使用後端API取得使用者的疼痛資料
    const fetchUserhurt = async (id: string) => {
        try {
            // params 為查詢時間區間
            const params: QueryParams = {};
            if (searchDatefrom) {
                params.start = moment.tz(searchDatefrom, 'Asia/Taipei').startOf('day').toISOString();
                console.log(params.start);
            }
            if (searchDateto) {
                params.end = moment.tz(searchDateto, 'Asia/Taipei').endOf('day').toISOString();
                console.log(params.end);
            }

            const response = await axios.get(`${API_URL}hurtform/${id}`, {
                params,
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            const data = response.data;

            if (Array.isArray(data)) {
                setUserhurt(data);
            } else if (Array.isArray(data.data)) {
                setUserhurt(data.data);
            } else {
                setUserhurt([]);
            }
        } catch (error) {
            console.error("Error fetching user hurt data:", error);
            setUserhurt([]);
        }
    };

    // 使用後端API取得使用者的一週內是否疼痛資料
    const fetchUserweek = async (id: string) => {
        try {
            const params: QueryParams = {};
            if (searchDatefrom) {
                params.start = moment.tz(searchDatefrom, 'Asia/Taipei').startOf('day').toISOString();
            }
            if (searchDateto) {
                params.end = moment.tz(searchDateto, 'Asia/Taipei').endOf('day').toISOString();
            }

            const response = await axios.get(`${API_URL}weekform/${id}`, {
                params,
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            const data = response.data;

            if (Array.isArray(data)) {
                setUserweek(data);
            } else if (Array.isArray(data.data)) {
                setUserweek(data.data);
            } else {
                setUserweek([]);
            }
        } catch (error) {
            console.error("Error fetching user week data:", error);
            setUserweek([]);
        }
    };

    // 使用後端API取得使用者的一年內是否影響正常生活資料
    const fetchUseryear = async (id: string) => {
        try {
            const params: QueryParams = {};
            if (searchDatefrom) {
                params.start = moment.tz(searchDatefrom, 'Asia/Taipei').startOf('day').toISOString();
            }
            if (searchDateto) {
                params.end = moment.tz(searchDateto, 'Asia/Taipei').endOf('day').toISOString();
            }

            const response = await axios.get(`${API_URL}yearform/${id}`, {
                params,
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            const data = response.data;

            if (Array.isArray(data)) {
                setUseryear(data);
            } else if (Array.isArray(data.data)) {
                setUseryear(data.data);
            } else {
                setUseryear([]);
            }
        } catch (error) {
            console.error("Error fetching user year data:", error);
            setUseryear([]);
        }
    };

    // admin 管理介面刪除使用者疼痛資料
    const handleDelete = async (formId: string) => {
        await deleteHurtformById(formId);
        await deleteWeekformById(formId);
        await deleteYearformById(formId);
        if (userId) {
            fetchUserhurt(userId);
            fetchUserweek(userId);
            fetchUseryear(userId);
        }
    };

    // 搜尋使用者疼痛資料(即搜尋按鈕的事件處理函式)
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId) {
            fetchUserhurt(userId);
            fetchUserweek(userId);
            fetchUseryear(userId);
        }
    };

    // 渲染下拉選單
    const renderDropdownItems = (parts: typeof bodyParts, setSelectedBodyPart: React.Dispatch<React.SetStateAction<string>>) => {
        const categories = Array.from(new Set(parts.map(part => part.category)));
        return (
            <div className="container-fluid">
                <div className="d-flex flex-row flex-nowrap">
                    {/* 對每個分類渲染一個下拉式選單 */}
                    {categories.map(category => (
                        <div className="p-2" key={category}>
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-secondary" id={`dropdown-basic-${category}`}>
                                    {category}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {parts.filter(part => part.category === category).map(part => (
                                        <Dropdown.Item
                                            key={part.value}
                                            onClick={() => setSelectedBodyPart(part.value)}
                                        >
                                            {part.label}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // 使用 userId 獲得 username
    const getUsername = async (uid: string) => {
        const response = await axios.get(`${API_URL}user/${uid}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        return response.data;
    };

    // 匯出 Excel
    const exportToExcel = async (uid: string) => {
        const response = await getUsername(uid);
        const worksheet = XLSX.utils.json_to_sheet(userhurt);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "疼痛資料");
        XLSX.writeFile(workbook, `疼痛資料_${response.username}.xlsx`);
    };

    return (
        <div className="stat">
            <Container>
                <h1>疼痛統計</h1>
                <Navbar expand="lg" className="justify-content-between mt-4">
                    <Form onSubmit={handleSearch} className="d-flex w-100 align-items-center" style={{ whiteSpace: 'nowrap' }}>
                        {/* 部位選擇選單 */}
                        <div className="d-flex flex-wrap">
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" className="me-5">
                                    {bodyParts.find(part => part.value === selectedBodyPart)?.label || "選擇部位"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {renderDropdownItems(bodyParts, setSelectedBodyPart)}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        <div className="text-center me-3" style={{ width: '120px' }}>搜尋時間</div>
                        {/* 查詢日期設定(from) */}
                        <FormControl
                            type="date"
                            className="me-3"
                            value={searchDatefrom}
                            onChange={e => setSearchDatefrom(e.target.value)}
                        />
                        <div className="text-center me-3" style={{ width: '30px' }}>至</div>
                        {/* 查詢日期設定(to) */}
                        <FormControl
                            type="date"
                            className="me-3"
                            value={searchDateto}
                            onChange={e => setSearchDateto(e.target.value)}
                        />
                        {/* 送出表單按鈕 */}
                        <Button variant="outline-success" type="submit" className="me-3">搜尋</Button>
                        {/* admin 的管理及匯出 Excel 功能 */}
                        {user === 'admin' && (
                            <>
                                {/* 展示互動介面，可刪除疼痛資料 */}
                                <Button variant="outline-primary" onClick={handleShow} className='me-2'>
                                    管理
                                </Button>
                                {/* 匯出 Excel */}
                                <Button
                                    variant="outline-primary"
                                    onClick={() => exportToExcel(userhurt[0].user_id)}
                                    className='me-2'
                                >
                                    匯出 Excel
                                </Button>
                            </>
                        )}
                    </Form>
                </Navbar>

                <div className="chart-container mt-4">
                    {chartData && (
                        // 根據圖表類型渲染不同的圖表
                        chartType === 'bar' ? (
                            // 長條圖
                            <Bar
                                data={chartData}
                                options={{
                                    scales: {
                                        y1: {
                                            type: 'linear',
                                            position: 'left',
                                            beginAtZero: true,
                                            max: 10
                                        }
                                    }
                                }}
                            />
                        ) : (
                            // 折線圖
                            <Line
                                data={chartData}
                                options={{
                                    scales: {
                                        y1: {
                                            type: 'linear',
                                            position: 'left',
                                            beginAtZero: true,
                                            max: 10
                                        },
                                        y2: {
                                            type: 'linear',
                                            position: 'right',
                                            beginAtZero: true,
                                            display: false,
                                            max: 4,
                                            grid: {
                                                drawOnChartArea: false
                                            }
                                        }
                                    }
                                }}
                            />
                        )
                    )}
                </div>

                {/* admin 管理用 Modal */}
                <Modal show={showModal} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>疼痛資料管理</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* 疼痛表單表格 */}
                        <Table striped bordered hover className="mt-4">
                            <thead>
                                <tr>
                                    <th className="stat-time-column">填寫時間</th>
                                    <th className="stat-actions-column">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userhurt.map(uh => (
                                    <tr key={uh.id}>
                                        <td className="stat-time-column">{moment(uh.fill_time).format('YYYY-MM-DD HH:mm')}</td>
                                        <td className="stat-actions-column">
                                            {user === 'admin' && (
                                                // 刪除按鈕，並使用 handleDelete 函式處理刪除事件
                                                <Button variant="outline-danger" onClick={() => handleDelete(uh.id)}>刪除</Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default withAuthRedirect(Stat);
