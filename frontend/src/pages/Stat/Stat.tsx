import "./Stat.css";
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import {
  Container,
  Table,
  Button,
  Navbar,
  Form,
  FormControl,
  Dropdown,
  Modal,
} from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chart.js/auto";
import moment from "moment";
import "moment-timezone";
import { Userhurt, Usertime } from "../../assets/ts/types";
import { bodyParts } from "../../assets/ts/constants";
import { API_URL } from "../../config";
import { getIdByUsername, getUserById } from "../../api/userAPI";
import {
  deleteHurtformById,
  deleteWeekformById,
  deleteYearformById,
} from "../../api/fromAPI";
import useQuery from "../../hooks/useQuery";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

// Define a type for the query parameters
interface QueryParams {
  start?: string;
  end?: string;
}

// 產生時間參數
const generateQueryParams = (from: string, to: string) => {
  const params: QueryParams = {};
  if (from) {
    params.start = moment.tz(from, "Asia/Taipei").startOf("day").toISOString();
  }
  if (to) {
    params.end = moment.tz(to, "Asia/Taipei").endOf("day").toISOString();
  }
  return params;
};

// 定義 Stat component 為一個 React Function Component，傳入參數的 interface 為 StatProps
const Stat: React.FC = () => {
  // 使用 cookies Hook 取得當前 user
  const [cookies] = useCookies(["user"]);
  const user = cookies.user;

  // 使用 useQuery Hook 取得 URL query string 中的 id
  const query = useQuery();
  const id = query.get("id");

  // 使用 id 來設定 userId 的 state，並設定初始值為 null
  const [userId, setUserId] = useState<string | null>(id || null);

  // userhurt 用來儲存使用者的疼痛指數，userweek 用來儲存使用者的一週內是否疼痛，useryear 用來儲存使用者的一年內是否影響正常生活
  const [userhurt, setUserhurt] = useState<Userhurt[]>([]);
  const [userweek, setUserweek] = useState<Usertime[]>([]);
  const [useryear, setUseryear] = useState<Usertime[]>([]);

  // selectedBodyPart 用來儲存使用者選擇的部位，searchDatefrom 用來儲存使用者選擇的起始日期，searchDateto 用來儲存使用者選擇的結束日期
  const [selectedBodyPart, setSelectedBodyPart] = useState("default");
  const [searchDatefrom, setSearchDatefrom] = useState("");
  const [searchDateto, setSearchDateto] = useState("");

  // 圖表類型根據選取部位判斷
  const chartType = useMemo(
    () => (selectedBodyPart !== "default" ? "line" : "bar"),
    [selectedBodyPart],
  );

  // chartData 用來儲存圖表的資料，包含 labels 和 datasets
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "疼痛指數平均",
        data: [] as number[],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  // showModal 用來控制 Modal 的顯示與隱藏
  const [showModal, setShowModal] = useState(false);

  // handleShow 用來顯示 Modal，handleClose 用來隱藏 Modal
  // Modal 用來提供刪除功能 (僅限 admin)
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // 使用後端API取得使用者的疼痛資料
  const fetchUserhurt = useCallback(
    async (id: string) => {
      try {
        // params 為查詢時間區間
        const params = generateQueryParams(searchDatefrom, searchDateto);
        const { data } = await axios.get(`${API_URL}hurtform/${id}`, {
          params,
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setUserhurt(
          Array.isArray(data)
            ? data
            : Array.isArray(data.data)
              ? data.data
              : [],
        );
      } catch (error) {
        console.error("Error fetching user hurt data:", error);
        setUserhurt([]);
      }
    },
    [searchDatefrom, searchDateto],
  );

  // 使用後端API取得使用者的一週內是否疼痛資料
  const fetchUserweek = useCallback(
    async (id: string) => {
      try {
        const params = generateQueryParams(searchDatefrom, searchDateto);
        const { data } = await axios.get(`${API_URL}weekform/${id}`, {
          params,
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setUserweek(
          Array.isArray(data)
            ? data
            : Array.isArray(data.data)
              ? data.data
              : [],
        );
      } catch (error) {
        console.error("Error fetching user week data:", error);
        setUserweek([]);
      }
    },
    [searchDatefrom, searchDateto],
  );

  // 使用後端API取得使用者的一年內是否影響正常生活資料
  const fetchUseryear = useCallback(
    async (id: string) => {
      try {
        const params = generateQueryParams(searchDatefrom, searchDateto);
        const { data } = await axios.get(`${API_URL}yearform/${id}`, {
          params,
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setUseryear(
          Array.isArray(data)
            ? data
            : Array.isArray(data.data)
              ? data.data
              : [],
        );
      } catch (error) {
        console.error("Error fetching user year data:", error);
        setUseryear([]);
      }
    },
    [searchDatefrom, searchDateto],
  );

  // 若 userId 或 user 更新時，更新 userhurt、userweek、useryear 的資料
  useEffect(() => {
    const fetchUserId = async () => {
      if (!userId && user) {
        const fetchedId = await getIdByUsername(user);
        if (fetchedId) {
          setUserId(fetchedId);
          await Promise.all([
            fetchUserhurt(fetchedId),
            fetchUserweek(fetchedId),
            fetchUseryear(fetchedId),
          ]);
        }
      } else if (userId) {
        await Promise.all([
          fetchUserhurt(userId),
          fetchUserweek(userId),
          fetchUseryear(userId),
        ]);
      }
    };
    fetchUserId();
  }, [userId, user, fetchUserhurt, fetchUserweek, fetchUseryear]);

  // 當圖表相關資料(userhurt, selectedBodyPart, chartType, userweek, useryear)更新時，更新圖表(chartData)
  useEffect(() => {
    // 取得特定部位的疼痛指數，並依時間排序
    const calculatePainData = (data: Userhurt[]) => {
      return data
        .map((item) => ({
          name: item.fill_time,
          pain: item[selectedBodyPart],
        }))
        .sort(
          (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime(),
        );
    };

    // 計算 全部/指定 部位平均疼痛指數
    const calculatePainAverage = (data: Userhurt[], selectedPart: string) => {
      if (selectedPart && selectedPart !== "default") {
        const totalPain = data.reduce(
          (acc, curr) => acc + curr[selectedPart],
          0,
        );
        const averagePain = totalPain / data.length;
        return [
          {
            name:
              bodyParts.find((bp) => bp.value === selectedPart)?.label || "",
            pain: averagePain,
          },
        ];
      } else {
        const partKeys = bodyParts
          .filter((part) => part.value !== "default")
          .map((part) => part.value);
        const averages = partKeys.map((part) => {
          const totalPain = data.reduce((acc, curr) => acc + curr[part], 0);
          const averagePain = totalPain / data.length;
          return {
            name: bodyParts.find((bp) => bp.value === part)?.label || "",
            pain: averagePain,
          };
        });
        return averages;
      }
    };

    const painData = calculatePainAverage(userhurt, selectedBodyPart);
    const individualPainData = calculatePainData(userhurt);

    // 設定長條圖資料
    const barChartData = {
      labels: painData.map((item) => item.name),
      datasets: [
        {
          label: "疼痛指數平均",
          data: painData.map((item) => item.pain),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          yAxisID: "y1",
        },
      ],
    };

    // 設定折線圖資料
    const lineChartData = {
      labels: individualPainData.map((item) =>
        moment(item.name).format("YYYY-MM-DD HH:mm"),
      ),
      datasets: [
        {
          label: "疼痛指數",
          data: individualPainData.map((item) => item.pain),
          fill: false,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(75, 192, 192, 0.6)",
          pointBorderColor: "rgba(75, 192, 192, 1)",
          yAxisID: "y1",
          order: 1,
        },
        {
          label: "一週內是否疼痛",
          type: "bar",
          data: userweek.map((item) =>
            item[selectedBodyPart as keyof Usertime] ? 1 : 0,
          ),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          yAxisID: "y2",
          maxBarThickness: 20,
          barPercentage: 0.5,
          order: 2,
        },
        {
          label: "一年內是否影響正常生活",
          type: "bar",
          data: useryear.map((item) =>
            item[selectedBodyPart as keyof Usertime] ? 1 : 0,
          ),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          yAxisID: "y2",
          maxBarThickness: 20,
          barPercentage: 0.5,
          order: 3,
        },
      ],
    };

    setChartData(chartType === "bar" ? barChartData : lineChartData);
  }, [userhurt, selectedBodyPart, chartType, userweek, useryear]);

  // admin 管理介面刪除使用者疼痛資料
  const handleDelete = async (formId: string) => {
    await Promise.all([
      deleteHurtformById(formId),
      deleteWeekformById(formId),
      deleteYearformById(formId),
    ]);
    if (userId) {
      await Promise.all([
        fetchUserhurt(userId),
        fetchUserweek(userId),
        fetchUseryear(userId),
      ]);
    }
  };

  // 搜尋使用者疼痛資料(即搜尋按鈕的事件處理函式)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId) {
      await Promise.all([
        fetchUserhurt(userId),
        fetchUserweek(userId),
        fetchUseryear(userId),
      ]);
    }
  };

  // 渲染下拉選單
  const renderDropdownItems = (
    parts: typeof bodyParts,
    setSelectedBodyPart: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const categories = Array.from(new Set(parts.map((part) => part.category)));
    return (
      <div className="container-fluid">
        <div className="d-flex flex-row flex-nowrap">
          {/* 對每個分類渲染一個下拉式選單 */}
          {categories.map((category) => (
            <div className="p-2" key={category}>
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id={`dropdown-basic-${category}`}
                >
                  {category}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {parts
                    .filter((part) => part.category === category)
                    .map((part) => (
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

  // 匯出 CSV
  const exportToCSV = async (uid: string) => {
    const user = await getUserById(uid);

    // Convert JSON data to CSV format
    const csvContent = convertToCSV(userhurt);

    // Create blob and download with BOM for Excel compatibility
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `疼痛資料_${user.username}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to convert JSON to CSV
  const convertToCSV = (data: Userhurt[]) => {
    if (!data.length) return "";

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create comprehensive label mapping from bodyParts constants
    const bodyPartsMap = bodyParts.reduce(
      (acc, part) => {
        acc[part.value] = part.label;
        return acc;
      },
      {} as { [key: string]: string },
    );

    // Create CSV header row with Chinese labels
    const labelMap: { [key: string]: string } = {
      id: "ID",
      fill_time: "填寫時間",
      user_id: "使用者ID",
      // Use bodyParts mapping for all body parts
      ...bodyPartsMap,
      // Override any special cases that might differ from bodyParts
      right_knee: "右膝",
      left_knee: "左膝",
      right_ankle: "右踝",
      left_ankle: "左踝",
      right_feet: "右腳",
      left_feet: "左腳",
    };

    const csvHeaders = headers
      .map((header) => labelMap[header] || header)
      .join(",");

    // Create CSV data rows
    const csvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header as keyof Userhurt];
          // Handle dates and special formatting for Excel compatibility
          if (header === "fill_time" && value) {
            // Use Excel-friendly format: MM/DD/YYYY HH:mm:ss
            return moment(value).format("MM/DD/YYYY HH:mm:ss");
          }
          // Escape commas and quotes in values
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || "";
        })
        .join(","),
    );

    return [csvHeaders, ...csvRows].join("\n");
  };

  return (
    <div className="stat">
      <Container>
        <h1>疼痛統計</h1>
        <Navbar expand="lg" className="justify-content-between mt-4">
          <Form
            onSubmit={handleSearch}
            className="d-md-flex w-100 align-items-center form"
            style={{ whiteSpace: "nowrap" }}
          >
            {/* 部位選擇選單 */}
            <div className="d-flex flex-wrap">
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-basic"
                  className="me-5"
                >
                  {bodyParts.find((part) => part.value === selectedBodyPart)
                    ?.label || "選擇部位"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {renderDropdownItems(bodyParts, setSelectedBodyPart)}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="me-3" style={{ width: "120px" }}>
              搜尋時間
            </div>
            {/* 查詢日期設定(from) */}
            <FormControl
              type="date"
              className="me-3"
              value={searchDatefrom}
              onChange={(e) => setSearchDatefrom(e.target.value)}
            />
            <div className="me-3" style={{ width: "30px" }}>
              至
            </div>
            {/* 查詢日期設定(to) */}
            <FormControl
              type="date"
              className="me-3"
              value={searchDateto}
              onChange={(e) => setSearchDateto(e.target.value)}
            />
            {/* 送出表單按鈕 */}
            <Button variant="outline-success" type="submit" className="me-3">
              搜尋
            </Button>
            {/* admin 的管理及匯出 Excel 功能 */}
            {user === "admin" && (
              <>
                {/* 展示互動介面，可刪除疼痛資料 */}
                <Button
                  variant="outline-primary"
                  onClick={handleShow}
                  className="me-2"
                >
                  管理
                </Button>
                {/* 匯出 CSV */}
                <Button
                  variant="outline-primary"
                  onClick={() => exportToCSV(userhurt[0].user_id)}
                  className="me-2"
                >
                  匯出 CSV
                </Button>
              </>
            )}
          </Form>
        </Navbar>

        <div className="chart-container mt-4 p-0" style={{ width: "100%" }}>
          {chartData &&
            // 根據圖表類型渲染不同的圖表
            (chartType === "bar" ? (
              // 長條圖
              <Bar
                data={chartData}
                options={{
                  scales: {
                    y1: {
                      type: "linear",
                      position: "left",
                      beginAtZero: true,
                      max: 10,
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            ) : (
              // 折線圖
              <Line
                data={chartData}
                options={{
                  scales: {
                    y1: {
                      type: "linear",
                      position: "left",
                      beginAtZero: true,
                      max: 10,
                    },
                    y2: {
                      type: "linear",
                      position: "right",
                      beginAtZero: true,
                      display: false,
                      max: 4,
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            ))}
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
                {userhurt.map((uh) => (
                  <tr key={uh.id}>
                    <td className="stat-time-column">
                      {moment(uh.fill_time).format("YYYY-MM-DD HH:mm")}
                    </td>
                    <td className="stat-actions-column">
                      {user === "admin" && (
                        // 刪除按鈕，並使用 handleDelete 函式處理刪除事件
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDelete(uh.id)}
                        >
                          刪除
                        </Button>
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

export default Stat;
