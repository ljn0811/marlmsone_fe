import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../../components/common/Pagination";
import Equipment from "./sampletest5/Equipment";
import ModalLecture from "./sampletest5/ModalLecture";

const SamplePage8 = () => {
  const navigate = useNavigate();
  const searchRoomName = useRef();

  const [currentPage, setCurrentPage] = useState(1);
  const [lecrmList, setLecrmList] = useState([]);
  const [totalcnt, setTotalcnt] = useState(0);

  const [lecrmId, setLecrmId] = useState();
  const [lecrmModalOn, setLecrmModalOn] = useState(false);
  

  const searchstyle = {
    fontsize: "15px",
    fontweight: "bold",
  };

  const searchstylewidth = {
    height: "28px",
    width: "200px",
  };

  useEffect(() => {
    searchLecrmList(currentPage);
  }, [currentPage, lecrmModalOn]);

  // 강의실 목록 조회
  const searchLecrmList = (cpage) => {

    // if (typeof cpage === 'number') {
    //   cpage = cpage || 1;
    // } else {
    //   cpage = 1;
    // }
    cpage = typeof cpage === 'number'? cpage || 1 : 1;
    let params = new URLSearchParams();

    params.append("cpage", cpage);
    params.append("pagesize", 5);
    params.append("searchRoomName", searchRoomName.current.value);

    axios
      .post("/adm/lectureRoomListjson.do", params)
      .then((res) => {
        setTotalcnt(res.data.listcnt);
        setLecrmList(res.data.listdata);
        setCurrentPage(cpage);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // 장비 목록 조회 (URL로 호출)
  const searchEquipList = (lecrmId) => {
    const query = [`id=${lecrmId ?? 0}`];
    navigate(`/dashboard/sampletest/samplepage5?${query}`)
  }

  // 강의실 신규등록 modal open
  const lecrmNew = () => {
    setLecrmId("");
    setLecrmModalOn(true);
  }

  // 강의실 수정 modal open
  const lecrmModify = (id) => {
    setLecrmId(id);
    setLecrmModalOn(true);
  }

  return (
    <div>
      <div>
        <p className="Location">
          <span className="btn_nav bold">시설 관리</span>{" "}
          <span className="btn_nav bold"> 강의실</span>{" "}
        </p>
        <p className="conTitle">
          <span>강의실</span>{" "}
          <span className="fr">
            <span style={searchstyle}>강의실 명 </span>
            <input
              type="text"
              id="searchRoomName"
              name="searchRoomName"
              className="form-control"
              placeholder=""
              style={searchstylewidth}
              ref={searchRoomName}
            />
            <button
              className="btn btn-primary"
              onClick={searchLecrmList}
              name="searchbtn"
              id="searchbtn"
            >
              <span>검색</span>
            </button>
            <button
              className="btn btn-primary"
              onClick={() => lecrmNew()}
              name="newReg"
              id="newReg"
            >
              <span>강의실 신규등록</span>
            </button>
          </span>
        </p>

        {/* 강의실 목록 display */}
        <div>
          <b>
            총건수 : {totalcnt} 현재 페이지 번호 : {currentPage}
          </b>
          <table className="col">
            <colgroup>
              <col width="20%" />
              <col width="15%" />
              <col width="15%" />
              <col width="40%" />
              <col width="15%" />
            </colgroup>
            <thead>
              <tr>
                <th>강의실 명</th>
                <th>강의실 크기</th>
                <th>강의실 자리수</th>
                <th>비고</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {
              totalcnt === 0 && (
                  <tr>
                      <td colSpan="5">데이터가 없습니다.</td>
                  </tr>
              )
            }
            {
                totalcnt > 0 && lecrmList.map((item) => {
                  return (
                    <tr key={item.lecrm_id}>
                      <td
                        className="pointer-cursor"
                        onClick={() => searchEquipList(item.lecrm_id)}
                      >
                        {item.lecrm_name}
                      </td>
                      <td>{item.lecrm_size}</td>
                      <td>{item.lecrm_snum}</td>
                      <td>{item.lecrm_note}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            lecrmModify(item.lecrm_id)
                          }}
                        >
                          수정
                        </button>
                      </td>
                    </tr>
                  );
                })
            }
            </tbody>
          </table>
          <Pagination currentPage={currentPage}
                    totalPage={totalcnt}
                    pageSize={5}
                    blockSize={5}
                    onClick={searchLecrmList}
          />
        </div>{/* End 강의실 목록 display */}
        <Equipment></Equipment>
        {lecrmModalOn ? <ModalLecture modalAction={lecrmModalOn} 
                                      setCurrentPage={setCurrentPage} 
                                      setModalAction={setLecrmModalOn} 
                                      id={lecrmId}></ModalLecture> : null}
      </div>
    </div>
  )
}

export default SamplePage8;