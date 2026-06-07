import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function TaiKhoan() {
  const [data,setData] = useState([]);
          const [currentPage, setCurrentPage] = useState(1);
          const [itemsPerPage, setItemsPerPage] = useState(5);
      
          const indexOfLastItem = currentPage * itemsPerPage;
          const indexOfFirstItem = indexOfLastItem - itemsPerPage;
          const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
          const totalPages = Math.ceil(data.length / itemsPerPage);

  const loadData = async() =>{
      const response = await axios.get("/api/getalltaikhoan");
      setData(response.data);
  };

  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    if (!searchTerm) {
        loadData();
    } else {
        try {
            const response = await axios.get(`/api/searchtk/${searchTerm}`);
            setData(response.data);
        } catch (error) {
            console.error("Error searching data", error);
        }
    }
};


  useEffect(()=>{
      loadData();
  },[]);
  return (
    <div>
        <div class="card shadow mb-4">
        <div class="d-flex align-items-center justify-content-between card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Dữ Liệu Tài Khoản</h6>
            <button type="button" class="btn btn-primary">Thêm tài khoản</button>
        </div>
        <div className="d-flex align-items-center  card-header ">
            <form className="d-none d-sm-inline-block form-inline mr-auto my-2 my-md-0 mw-100 navbar-search">
                    <div className="input-group">
                        <label htmlFor="">Tìm kiếm :</label>
                        <input style={{marginLeft:'5px'}}type="text" onChange={handleSearch} className="form-control form-control-sm" placeholder="nhập dữ liệu tìm kiếm" aria-label="Search" aria-describedby="basic-addon2"/>
                    </div>
                </form>
            </div>
        <div class="card-body">
            <div class="table-responsive">
                
                                                    <div>
                        <label className="mr-2">Số bản ghi/trang:</label>
                        <select
                        className="form-control form-control-sm d-inline-block"
                        style={{ width: "80px" }}
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(parseInt(e.target.value));
                            setCurrentPage(1); // reset về trang đầu
                        }}
                        >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        </select>
                    </div>
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên đăng nhập</th>
                            <th>Chi tiết</th>
                            <th>Sửa</th>
                            <th>Xóa</th>

                        </tr>
                    </thead>

                    <tbody>
                      {currentItems.map((item,index)=>{
                        return(
                        <tr key={item.id}>
                          <td>{index+1}</td>
                          <td>{item.email}</td>
                          <td><button type="button" class="btn btn-primary">Chi Tiết</button></td>
                          <td><button type="button" class="btn btn-warning">Sửa</button></td>
                          <td>
                                  <button type='submit' onclick="deleteConfirm(event)" class='btn btn-danger'>Xóa</button>
                          </td>
                      </tr>)
                      })}
                        
                    </tbody>
                </table>
                                                                        <nav>
                        <ul className="pagination justify-content-center mt-3">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
                                &laquo;
                            </button>
                            </li>

                            {[...Array(totalPages).keys()].map(number => (
                            <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                <button onClick={() => setCurrentPage(number + 1)} className="page-link">
                                {number + 1}
                                </button>
                            </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
                                &raquo;
                            </button>
                            </li>
                        </ul>
                    </nav>
            </div>
        </div>
    </div>
    </div>
  )
}
