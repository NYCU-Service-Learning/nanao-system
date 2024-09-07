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

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

interface StatProps {
  url: string;
}

const Stat: React.FC<StatProps> = ({ url }) => {
    const [cookies] = useCookies(["user"]);
    const user = cookies.user;

    const query = useQuery();
    const id = query.get('id');
    const [userId, setUserId] = useState<string | null>(id || null);
    const [userhurt, setUserhurt] = useState<Userhurt[]>([]);
    const [userweek, setUserweek] = useState<Usertime[]>([]);
    const [useryear, setUseryear] = useState<Usertime[]>([]);

    const [selectedBodyPart, setSelectedBodyPart] = useState("default");
    const [searchDatefrom, setSearchDatefrom] = useState('');
    const [searchDateto, setSearchDateto] = useState('');

    const [chartType, setChartType] = useState('bar');
    // const [filteredBodyParts, setFilteredBodyParts] = useState(bodyParts);
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

    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const getUserID = async (username: string) => {
        const response = await axios.get(url + `user/find/${username}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        return response.data;
    };

    useEffect(() => {
        const fetchUserId = async () => {
            if (!userId && user) {
                const fetchedId = await getUserID(user);
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

    useEffect(() => {
        if (selectedBodyPart && selectedBodyPart !== 'default') {
            setChartType('line');
        } else {  
            setChartType('bar');
        }
        
        const painData = calculatePainAverage(userhurt, selectedBodyPart);
        const individualPainData = calculatePainData(userhurt);

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

    const calculatePainData = (data: Userhurt[]) => {
        return data.map(item => ({
            name: item.fill_time,
            pain: item[selectedBodyPart]
        })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    };

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

    const fetchUserhurt = async (id: string) => {
        try {
            const params: any = {};
            if (searchDatefrom) {
                params.start = moment.tz(searchDatefrom, 'Asia/Taipei').startOf('day').toISOString();
                console.log(params.start);
            }
            if (searchDateto) {
                params.end = moment.tz(searchDateto, 'Asia/Taipei').endOf('day').toISOString();
                console.log(params.end);
            }
            
            const response = await axios.get(`${url}hurtform/${id}`, {
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

    const fetchUserweek = async (id: string) => {
        try {
            const params: any = {};
            if (searchDatefrom) {
                params.start = moment.tz(searchDatefrom, 'Asia/Taipei').startOf('day').toISOString();
            }
            if (searchDateto) {
                params.end = moment.tz(searchDateto, 'Asia/Taipei').endOf('day').toISOString();
            }

            const response = await axios.get(`${url}weekform/${id}`, {
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

    const fetchUseryear = async (id: string) => {
        try {
            const params: any = {};
            if (searchDatefrom) {
                params.start = moment.tz(searchDatefrom, 'Asia/Taipei').startOf('day').toISOString();
            }
            if (searchDateto) {
                params.end = moment.tz(searchDateto, 'Asia/Taipei').endOf('day').toISOString();
            }

            const response = await axios.get(`${url}yearform/${id}`, {
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

    const handleDelete = async (formId: string) => {
        await axios.delete(`${url}hurtform/${formId}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        await axios.delete(`${url}weekform/${formId}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        await axios.delete(`${url}yearform/${formId}`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
        if (userId) {
            fetchUserhurt(userId);
            fetchUserweek(userId);
            fetchUseryear(userId);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId) {
            fetchUserhurt(userId);
            fetchUserweek(userId);
            fetchUseryear(userId);
        }
    };  

    const renderDropdownItems = (parts: typeof bodyParts, setSelectedBodyPart: React.Dispatch<React.SetStateAction<string>>) => {
        const categories = Array.from(new Set(parts.map(part => part.category)));
        return (
            <div className="container-fluid">
                <div className="d-flex flex-row flex-nowrap">
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

    const getUsername = async (uid: string) => {
        const response = await axios.get(url + `user/${uid}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        return response.data;
    };

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
                        <FormControl
                            type="date"
                            className="me-3"
                            value={searchDatefrom}
                            onChange={e => setSearchDatefrom(e.target.value)}
                        />
                        <div className="text-center me-3" style={{ width: '30px' }}>至</div>
                        <FormControl
                            type="date"
                            className="me-3"
                            value={searchDateto}
                            onChange={e => setSearchDateto(e.target.value)}
                        />
                        <Button variant="outline-success" type="submit" className="me-3">搜尋</Button>
                        {user === 'admin' && (
                            <>
                            <Button variant="outline-primary" onClick={handleShow} className='me-2'>
                                管理
                            </Button>
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
                        chartType === 'bar' ? (
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

                <Modal show={showModal} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>疼痛資料管理</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
