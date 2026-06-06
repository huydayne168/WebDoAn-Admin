import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("vi-VN");
};

export default function Viewvoucher() {
  const [voucher, setVoucher] = useState({});
  const { id_voucher } = useParams();

  useEffect(() => {
    axios.get(`/api/getvoucher/${id_voucher}`)
      .then((resp) => setVoucher({ ...resp.data[0] }));
  }, [id_voucher]);

  return (
    <div>
      <h3 className="mb-0">Thông tin voucher</h3>
      <hr />
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">ID voucher</label>
          <input type="text" className="form-control" value={id_voucher} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Mã voucher</label>
          <input type="text" className="form-control" value={voucher.coupon_name || ""} readOnly />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Loại giảm</label>
          <input type="text" className="form-control" value={voucher.discount_type || ""} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Mức giảm</label>
          <input type="text" className="form-control" value={voucher.discount_amount || ""} readOnly />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Số lượng còn lại</label>
          <input type="text" className="form-control" value={voucher.remaining_count || ""} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Giá trị áp dụng</label>
          <input type="text" className="form-control" value={voucher.value || ""} readOnly />
        </div>
      </div>
      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Ngày hết hạn</label>
          <input type="text" className="form-control" value={formatDate(voucher.expiry_date)} readOnly />
        </div>
        <div className="col mb-3">
          <label className="form-label">Mô tả</label>
          <input type="text" className="form-control" value={voucher.description || ""} readOnly />
        </div>
      </div>
    </div>
  );
}
