import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { isBlank, isNonNegativeInteger, isPositiveNumber, isValidImageFile } from "../../utils/validation";

const initiaState = {
    ten_san_pham: "",
    gia: "",
    gia_goc: "",
    mau_sac: "",
    anh_sanpham: "",
    ma_danh_muc: "",
    soluong: "",
    mo_ta: "",
    thuong_hieu: "",
    model: "",
    cong_suat: "",
    dien_ap: "",
    chat_lieu: "",
    kich_thuoc: "",
    trong_luong: "",
    bao_hanh: "",
    xuat_xu: "",
};

export default function Createsp() {
    const [state, setState] = useState(initiaState);
    const [danhmucList, setdanhmucList] = useState([]); // state lưu danh sách
    const [files, setFiles] = useState({ anh_sanpham: null, anhhover1: null });
    const [previews, setPreviews] = useState({
        anh_sanpham: null,
        anhhover1: null,
    });

    const { ten_san_pham, gia, gia_goc, mau_sac, ma_danh_muc, soluong, mo_ta } =
        state;

    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API để lấy danh sách các khoa
        axios
            .get("/api/getalldm")
            .then((response) => {
                setdanhmucList(response.data);
            })
            .catch((error) => {
                console.error(error);
                toast.error("Lỗi khi lấy danh sách khoa");
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const salePrice = Number(gia);
        const originalPrice = Number(gia_goc);

        // Kiểm tra thiếu trường nào thì báo lỗi
        if (
            isBlank(ten_san_pham) ||
            isBlank(gia) ||
            isBlank(gia_goc) ||
            isBlank(mau_sac) ||
            (!files.anh_sanpham && !state.anh_sanpham) ||
            isBlank(ma_danh_muc) ||
            isBlank(soluong) ||
            isBlank(mo_ta)
        ) {
            toast.error("Vui lòng nhập đầy đủ tất cả thông tin sản phẩm.");
            return;
        }

        if (ten_san_pham.trim().length < 2) {
            toast.error("Tên sản phẩm phải có ít nhất 2 ký tự.");
            return;
        }

        if (!isPositiveNumber(gia) || !isPositiveNumber(gia_goc)) {
            toast.error("Giá bán và giá gốc phải là số hợp lệ.");
            return;
        }

        if (originalPrice <= salePrice) {
            toast.error("Giá gốc phải lớn hơn giá bán.");
            return;
        }

        if (!isNonNegativeInteger(soluong)) {
            toast.error("Số lượng phải là số nguyên không âm.");
            return;
        }

        if (mo_ta.trim().length < 5) {
            toast.error("Mô tả phải có ít nhất 5 ký tự.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("so_luong", Number(state.soluong));
            // append text fields
            Object.keys(state).forEach((key) => {
                if (key === "soluong") return;
                if (
                    state[key] !== undefined &&
                    state[key] !== null &&
                    state[key] !== ""
                ) {
                    formData.append(key, state[key]);
                }
            });

            // append files if provided
            if (files.anh_sanpham)
                formData.append("anh_sanpham", files.anh_sanpham);
            if (files.anhhover1) formData.append("anhhover1", files.anhhover1);

            await axios.post("/api/createsp", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setState(initiaState);
            setFiles({ anh_sanpham: null, anhhover1: null });
            setPreviews({ anh_sanpham: null, anhhover1: null });
            toast.success("Thêm sản phẩm thành công!");
            setTimeout(() => navigate("/Indexsp"), 500);
        } catch (err) {
            console.error(err);
            toast.error("Đã xảy ra lỗi khi thêm sản phẩm.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const name = e.target.name;
        if (file) {
            if (!isValidImageFile(file)) {
                toast.error("Ảnh phải là JPG, PNG hoặc WEBP và nhỏ hơn 5MB.");
                e.target.value = "";
                return;
            }
            setFiles((prev) => ({ ...prev, [name]: file }));
            setPreviews((prev) => ({
                ...prev,
                [name]: URL.createObjectURL(file),
            }));
            // clear any placeholder path in state
            setState((s) => ({ ...s, [name]: "" }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    return (
        <div>
            <h3 className="mb-0">Thêm sản phẩm</h3>
            <hr />
            <form onSubmit={handleSubmit} enctype="multipart/form-data">
                <div className="row mb-3">
                    <div className="col">
                        <input
                            type="text"
                            name="ten_san_pham"
                            onChange={handleInputChange}
                            value={ten_san_pham}
                            className="form-control"
                            placeholder="Tên sản phẩm "
                        />
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            name="gia"
                            onChange={handleInputChange}
                            value={gia}
                            className="form-control"
                            placeholder="Giá"
                        />
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            name="gia_goc"
                            onChange={handleInputChange}
                            value={gia_goc}
                            className="form-control"
                            placeholder="Giá gốc"
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <input
                            type="text"
                            name="xuat_xu"
                            onChange={handleInputChange}
                            value={state.xuat_xu}
                            className="form-control"
                            placeholder="Xuất xứ"
                        />
                    </div>

                    <div className="col">
                        <input
                            type="text"
                            name="mau_sac"
                            onChange={handleInputChange}
                            value={mau_sac}
                            className="form-control"
                            placeholder="Màu sắc"
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Ảnh chính</label>
                        <input
                            type="file"
                            name="anh_sanpham"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-control"
                        />
                        {previews.anh_sanpham && (
                            <img
                                src={previews.anh_sanpham}
                                alt="preview"
                                style={{ maxWidth: "150px", marginTop: "8px" }}
                            />
                        )}
                    </div>
                    <div className="col">
                        <label className="form-label">Ảnh hover</label>
                        <input
                            type="file"
                            name="anhhover1"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-control"
                        />
                        {previews.anhhover1 && (
                            <img
                                src={previews.anhhover1}
                                alt="preview hover"
                                style={{ maxWidth: "150px", marginTop: "8px" }}
                            />
                        )}
                    </div>
                    <div className="col">
                        <select
                            name="ma_danh_muc"
                            value={ma_danh_muc}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="">Chọn danh mục</option>
                            {danhmucList.map((danh_muc) => (
                                <option
                                    key={danh_muc.ma_danh_muc}
                                    value={danh_muc.ma_danh_muc}
                                >
                                    {danh_muc.ten_danh_muc}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <input
                            type="text"
                            onChange={handleInputChange}
                            value={soluong}
                            name="soluong"
                            className="form-control"
                            placeholder="Số lượng"
                        />
                    </div>
                    <div className="col">
                        <textarea
                            name="mo_ta"
                            onChange={handleInputChange}
                            value={mo_ta}
                            className="form-control"
                            placeholder="Mô tả"
                        ></textarea>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <input
                            type="text"
                            name="thuong_hieu"
                            onChange={handleInputChange}
                            value={state.thuong_hieu}
                            className="form-control"
                            placeholder="Thương hiệu"
                        />
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            name="model"
                            onChange={handleInputChange}
                            value={state.model}
                            className="form-control"
                            placeholder="Model"
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <input
                            type="text"
                            name="cong_suat"
                            onChange={handleInputChange}
                            value={state.cong_suat}
                            className="form-control"
                            placeholder="Công suất"
                        />
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            name="dien_ap"
                            onChange={handleInputChange}
                            value={state.dien_ap}
                            className="form-control"
                            placeholder="Điện áp"
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <input
                            type="text"
                            name="chat_lieu"
                            onChange={handleInputChange}
                            value={state.chat_lieu}
                            className="form-control"
                            placeholder="Chất liệu"
                        />
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            name="kich_thuoc"
                            onChange={handleInputChange}
                            value={state.kich_thuoc}
                            className="form-control"
                            placeholder="Kích thước"
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <input
                            type="text"
                            name="trong_luong"
                            onChange={handleInputChange}
                            value={state.trong_luong}
                            className="form-control"
                            placeholder="Trọng lượng"
                        />
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            name="bao_hanh"
                            onChange={handleInputChange}
                            value={state.bao_hanh}
                            className="form-control"
                            placeholder="Bảo hành"
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="d-grid">
                        <button
                            style={{ marginLeft: "10px" }}
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
