import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const initiaState = {
    ten_san_pham: "",
    gia: "",
    gia_goc: "",
    anh_sanpham: "",
    ma_danh_muc: "",
    mo_ta: "",
    kich_thuoc: "",
    so_luong: "",
    anhhover1: "",
};

export default function Editsp() {
    const [state, setState] = useState(initiaState);
    const [danhmucList, setdanhmucList] = useState([]); // state lưu danh sách

    const [files, setFiles] = useState({ anh_sanpham: null, anhhover1: null });
    const [previews, setPreviews] = useState({
        anh_sanpham: null,
        anhhover1: null,
    });

    const { ten_san_pham, gia, gia_goc, ma_danh_muc, mo_ta } = state;

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

    const { ma_san_pham } = useParams();

    const navigate = useNavigate();

    console.log(state);

    useEffect(() => {
        axios
            .get(`/api/getsp/${ma_san_pham}`)
            .then((resp) => {
                const data = resp.data[0] || {};
                setState({ ...data });
                setPreviews({
                    anh_sanpham: data.anh_sanpham || null,
                    anhhover1: data.anhhover1 || null,
                });
            })
            .catch((err) => console.error(err));
    }, [ma_san_pham]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        setFiles((prev) => ({ ...prev, [type]: file }));
        const objectUrl = URL.createObjectURL(file);
        setPreviews((prev) => ({ ...prev, [type]: objectUrl }));
        // clear any placeholder path in state
        setState((s) => ({ ...s, [type]: "" }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const salePrice = Number(state.gia);
        const originalPrice = Number(state.gia_goc);

        // Kiểm tra bắt buộc các trường quan trọng
        if (
            !state.ten_san_pham ||
            !state.gia ||
            !state.gia_goc ||
            (!files.anh_sanpham && !state.anh_sanpham) ||
            !state.ma_danh_muc
        ) {
            return toast.error("Vui lòng nhập đầy đủ thông tin");
        }

        if (Number.isNaN(salePrice) || Number.isNaN(originalPrice)) {
            return toast.error("Giá bán và giá gốc phải là số hợp lệ.");
        }

        if (originalPrice <= salePrice) {
            return toast.error("Giá gốc phải lớn hơn giá bán.");
        }

        if (!window.confirm("Bạn có muốn cập nhật thông tin?")) return;

        try {
            const formData = new FormData();
            // append text fields
            Object.keys(state).forEach((key) => {
                const val = state[key];
                if (val !== undefined && val !== null && val !== "")
                    formData.append(key, val);
            });

            // append files
            if (files.anh_sanpham)
                formData.append("anh_sanpham", files.anh_sanpham);
            if (files.anhhover1) formData.append("anhhover1", files.anhhover1);

            await axios.put(
                `/api/updatesp/${ma_san_pham}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );

            // Revoke object URLs
            Object.values(previews).forEach((url) => {
                if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
            });

            toast.success("Cập nhật sản phẩm thành công!");
            navigate("/Indexsp");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data || "Lỗi khi cập nhật sản phẩm");
        }
    };

    return (
        <div>
            <h3 class="mb-0">Cập nhật sản phẩm</h3>
            <hr />
            <form onSubmit={handleSubmit} enctype="multipart/form-data">
                <div class="row">
                    <div class="col mb-3">
                        <label class="form-label">Tên sản phẩm</label>
                        <input
                            type="text"
                            name="ten_san_pham"
                            class="form-control"
                            onChange={handleInputChange}
                            placeholder="Tên sản phẩm"
                            value={ten_san_pham || ""}
                        />
                    </div>
                    <div class="col mb-3">
                        <label class="form-label">Giá tiền</label>
                        <input
                            type="text"
                            name="gia"
                            class="form-control"
                            onChange={handleInputChange}
                            placeholder="Giá tiền"
                            value={gia || ""}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col mb-3">
                        <label className="form-label">Giá gốc</label>
                        <input
                            type="text"
                            name="gia_goc"
                            className="form-control"
                            onChange={handleInputChange}
                            placeholder="Giá gốc"
                            value={gia_goc || ""}
                        />
                    </div>
                    <div className="col mb-3">
                        <label className="form-label">Số lượng</label>
                        <input
                            type="text"
                            name="so_luong"
                            className="form-control"
                            onChange={handleInputChange}
                            placeholder="Số lượng"
                            value={state.so_luong || ""}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col mb-3">
                        <label className="form-label">Thông báo</label>
                        <input
                            type="text"
                            name="thongbao"
                            className="form-control"
                            onChange={handleInputChange}
                            value={state.thongbao || ""}
                        />
                    </div>
                    <div className="col mb-3">
                        <label className="form-label">Kích cỡ</label>
                        <input
                            type="text"
                            name="kich_thuoc"
                            className="form-control"
                            onChange={handleInputChange}
                            value={state.kich_thuoc || ""}
                        />
                    </div>
                </div>
                <div className="row">
                    <div class="col mb-3">
                        <label class="form-label">Mô tả</label>
                        <input
                            type="text"
                            name="mo_ta"
                            class="form-control"
                            onChange={handleInputChange}
                            placeholder="Mô tả"
                            value={mo_ta || ""}
                        />
                    </div>
                    <div class="col mb-3">
                        <label class="form-label">Mã danh mục</label>

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

                <div className="row" style={{ alignItems: "center" }}>
                    <div style={{ marginLeft: 10 }}>
                        {(previews.anh_sanpham || state.anh_sanpham) && (
                            <img
                                style={{ borderRadius: "10px" }}
                                src={previews.anh_sanpham || state.anh_sanpham}
                                width="150"
                                height="180"
                                className="img img-responsive"
                                alt="anh_sanpham"
                            />
                        )}
                    </div>
                    <div className="col mb-3">
                        <label className="form-label">Ảnh sản phẩm</label>
                        <input
                            type="file"
                            name="anh_sanpham"
                            accept="image/*"
                            className="form-control"
                            onChange={(e) => handleFileChange(e, "anh_sanpham")}
                        />
                    </div>
                </div>

                <div
                    className="row"
                    style={{ alignItems: "center", marginTop: 12 }}
                >
                    <div style={{ marginLeft: 10 }}>
                        {(previews.anhhover1 || state.anhhover1) && (
                            <img
                                style={{ borderRadius: "10px" }}
                                src={previews.anhhover1 || state.anhhover1}
                                width="150"
                                height="180"
                                className="img img-responsive"
                                alt="anhhover1"
                            />
                        )}
                    </div>
                    <div className="col mb-3">
                        <label className="form-label">Ảnh sản phẩm hover</label>
                        <input
                            type="file"
                            name="anhhover1"
                            accept="image/*"
                            className="form-control"
                            onChange={(e) => handleFileChange(e, "anhhover1")}
                        />
                    </div>
                </div>

                <div class="row">
                    <div class="d-grid">
                        <button
                            style={{ marginLeft: "10px", marginTop: "30px" }}
                            class="btn btn-warning"
                        >
                            Cập nhật
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
