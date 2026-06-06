import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = {
  ten_san_pham: "",
  so_luong: "",
  ngay_mua: "",
};

export default function Createkhohang() {
  const [state, setState] = useState(initialState);
  const { ten_san_pham, so_luong, ngay_mua } = state;
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ten_san_pham || !so_luong || !ngay_mua) {
      toast.error("Vui lòng nhập đủ thông tin!");
    } else {
      axios.post("/api/createkhohang", {
        ten_san_pham,
        so_luong,
        ngay_mua,
      })
      .then(() => {
        setState({ ten_san_pham: "", so_luong: "", ngay_mua: "" });
        toast.success("Thêm sản phẩm thành công!");
        setTimeout(() => navigate("/Indexkhohang"), 500);
      })
      .catch((err) => toast.error(err.response?.data || "Lỗi server"));
    }
  };

  return (
    <div>
      <h3 className="mb-0">Thêm sản phẩm vào kho</h3>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <input 
              type="text" 
              name="ten_san_pham" 
              onChange={handleInputChange} 
              value={ten_san_pham} 
              className="form-control" 
              placeholder="Tên sản phẩm" 
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <input 
              type="number" 
              name="so_luong" 
              onChange={handleInputChange} 
              value={so_luong} 
              className="form-control" 
              placeholder="Số lượng" 
            />
          </div>
          <div className="col">
            <input 
              type="date" 
              name="ngay_mua" 
              onChange={handleInputChange} 
              value={ngay_mua} 
              className="form-control" 
              placeholder="Ngày mua" 
            />
          </div>
        </div>

        <div className="row">
          <div className="d-grid">
            <button 
              style={{ marginLeft: '10px' }} 
              type="submit" 
              className="btn btn-primary"
            >
              Thêm
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
