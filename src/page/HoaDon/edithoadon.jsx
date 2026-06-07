/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

  const initiaState = {
    ten_khach :"",
    ngay_dat_hang:"",
    tong_tien:"",
    trang_thai:"",
    dia_chi:"",
    ghi_chu:"",
    sdt:"",
    ma_nhan_vien:"",
    loai_thanh_toan:"",
    trang_thai_thanh_toan:""
};

export default function EditHD() {

  const [state, setState] = useState(initiaState);


  const{ten_khach , ngay_dat_hang, tong_tien, trang_thai, dia_chi ,ghi_chu ,sdt,ma_nhan_vien,loai_thanh_toan,trang_thai_thanh_toan } = state;

  const {ma_don_hang} = useParams();

  const navigate = useNavigate();


  useEffect(()=>{
    loadDataNV();
    axios.get(`/api/gethd/${ma_don_hang}`)
    .then((resp) => setState({...resp.data[0]}));
  },[ma_don_hang]);

    const[datanv,setDataNV] = useState([]);

const loadDataNV = async () => {
  try {
    const response = await axios.get("/api/getallnv");
    const data = response.data;

    setDataNV(data); // Gán danh sách nhân viên từ API

    const exists = data.some(nv => nv.ma_nhan_vien === parseInt(state.ma_nhan_vien));
    if (!exists) {
      setState(prev => ({
        ...prev,
        ma_nhan_vien: ''
      }));
    }

  } catch (error) {
    console.error("Lỗi khi load dữ liệu nhân viên:", error);
  }
};


  
  const handleInputChange = (e) =>{
    const{name, value} = e.target;
    setState({...state,[name]:value});
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if(!trang_thai){
      toast.error("Vui lòng nhập đầy đủ thông tin");
  
    } else{
      if(window.confirm("Bạn có muốn cập nhật thông tin  ?")){
            
      axios.put(`/api/updatehd/${ma_don_hang}`,{
       trang_thai,ma_nhan_vien,loai_thanh_toan,trang_thai_thanh_toan
      }).then(()=>{
        setState({trang_thai:""})
      }).catch((err) => toast.error(err.response.data));
      toast.success("Sửa hóa đơn thành công !")
      setTimeout(() => navigate("/Indexhd"),500);
      }

    }
  }
const formatVND = (number) => {
  if (typeof number !== 'number' || isNaN(number)) return '0 ₫';
  return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

  return (
    <div>
      <h3 class="mb-0">Cập nhật đơn hàng</h3>
      <hr />
      <form onSubmit={handleSubmit} enctype="multipart/form-data">
          <div class="row">
              <div class="col mb-3">
                  <label class="form-label">Tên khách hàng</label>
                  <input type="text" name="ten_khach" class="form-control" onChange={handleInputChange} placeholder="Tên khách hàng" value={ten_khach || "" }/>
              </div>
              <div class="col mb-3">
                  <label class="form-label">Số điện thoại</label>
                  <input type="text" name="sdt" class="form-control" onChange={handleInputChange} placeholder="Số điện thoại" value={sdt || ""} />
              </div>
          </div>
          <div class="row">
              <div class="col mb-3">
                  <label class="form-label">Ngày đặt hàng</label>
                  <input type="text" name="ngay_dat_hang" class="form-control" onChange={handleInputChange} placeholder="Ngày đặt hàng" value={ngay_dat_hang?.slice(0, 10) || ""} />
              </div>
              <div class="col mb-3">
              <select
                style={{ marginTop: '31px'}}
                name="trang_thai"
                className="form-control"
                onChange={handleInputChange}
                value={trang_thai}
              >
                <option value="2">Đã Duyệt</option>
                <option value="1">Chưa Duyệt</option>
                <option value="3">Đang giao</option>
                <option value="4">Đã giao thành công</option>

              </select>
              </div>
          </div>
          <div class="row">
              <div class="col mb-3">
                  <label class="form-label">Địa chỉ</label>
                  <input type="text" name="soluong" class="form-control" onChange={handleInputChange} placeholder="Địa chỉ" value={dia_chi || ""} />
              </div>
              <div class="col mb-3">
                  <label class="form-label">Tổng tiền</label>
                  <input type="text" name="ma_danh_muc" class="form-control" onChange={handleInputChange} placeholder="Tổng tiền" value={formatVND(tong_tien) || ""} />
              </div>
          </div>
          <div className='row'>
          
              <div class="col mb-3">
                  <label class="form-label">Mô tả</label>
                  <input type="text" name="ghi_chu" class="form-control" onChange={handleInputChange} placeholder="Ghi chú" value={ghi_chu || ""} />
              </div>
              <div className="col mb-3">
                  <label className="form-label">Nhân viên giao hàng</label>
                  <select
                    name="ma_nhan_vien"
                    className="form-control"
                    onChange={handleInputChange}
                    value={ma_nhan_vien} // hoặc state bạn đang dùng
                  >
                    <option value="">-- Chọn nhân viên --</option>
                    {datanv.map(nv => (
                      <option key={nv.ma_nhan_vien} value={nv.ma_nhan_vien}>
                        {nv.ten_nhan_vien}
                      </option>
                    ))}
                  </select>
                </div>

          </div>

                <div className="row">
                  <div className="col mb-3">
                    <label className="form-label">Trạng thái thanh toán</label>
                    <select
                        name="combined_thanh_toan"
                        className="form-control"
                        value={`${trang_thai_thanh_toan}|${loai_thanh_toan}`}
                        onChange={(e) => {
                        const [trang_thai, loai] = e.target.value.split("|");
                        setState({
                            ...state,
                            trang_thai_thanh_toan: parseInt(trang_thai),
                            loai_thanh_toan: loai
                        });
                        }}
                    >
                        <option value="1|BuyLate">Chưa thanh toán</option>
                        <option value="2|VnPay">Đã thanh toán qua VnPay</option>
                        <option value="2|BuyLate">Đã thanh toán bằng tiền mặt</option>
                    </select>
                    </div>

                </div>
          <div class="row">
              <div class="d-grid">
                  <button style={{marginLeft: '10px', marginTop: '30px'}} class="btn btn-warning">Cập nhật</button>
              </div>
              <div class="d-grid">
                  <button style={{marginLeft: '10px', marginTop: '30px'}} class="btn btn-warning">In Đơn </button>
              </div>
          </div>
      </form>
    </div>
  )
}
