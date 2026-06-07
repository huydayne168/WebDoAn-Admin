import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isBlank, isValidEmail, isValidVietnamPhone } from '../../utils/validation';

const initiaState = {
    ten_khach_hang:"",
    email:"",
    so_dien_thoai:"",
    dia_chi:""
 };

export default function Editkh() {

const [state, setState] = useState(initiaState);

const{ten_khach_hang , email ,so_dien_thoai ,dia_chi} = state;

const {ma_khach_hang} = useParams();

const  navigate = useNavigate();

useEffect(()=>{
  axios.get(`/api/getkh/${ma_khach_hang}`)
  .then((resp) => setState({...resp.data[0]}));
},[ma_khach_hang]);

const handleInputChange = (e) =>{
  const{name, value} = e.target;
  setState({...state,[name]:value});
}

const handleSubmit = (e) => {
  e.preventDefault();

  if(isBlank(ten_khach_hang) || isBlank(email) || isBlank(so_dien_thoai) || isBlank(dia_chi)){
    toast.error("Vui lòng nhập đầy đủ thông tin");
  } else if (ten_khach_hang.trim().length < 2) {
    toast.error("Tên khách hàng phải có ít nhất 2 ký tự");
  } else if (!isValidEmail(email)) {
    toast.error("Email không hợp lệ");
  } else if (!isValidVietnamPhone(so_dien_thoai)) {
    toast.error("Số điện thoại phải gồm 10 số và bắt đầu bằng 03, 05, 07, 08 hoặc 09");
  } else if (dia_chi.trim().length < 5) {
    toast.error("Địa chỉ phải có ít nhất 5 ký tự");

  } else{
    if(window.confirm("Bạn có muốn cập nhật thông tin  ?")){
      axios.put(`/api/updatekh/${ma_khach_hang}`,{
        ten_khach_hang: ten_khach_hang.trim(),
        email: email.trim(),
        so_dien_thoai: so_dien_thoai.trim(),
        dia_chi: dia_chi.trim()
    }).then(()=>{
      setState({ten_khach_hang:"",email:"",so_dien_thoai:"", dia_chi:""})
    }).catch((err) => toast.error(err.response.data));
    toast.success("Sửa danh mục thành công !")
    setTimeout(() => navigate("/Indexkh"),500);
    }
  }
}

  return (
    <div>
        <h1 className="mb-0">Cập nhật khách hàng</h1>
        <hr />
        <form onSubmit={handleSubmit} enctype="multipart/form-data" method="POST">
            <div className="row">
                <div className="col mb-3">
                    <label className="form-label">Tên khách hàng</label>
                    <input type="text" name="ten_khach_hang" className="form-control" placeholder="Tên khách hàng" onChange={handleInputChange} value={ten_khach_hang || ""}/>
                </div>
                <div className="col mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleInputChange} value={email || ""}/>
                </div>
            </div>
            <div className="row">
                <div className="col mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input type="text" name="so_dien_thoai" className="form-control" placeholder="Số điện thoại" onChange={handleInputChange} value={so_dien_thoai || ""} />
                </div>
                <div className="col mb-3">
                    <label className="form-label">Địa chỉ</label>
                    <input type="text" name="dia_chi" className="form-control" placeholder="Địa chỉ" onChange={handleInputChange} value={dia_chi || ""} />
                </div>

            </div>
            
            <div className="row">
                <div className="d-grid">
                    <button style={{marginLeft: '10px'}} className="btn btn-warning">Cập nhật</button>
                </div>
            </div>
        </form>
    </div>
  )
}
