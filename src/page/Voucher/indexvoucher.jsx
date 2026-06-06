import React, { Fragment, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast, Flip } from "react-toastify";
import { Link } from "react-router-dom";

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("vi-VN");
};

export default function Indexvoucher() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredData = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return data;

    return data.filter((item) =>
      [
        item.coupon_name,
        item.discount_type,
        item.description,
        item.discount_amount,
        item.value,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [data, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const loadData = async () => {
    const response = await axios.get("/api/getallvoucher");
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const deleteVoucher = (id_voucher) => {
    if (window.confirm("Bạn có muốn xóa voucher này không?")) {
      axios.delete(`/api/deletevoucher/${id_voucher}`);
      toast.success("Xóa voucher thành công!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Flip,
      });
      setTimeout(() => loadData(), 500);
    }
  };

  return (
    <Fragment>
      <div className="card shadow mb-4">
        <div className="d-flex align-items-center justify-content-between card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Dữ liệu Voucher</h6>
          <Link to="/Createvoucher" className="btn btn-primary">Thêm voucher</Link>
        </div>
        <div className="d-flex align-items-center card-header">
          <form className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search">
            <div className="input-group">
              <label htmlFor="voucher-search">Tìm kiếm:</label>
              <input
                id="voucher-search"
                style={{ marginLeft: "5px" }}
                type="text"
                onChange={handleSearch}
                className="form-control form-control-sm"
                placeholder="Nhập tên mã, loại giảm, mô tả..."
                aria-label="Search"
              />
            </div>
          </form>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <div>
              <label className="mr-2">Số bản ghi/trang:</label>
              <select
                className="form-control form-control-sm d-inline-block"
                style={{ width: "80px" }}
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã voucher</th>
                  <th>Loại giảm</th>
                  <th>Mức giảm</th>
                  <th>Số lượng</th>
                  <th>Giá trị</th>
                  <th>Hết hạn</th>
                  <th>Chi tiết</th>
                  <th>Sửa</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id_voucher}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{item.coupon_name}</td>
                    <td>{item.discount_type}</td>
                    <td>{item.discount_amount}</td>
                    <td>{item.remaining_count}</td>
                    <td>{item.value}</td>
                    <td>{formatDate(item.expiry_date)}</td>
                    <td><Link to={`/Viewvoucher/${item.id_voucher}`} className="btn btn-primary">Chi tiết</Link></td>
                    <td><Link to={`/Updatevoucher/${item.id_voucher}`} className="btn btn-warning">Sửa</Link></td>
                    <td><button className="btn btn-danger" onClick={() => deleteVoucher(item.id_voucher)}>Xóa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav>
              <ul className="pagination justify-content-center mt-3">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                    &laquo;
                  </button>
                </li>

                {[...Array(totalPages).keys()].map((number) => (
                  <li key={number + 1} className={`page-item ${currentPage === number + 1 ? "active" : ""}`}>
                    <button onClick={() => setCurrentPage(number + 1)} className="page-link">
                      {number + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
