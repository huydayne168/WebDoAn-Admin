import React, { Fragment, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, Flip } from "react-toastify";

export default function Indexbanner() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return data;

    return data.filter((item) =>
      [item.title, item.subtitle, item.link_url, item.sort_order]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [data, searchTerm]);

  const loadData = async () => {
    const response = await axios.get("/api/getallbanner");
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteBanner = (id_banner) => {
    if (window.confirm("Bạn có muốn xóa banner này không?")) {
      axios
        .delete(`/api/deletebanner/${id_banner}`)
        .then(() => {
          toast.success("Xóa banner thành công!", {
            position: "top-right",
            autoClose: 2500,
            theme: "light",
            transition: Flip,
          });
          loadData();
        })
        .catch((err) => toast.error(err.response?.data || "Không thể xóa banner"));
    }
  };

  return (
    <Fragment>
      <div className="card shadow mb-4">
        <div className="d-flex align-items-center justify-content-between card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Dữ liệu Banner</h6>
          <Link to="/Createbanner" className="btn btn-primary">
            Thêm banner
          </Link>
        </div>
        <div className="d-flex align-items-center card-header">
          <form className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search">
            <div className="input-group">
              <label htmlFor="banner-search">Tìm kiếm:</label>
              <input
                id="banner-search"
                style={{ marginLeft: "5px" }}
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control form-control-sm"
                placeholder="Nhập tiêu đề, link, thứ tự..."
              />
            </div>
          </form>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Ảnh</th>
                  <th>Tiêu đề</th>
                  <th>Link</th>
                  <th>Thứ tự</th>
                  <th>Trạng thái</th>
                  <th>Sửa</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id_banner}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={item.image_url}
                        alt={item.title || "Banner"}
                        style={{
                          width: "120px",
                          height: "56px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    </td>
                    <td>
                      <b>{item.title}</b>
                      <p className="mb-0 small text-muted">{item.subtitle}</p>
                    </td>
                    <td>{item.link_url}</td>
                    <td>{item.sort_order}</td>
                    <td>{Number(item.is_active) === 1 ? "Hiển thị" : "Ẩn"}</td>
                    <td>
                      <Link
                        to={`/Updatebanner/${item.id_banner}`}
                        className="btn btn-warning"
                      >
                        Sửa
                      </Link>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteBanner(item.id_banner)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
