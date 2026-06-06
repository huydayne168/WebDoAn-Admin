import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialState = {
  coupon_name: "",
  discount_type: "amount",
  discount_amount: "",
  remaining_count: "",
  description: "",
  value: "",
  expiry_date: "",
};

export default function Createvoucher() {
  const [state, setState] = useState(initialState);
  const navigate = useNavigate();

  const {
    coupon_name,
    discount_type,
    discount_amount,
    remaining_count,
    description,
    value,
    expiry_date,
  } = state;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!coupon_name || !discount_type || !discount_amount || !remaining_count || !value || !expiry_date) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    axios.post("/api/createvoucher", {
      coupon_name,
      discount_type,
      discount_amount,
      remaining_count,
      description,
      value,
      expiry_date,
    })
      .then(() => {
        setState(initialState);
        toast.success("Thêm voucher thành công!");
        setTimeout(() => navigate("/Indexvoucher"), 500);
      })
      .catch((err) => toast.error(err.response?.data || "Không thể thêm voucher"));
  };

  return (
    <div>
      <h3 className="mb-0">Thêm voucher</h3>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Mã voucher</label>
            <input type="text" name="coupon_name" onChange={handleInputChange} value={coupon_name} className="form-control" placeholder="VD: PIZZA100K" />
          </div>
          <div className="col">
            <label className="form-label">Loại giảm</label>
            <select name="discount_type" onChange={handleInputChange} value={discount_type} className="form-control">
              <option value="amount">Giảm tiền</option>
              <option value="percent">Giảm phần trăm</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Mức giảm</label>
            <input type="number" min="0" name="discount_amount" onChange={handleInputChange} value={discount_amount} className="form-control" placeholder="VD: 100000 hoặc 20" />
          </div>
          <div className="col">
            <label className="form-label">Số lượng còn lại</label>
            <input type="number" min="0" name="remaining_count" onChange={handleInputChange} value={remaining_count} className="form-control" placeholder="VD: 50" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Giá trị áp dụng</label>
            <input type="number" min="0" name="value" onChange={handleInputChange} value={value} className="form-control" placeholder="VD: 0 hoặc đơn tối thiểu" />
          </div>
          <div className="col">
            <label className="form-label">Ngày hết hạn</label>
            <input type="date" name="expiry_date" onChange={handleInputChange} value={expiry_date} className="form-control" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Mô tả</label>
            <textarea name="description" onChange={handleInputChange} value={description} className="form-control" rows="3" placeholder="Nhập mô tả voucher..." />
          </div>
        </div>

        <div className="row">
          <div className="d-grid">
            <button style={{ marginLeft: "10px" }} type="submit" className="btn btn-primary">Thêm</button>
          </div>
        </div>
      </form>
    </div>
  );
}
