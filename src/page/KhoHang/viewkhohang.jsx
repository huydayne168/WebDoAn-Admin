import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Viewkhohang() {
  const [khohang, setData] = useState({});
  const { ma_kho_hang } = useParams();

  useEffect(() => {
    axios.get(`/api/getkhohang/${ma_kho_hang}`)
      .then((res) => setData({ ...res.data[0] }))
      .catch(() => console.error("Không lấy được dữ liệu"));
  }, [ma_kho_hang]);

  return (
    <div>
      <h3 className="mb-0">Thông tin kho hàng</h3>
      <hr />

      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Mã kho hàng</label>
          <input
            type="text"
            className="form-control"
            value={khohang.ma_kho_hang || ""}
            readOnly
          />
        </div>
        <div className="col mb-3">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            value={khohang.ten_san_pham || ""}
            readOnly
          />
        </div>
      </div>

      <div className="row">
        <div className="col mb-3">
          <label className="form-label">Số lượng</label>
          <input
            type="text"
            className="form-control"
            value={khohang.so_luong || ""}
            readOnly
          />
        </div>
        <div className="col mb-3">
          <label className="form-label">Ngày mua</label>
          <input
            type="text"
            className="form-control"
            value={khohang.ngay_mua || ""}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
