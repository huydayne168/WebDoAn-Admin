import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const initialState = {
  title: "",
  subtitle: "",
  image_url: "",
  link_url: "/product?page=1",
  sort_order: 0,
  is_active: 1,
};

export default function Editbanner() {
  const [state, setState] = useState(initialState);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const { id_banner } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/getbanner/${id_banner}`)
      .then((resp) => {
        const banner = resp.data[0] || {};
        setState({
          title: banner.title || "",
          subtitle: banner.subtitle || "",
          image_url: banner.image_url || "",
          link_url: banner.link_url || "/product?page=1",
          sort_order: banner.sort_order || 0,
          is_active: Number(banner.is_active ?? 1),
        });
      });
  }, [id_banner]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file && !state.image_url) {
      toast.error("Vui lòng chọn ảnh banner hoặc nhập URL ảnh.");
      return;
    }

    const formData = new FormData();
    Object.entries(state).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append("image", file);

    axios
      .put(`/api/updatebanner/${id_banner}`, formData)
      .then(() => {
        toast.success("Cập nhật banner thành công!");
        setTimeout(() => navigate("/Indexbanner"), 500);
      })
      .catch((err) => toast.error(err.response?.data || "Không thể cập nhật banner"));
  };

  return (
    <div>
      <h3 className="mb-0">Sửa banner</h3>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Tiêu đề</label>
            <input
              type="text"
              name="title"
              onChange={handleInputChange}
              value={state.title}
              className="form-control"
            />
          </div>
          <div className="col">
            <label className="form-label">Thứ tự hiển thị</label>
            <input
              type="number"
              name="sort_order"
              onChange={handleInputChange}
              value={state.sort_order}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Mô tả ngắn</label>
            <input
              type="text"
              name="subtitle"
              onChange={handleInputChange}
              value={state.subtitle}
              className="form-control"
            />
          </div>
          <div className="col">
            <label className="form-label">Link khi bấm banner</label>
            <input
              type="text"
              name="link_url"
              onChange={handleInputChange}
              value={state.link_url}
              className="form-control"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">URL ảnh banner</label>
            <input
              type="text"
              name="image_url"
              onChange={handleInputChange}
              value={state.image_url}
              className="form-control"
            />
          </div>
          <div className="col">
            <label className="form-label">Upload ảnh mới</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
        </div>

        {(preview || state.image_url) && (
          <div className="mb-3">
            <img
              src={preview || state.image_url}
              alt="Preview banner"
              style={{
                width: "100%",
                maxWidth: "520px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Trạng thái</label>
            <select
              name="is_active"
              onChange={handleInputChange}
              value={state.is_active}
              className="form-control"
            >
              <option value={1}>Hiển thị</option>
              <option value={0}>Ẩn</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Cập nhật
        </button>
      </form>
    </div>
  );
}
