import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isBlank, isNonNegativeNumber, isPositiveInteger, isPositiveNumber } from "../../utils/validation";

const initialState = {
  coupon_name: "",
  discount_type: "amount",
  discount_amount: "",
  remaining_count: "",
  description: "",
  value: "",
  expiry_date: "",
};

const toDateInputValue = (value) => {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
};

export default function Editvoucher() {
  const [state, setState] = useState(initialState);
  const { id_voucher } = useParams();
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

  useEffect(() => {
    axios.get(`/api/getvoucher/${id_voucher}`)
      .then((resp) => {
        const voucher = resp.data[0] || {};
        setState({
          ...initialState,
          ...voucher,
          expiry_date: toDateInputValue(voucher.expiry_date),
        });
      });
  }, [id_voucher]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isBlank(coupon_name) || isBlank(discount_type) || isBlank(discount_amount) || isBlank(remaining_count) || isBlank(value) || isBlank(expiry_date)) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    if (/\s/.test(coupon_name.trim())) {
      toast.error("Mã voucher không được chứa khoảng trắng");
      return;
    }

    if (discount_type === "percent" && (!isPositiveNumber(discount_amount) || Number(discount_amount) > 100)) {
      toast.error("Voucher giảm phần trăm phải có giá trị từ 1 đến 100");
      return;
    }

    if (discount_type === "amount" && !isPositiveNumber(discount_amount)) {
      toast.error("Mức giảm tiền phải lớn hơn 0");
      return;
    }

    if (!isPositiveInteger(remaining_count)) {
      toast.error("Số lượng voucher phải là số nguyên lớn hơn 0");
      return;
    }

    if (!isNonNegativeNumber(value)) {
      toast.error("Giá trị áp dụng phải là số không âm");
      return;
    }

    const today = new Date();
    const expiry = new Date(expiry_date);
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    if (expiry < today) {
      toast.error("Ngày hết hạn không được nhỏ hơn hôm nay");
      return;
    }

    if (window.confirm("Bạn có muốn cập nhật thông tin voucher?")) {
      axios.put(`/api/updatevoucher/${id_voucher}`, {
        coupon_name: coupon_name.trim().toUpperCase(),
        discount_type,
        discount_amount: Number(discount_amount),
        remaining_count: Number(remaining_count),
        description: description.trim(),
        value: Number(value),
        expiry_date,
      })
        .then(() => {
          toast.success("Sửa voucher thành công!");
          setTimeout(() => navigate("/Indexvoucher"), 500);
        })
        .catch((err) => toast.error(err.response?.data || "Không thể cập nhật voucher"));
    }
  };

  return (
    <div>
      <h3 className="mb-0">Sửa voucher</h3>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Mã voucher</label>
            <input type="text" name="coupon_name" onChange={handleInputChange} value={coupon_name || ""} className="form-control" />
          </div>
          <div className="col">
            <label className="form-label">Loại giảm</label>
            <select name="discount_type" onChange={handleInputChange} value={discount_type || "amount"} className="form-control">
              <option value="amount">Giảm tiền</option>
              <option value="percent">Giảm phần trăm</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Mức giảm</label>
            <input type="number" min="0" name="discount_amount" onChange={handleInputChange} value={discount_amount || ""} className="form-control" />
          </div>
          <div className="col">
            <label className="form-label">Số lượng còn lại</label>
            <input type="number" min="0" name="remaining_count" onChange={handleInputChange} value={remaining_count || ""} className="form-control" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Giá trị áp dụng</label>
            <input type="number" min="0" name="value" onChange={handleInputChange} value={value || ""} className="form-control" />
          </div>
          <div className="col">
            <label className="form-label">Ngày hết hạn</label>
            <input type="date" name="expiry_date" onChange={handleInputChange} value={expiry_date || ""} className="form-control" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Mô tả</label>
            <textarea name="description" onChange={handleInputChange} value={description || ""} className="form-control" rows="3" />
          </div>
        </div>

        <div className="row">
          <div className="d-grid">
            <button style={{ marginLeft: "10px" }} type="submit" className="btn btn-warning">Cập nhật</button>
          </div>
        </div>
      </form>
    </div>
  );
}
