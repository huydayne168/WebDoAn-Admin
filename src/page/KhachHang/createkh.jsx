import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isBlank, isValidEmail, isValidVietnamPhone } from '../../utils/validation';
const initiaState = {
     ten_khach_hang:"",
     email:"",
     so_dien_thoai:"",
     dia_chi:""
  };
export default function Createkh() {
    const [state, setState] = useState(initiaState);

    const{ten_khach_hang , email ,so_dien_thoai ,dia_chi} = state;

    const navigate = useNavigate();

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
          axios.post("/api/createkh",{
            ten_khach_hang: ten_khach_hang.trim(),
            email: email.trim(),
            so_dien_thoai: so_dien_thoai.trim(),
            dia_chi: dia_chi.trim()
          }).then(()=>{setState({ten_khach_hang:"",email:"",so_dien_thoai:"", dia_chi:""})
          
          }).catch((err) => toast.error(err.response.data));
          toast.success("Thêm khách hàng thành công  !")
          setTimeout(() => navigate("/Indexkh"),500);
        }
       
      }
    
      const handleInputChange = (e) =>{
        const{name, value} = e.target;
        setState({...state,[name]:value});
      }

  return (
   <div>
    <h3 className="mb-0">Thêm khách hàng</h3>
    <hr />
    <form onSubmit={handleSubmit}  enctype="multipart/form-data">
        <div className="row mb-3">
            <div className="col">
                <input type="text" name="ten_khach_hang" onChange={handleInputChange} value={ten_khach_hang}  className="form-control" placeholder="Tên khách hàng "/>
            </div>
            <div className="col">
                <input type="text" name="email" onChange={handleInputChange} value={email}  className="form-control" placeholder="Email"/>
            </div>
        </div>
        <div className="row mb-3">
            <div className="col">
                <input type="text" name="so_dien_thoai" onChange={handleInputChange} value={so_dien_thoai}  className="form-control" placeholder="Số điện thoại"/>
            </div>
            <div className="col">
                <input type="text" name="dia_chi" onChange={handleInputChange} value={dia_chi}  className="form-control" placeholder="Địa chỉ"/>
            </div>

        </div>
        <div className="row">
            <div className="d-grid">
                <button style={{marginLeft: '10px'}} type="submit" className="btn btn-primary">Thêm</button>
            </div>
        </div>
    </form>
   </div>
  )
}
