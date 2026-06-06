import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = {
  ten_san_pham: "",
  so_luong: "",
  ngay_mua: "",
};

export default function Editkhohang() {
  const [state, setState] = useState(initialState);
  const { ten_san_pham, so_luong, ngay_mua } = state;

  const { ma_kho_hang } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/getkhohang/${ma_kho_hang}`)
      .then((resp) => {
        if (resp.data && resp.data[0]) {
          setState({ ...resp.data[0] });
        }
      })
      .catch(() => toast.error("Không tải được dữ liệu"));
  }, [ma_kho_hang]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ten_san_pham || !so_luong || !ngay_mua) {
      toast.error("Vui lòng nhập đủ thông tin");
    } else {
      if (window.confirm("Bạn có muốn cập nhật thông tin?")) {
        axios.put(`/api/updatekhohang/${ma_kho_hang}`, {
          ten_san_pham,
          so_luong,
          ngay_mua,
        })
          .then(() => {
            toast.success("Cập nhật sản phẩm thành công!");
            navigate("/Indexkhohang");
          })
          .catch((err) => toast.error(err.response?.data || "Lỗi server"));
      }
    }
  };

  return (
    <div>
      <h1 className="mb-0">Cập nhật kho hàng</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Tên sản phẩm</label>
            <input
              type="text"
              name="ten_san_pham"
              className="form-control"
              placeholder="Tên sản phẩm"
              onChange={handleInputChange}
              value={ten_san_pham || ""}
            />
          </div>
          <div className="col mb-3">
            <label className="form-label">Ngày mua</label>
            <input
              type="date"
              name="ngay_mua"
              className="form-control"
              onChange={handleInputChange}
              value={ngay_mua || ""}
            />
          </div>
        </div>

        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Số lượng</label>
            <input
              type="number"
              name="so_luong"
              className="form-control"
              placeholder="Số lượng"
              onChange={handleInputChange}
              value={so_luong || ""}
            />
          </div>
        </div>

        <div className="row">
          <div className="d-grid">
            <button
              style={{ marginLeft: '10px', marginTop: '30px' }}
              className="btn btn-warning"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
