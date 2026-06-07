import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isBlank, isFutureDate, isValidCitizenId, isValidImageFile, isValidVietnamPhone } from '../../utils/validation';

const initiaState = {
   ten_nhan_vien:"",
   gioi_tinh:"",
   ngay_sinh:"",
   dia_chi:"",
   sdt:"",
   cmnd:"",
   anh_nhanvien:""
}

export default function Createnv() {

    const [state , setState] = useState(initiaState);

    const{ten_nhan_vien ,gioi_tinh ,dia_chi ,ngay_sinh ,sdt ,cmnd ,anh_nhanvien } = state;

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const gender = gioi_tinh.trim().toLowerCase();
        if(isBlank(ten_nhan_vien) || isBlank(gioi_tinh) || isBlank(dia_chi) || isBlank(ngay_sinh)  || isBlank(sdt) || isBlank(cmnd) || isBlank(anh_nhanvien)){
            toast.error("Vui lòng nhập đủ thông tin ")
        } else if (ten_nhan_vien.trim().length < 2) {
            toast.error("Tên nhân viên phải có ít nhất 2 ký tự")
        } else if (!["nam", "nữ", "nu", "khác", "khac"].includes(gender)) {
            toast.error("Giới tính chỉ được nhập Nam, Nữ hoặc Khác")
        } else if (isFutureDate(ngay_sinh)) {
            toast.error("Ngày sinh không được lớn hơn ngày hiện tại")
        } else if (dia_chi.trim().length < 5) {
            toast.error("Địa chỉ phải có ít nhất 5 ký tự")
        } else if (!isValidVietnamPhone(sdt)) {
            toast.error("Số điện thoại phải gồm 10 số và bắt đầu bằng 03, 05, 07, 08 hoặc 09")
        } else if (!isValidCitizenId(cmnd)) {
            toast.error("CCCD/CMND phải gồm 9 hoặc 12 chữ số")
        } else{
            axios.post("/api/createnv",{
                ten_nhan_vien: ten_nhan_vien.trim(),
                gioi_tinh: gioi_tinh.trim(),
                dia_chi: dia_chi.trim(),
                ngay_sinh,
                sdt: sdt.trim(),
                cmnd: cmnd.trim(),
                anh_nhanvien
            }).then(()=> {setState({ ten_nhan_vien:"",gioi_tinh:"",ngay_sinh:"", dia_chi:"",sdt:"",cmnd:"",anh_nhanvien:""})})
            .catch((err) => toast.error(err.response.data));
            toast.success("Thêm nhân viên thành công  !")
            setTimeout(() => navigate("/Indexnv"),500);
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!isValidImageFile(file)) {
            toast.error("Ảnh phải là JPG, PNG hoặc WEBP và nhỏ hơn 5MB");
            e.target.value = "";
            return;
        }
        setState({ ...state, anh_nhanvien: `/images/${file.name}` });
      };

    const handleInputChange = (e) =>{
        const{name,value} = e.target;
        setState({...state,[name]:value});
    }

  return (
    <div>
        <h3 class="mb-0">Thêm nhân viên</h3>
        <hr />
        <form onSubmit={handleSubmit}  enctype="multipart/form-data">
    
            <div class="row mb-3">
                <div class="col">
                    <input type="text" name="ten_nhan_vien" onChange={handleInputChange} value={ten_nhan_vien} class="form-control" placeholder="Tên nhân viên "/>
                </div>
                <div class="col">
                    <input type="text" name="gioi_tinh" onChange={handleInputChange} value={gioi_tinh} class="form-control" placeholder="Giới tính"/>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col">
                    <input type="date" name="ngay_sinh" onChange={handleInputChange} value={ngay_sinh} class="form-control" placeholder="Ngày sinh"/>
                </div>
                <div class="col">
                    <input type="text" name="dia_chi" onChange={handleInputChange} value={dia_chi} class="form-control" placeholder="Địa chỉ"/>
                </div>

            </div>
            <div class="row mb-3">
                <div class="col">
                    <input type="text" name="sdt" onChange={handleInputChange} value={sdt} class="form-control" placeholder="Số điện thoại"/>
                </div>
                <div class="col">
                    <input type="text" class="form-control" name="cmnd" onChange={handleInputChange} value={cmnd} placeholder="Căn cước công dân"/>
                </div>
            </div>
            <div class="row mb-3">

                <div class="col">
                    <input type="file" name="anh_nhanvien" onChange={handleFileChange} class="form-control" placeholder="Ảnh nhân viên"/>
                </div>
            </div>

            <div class="row">
                <div class="d-grid">
                    <button style={{marginLeft: '10px'}} type="submit" class="btn btn-primary">Thêm</button>
                </div>
            </div>
        </form>
    </div>
  )
}
