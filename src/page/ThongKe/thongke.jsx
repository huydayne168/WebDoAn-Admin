import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

const ORDER_STATUS_LABELS = {
    1: "Chưa duyệt",
    2: "Đã duyệt",
    3: "Đang giao",
    4: "Đã giao thành công",
};

const PAYMENT_STATUS_LABELS = {
    1: "Chưa thanh toán",
    2: "Đã thanh toán",
};

const STATUS_COLORS = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"];
const PAYMENT_COLORS = ["#e74a3b", "#1cc88a"];

const formatVND = (number) =>
    Number(number || 0).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });

const getOrderTotal = (order) => Number(order.tong_tien || 0);
const isPaidOrder = (order) => Number(order.trang_thai_thanh_toan) === 2;

function StatCard({ title, value, icon, colorClass }) {
    return (
        <div className="col-xl-3 col-md-6 mb-4">
            <div className={`card ${colorClass} shadow h-100 py-2`}>
                <div className="card-body">
                    <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-uppercase mb-1">
                                {title}
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                {value}
                            </div>
                        </div>
                        <div className="col-auto">
                            <i className={`${icon} fa-2x text-gray-300`}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RevenueChart({ data }) {
    const width = 760;
    const height = 280;
    const padding = 34;
    const maxValue = Math.max(...data.map((item) => item.value), 1);
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barGap = 10;
    const barWidth = chartWidth / data.length - barGap;

    const points = data
        .map((item, index) => {
            const x =
                padding +
                index * (chartWidth / data.length) +
                barWidth / 2 +
                barGap / 2;
            const y =
                height -
                padding -
                (item.value / maxValue) * chartHeight;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                    Doanh thu theo tháng
                </h6>
                <span className="small text-muted">
                    Chỉ tính đơn đã thanh toán
                </span>
            </div>
            <div className="card-body">
                <div style={{ width: "100%", overflowX: "auto" }}>
                    <svg
                        width="100%"
                        height="320"
                        viewBox={`0 0 ${width} ${height + 42}`}
                        role="img"
                        aria-label="Biểu đồ doanh thu theo tháng"
                    >
                        {[0, 1, 2, 3].map((line) => {
                            const y =
                                padding + (chartHeight / 3) * line;
                            return (
                                <line
                                    key={line}
                                    x1={padding}
                                    x2={width - padding}
                                    y1={y}
                                    y2={y}
                                    stroke="#eef1f7"
                                />
                            );
                        })}

                        {data.map((item, index) => {
                            const x =
                                padding +
                                index * (chartWidth / data.length) +
                                barGap / 2;
                            const barHeight =
                                (item.value / maxValue) * chartHeight;
                            const y = height - padding - barHeight;

                            return (
                                <g key={item.label}>
                                    <rect
                                        x={x}
                                        y={y}
                                        width={barWidth}
                                        height={barHeight}
                                        rx="6"
                                        fill="#f45222"
                                        opacity="0.86"
                                    />
                                    <text
                                        x={x + barWidth / 2}
                                        y={height - 9}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="#6c757d"
                                    >
                                        {item.label}
                                    </text>
                                </g>
                            );
                        })}

                        <polyline
                            points={points}
                            fill="none"
                            stroke="#4e73df"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {points.split(" ").map((point) => {
                            const [x, y] = point.split(",");
                            return (
                                <circle
                                    key={point}
                                    cx={x}
                                    cy={y}
                                    r="4"
                                    fill="#4e73df"
                                    stroke="#fff"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
}

function DonutChart({ data }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const radius = 74;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                    Trạng thái đơn hàng
                </h6>
            </div>
            <div className="card-body">
                <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center">
                    <svg
                        width="210"
                        height="210"
                        viewBox="0 0 210 210"
                        role="img"
                        aria-label="Biểu đồ trạng thái đơn hàng"
                    >
                        <circle
                            cx="105"
                            cy="105"
                            r={radius}
                            fill="none"
                            stroke="#eef1f7"
                            strokeWidth="24"
                        />
                        {data.map((item, index) => {
                            const dash =
                                total > 0
                                    ? (item.value / total) * circumference
                                    : 0;
                            const segment = (
                                <circle
                                    key={item.label}
                                    cx="105"
                                    cy="105"
                                    r={radius}
                                    fill="none"
                                    stroke={STATUS_COLORS[index]}
                                    strokeWidth="24"
                                    strokeDasharray={`${dash} ${circumference - dash}`}
                                    strokeDashoffset={-offset}
                                    strokeLinecap="round"
                                    transform="rotate(-90 105 105)"
                                />
                            );
                            offset += dash;
                            return segment;
                        })}
                        <text
                            x="105"
                            y="98"
                            textAnchor="middle"
                            fontSize="26"
                            fontWeight="700"
                            fill="#343a40"
                        >
                            {total}
                        </text>
                        <text
                            x="105"
                            y="122"
                            textAnchor="middle"
                            fontSize="12"
                            fill="#858796"
                        >
                            đơn hàng
                        </text>
                    </svg>

                    <div className="ml-lg-4 mt-3 mt-lg-0 w-100">
                        {data.map((item, index) => (
                            <div
                                key={item.label}
                                className="d-flex align-items-center justify-content-between mb-2"
                            >
                                <span className="d-flex align-items-center">
                                    <span
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            background: STATUS_COLORS[index],
                                            display: "inline-block",
                                            marginRight: 8,
                                        }}
                                    ></span>
                                    {item.label}
                                </span>
                                <b>{item.value}</b>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PaymentBars({ data }) {
    const total = Math.max(
        data.reduce((sum, item) => sum + item.value, 0),
        1,
    );

    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                    Thanh toán
                </h6>
            </div>
            <div className="card-body">
                {data.map((item, index) => {
                    const percent = Math.round((item.value / total) * 100);
                    return (
                        <div key={item.label} className="mb-4">
                            <div className="d-flex justify-content-between mb-1">
                                <span>{item.label}</span>
                                <b>{percent}%</b>
                            </div>
                            <div
                                style={{
                                    height: 12,
                                    borderRadius: 999,
                                    background: "#eef1f7",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${percent}%`,
                                        height: "100%",
                                        background: PAYMENT_COLORS[index],
                                        borderRadius: 999,
                                    }}
                                ></div>
                            </div>
                            <div className="small text-muted mt-1">
                                {item.value} đơn
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function Thongke() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customerResponse, orderResponse] = await Promise.all([
                    axios.get("/api/getallkh"),
                    axios.get("/api/getalldonhang"),
                ]);

                setCustomers(Array.isArray(customerResponse.data) ? customerResponse.data : []);
                setOrders(Array.isArray(orderResponse.data) ? orderResponse.data : []);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu thống kê:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const paidOrders = useMemo(() => orders.filter(isPaidOrder), [orders]);

    const doanhThuNam = useMemo(
        () =>
            paidOrders
                .filter(
                    (order) =>
                        new Date(order.ngay_dat_hang).getFullYear() ===
                        currentYear,
                )
                .reduce((sum, order) => sum + getOrderTotal(order), 0),
        [paidOrders, currentYear],
    );

    const doanhThuThang = useMemo(
        () =>
            paidOrders
                .filter((order) => {
                    const orderDate = new Date(order.ngay_dat_hang);
                    return (
                        orderDate.getFullYear() === currentYear &&
                        orderDate.getMonth() === currentMonth
                    );
                })
                .reduce((sum, order) => sum + getOrderTotal(order), 0),
        [paidOrders, currentMonth, currentYear],
    );

    const pendingOrders = useMemo(
        () => orders.filter((order) => Number(order.trang_thai) === 1).length,
        [orders],
    );

    const revenueByMonth = useMemo(
        () =>
            Array.from({ length: 12 }, (_, month) => {
                const value = paidOrders
                    .filter((order) => {
                        const orderDate = new Date(order.ngay_dat_hang);
                        return (
                            orderDate.getFullYear() === currentYear &&
                            orderDate.getMonth() === month
                        );
                    })
                    .reduce((sum, order) => sum + getOrderTotal(order), 0);

                return {
                    label: `T${month + 1}`,
                    value,
                };
            }),
        [paidOrders, currentYear],
    );

    const statusData = useMemo(
        () =>
            Object.entries(ORDER_STATUS_LABELS).map(([status, label]) => ({
                label,
                value: orders.filter(
                    (order) => Number(order.trang_thai) === Number(status),
                ).length,
            })),
        [orders],
    );

    const paymentData = useMemo(
        () =>
            Object.entries(PAYMENT_STATUS_LABELS).map(([status, label]) => ({
                label,
                value: orders.filter(
                    (order) =>
                        Number(order.trang_thai_thanh_toan) === Number(status),
                ).length,
            })),
        [orders],
    );

    return (
        <div>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Thống kê</h1>
                <button
                    type="button"
                    className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                    onClick={() => window.print()}
                >
                    <i className="fas fa-download fa-sm text-white-50"></i>{" "}
                    In dữ liệu
                </button>
            </div>

            {loading ? (
                <div className="card shadow mb-4">
                    <div className="card-body">Đang tải dữ liệu...</div>
                </div>
            ) : (
                <>
                    <div className="row">
                        <StatCard
                            title="Thu nhập tháng này"
                            value={formatVND(doanhThuThang)}
                            icon="fas fa-calendar"
                            colorClass="border-left-primary"
                        />
                        <StatCard
                            title="Thu nhập năm nay"
                            value={formatVND(doanhThuNam)}
                            icon="fas fa-dollar-sign"
                            colorClass="border-left-success"
                        />
                        <StatCard
                            title="Đơn chờ xử lý"
                            value={pendingOrders}
                            icon="fas fa-clipboard-list"
                            colorClass="border-left-warning"
                        />
                        <StatCard
                            title="Tổng số khách hàng"
                            value={customers.length}
                            icon="fas fa-users"
                            colorClass="border-left-info"
                        />
                    </div>

                    <div className="row">
                        <div className="col-xl-8 col-lg-7">
                            <RevenueChart data={revenueByMonth} />
                        </div>
                        <div className="col-xl-4 col-lg-5">
                            <DonutChart data={statusData} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xl-5 col-lg-6">
                            <PaymentBars data={paymentData} />
                        </div>
                        <div className="col-xl-7 col-lg-6">
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        Tổng quan nhanh
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="row text-center">
                                        <div className="col-md-4 mb-3 mb-md-0">
                                            <div className="h4 mb-0 font-weight-bold text-gray-800">
                                                {orders.length}
                                            </div>
                                            <div className="small text-muted">
                                                Tổng đơn hàng
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-3 mb-md-0">
                                            <div className="h4 mb-0 font-weight-bold text-gray-800">
                                                {paidOrders.length}
                                            </div>
                                            <div className="small text-muted">
                                                Đơn đã thanh toán
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="h4 mb-0 font-weight-bold text-gray-800">
                                                {formatVND(
                                                    paidOrders.length
                                                        ? doanhThuNam /
                                                              paidOrders.length
                                                        : 0,
                                                )}
                                            </div>
                                            <div className="small text-muted">
                                                Giá trị đơn trung bình
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
