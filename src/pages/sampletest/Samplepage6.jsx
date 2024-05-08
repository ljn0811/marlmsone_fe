import React, {useState, useEffect, useReducer} from "react";
import axios from "axios";
import Modal from "react-modal";
import Pagination from "../../components/common/Pagination";
import * as commonjs from "../../components/common/commonfunction.js";


const SamplePage6 = () => {

  const pageSize = 5;
  const blockSize = 10;

  const [roomCurrentPage, setRoomCurrentPage] = useState(1);
  const [searchRoomId, setSearchRoomId] = useState(0);
  const [searchRoomName, setSearchRoomName] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [roomTotalCnt, setRoomTotalCnt] = useState(0);

  const [equListDisplay, setEquListDisplay] = useState(false);
  const [equCurrentPage, setEquCurrentPage] = useState(1);
  const [equList, setEquList] = useState([]);
  const [equTotalCnt, setEquTotalCnt] = useState(0); 

  // 강의실 모달
  const [roomModalDisplay, setRoomModalDisplay] = useState(false);
  const [isRoomRegBtn, setIsRoomRegBtn] = useState(false);
  
  const [roomName, setRoomName] = useState("");
  const [roomSize, setRoomSize] = useState(0);
  const [roomSeatNum, setRoomSeatNum] = useState(0);
  const [roomEtc, setRoomEtc] = useState("");
  const [roomAction, setRoomAction] = useState("");

  // 장비 모달
  const [equModalDisplay, setEquModalDisplay] = useState(false);
  const [isEquRegBtn, setIsEquRegBtn] = useState(false);

  const [equId, setEquId] = useState(0);
  const [equName, setEquName] = useState("");
  const [equCnt, setEquCnt] = useState(0);
  const [equEtc, setEquEtc] = useState("");
  const [equAction, setEquAction] = useState("");
  

  useEffect(() => {
    console.log("useEffect");
    searchRoomList();
  }, []);

  useEffect(() => {
    if (searchRoomId !== 0) {
      console.log("searchRoomId useEffect");
      searchEquList();
    }      
  }, [searchRoomId]);

  const changeSearchRoomName = (e) => {
    setSearchRoomName(e.target.value);
  }

  // 강의실 목록 조회
  const searchRoomList = (cpage) => {
    // var param = {
		// 	searchRoomName : $("#searchRoomName").val(),
		// 	cpage : cpage,
		// 	pagesize : pagesize,
		// };
    // callAjax("/adm/lectureRoomList.do", "post", "text", false, param, listCallback);
    // returnmap.put("listdata", listdata);
		// returnmap.put("listcnt", listcnt);

    cpage = typeof cpage === "object" ? 1 : cpage || 1;
    setRoomCurrentPage(cpage);
       
    let params = new URLSearchParams();
    params.append("cpage", cpage);
    params.append("pagesize", pageSize);
    params.append("searchRoomName", searchRoomName);

    axios.post("/adm/lectureRoomListjson.do", params)
        .then((res) => {
          console.log("searchRoomList() result console : " + JSON.stringify(res));

          setRoomTotalCnt(res.data.listcnt);
          setRoomList(res.data.listdata);
        })
        .catch((err) => {
          console.log("searchRoomList() result error : " + err.message);
          alert(err.message);
        });
  };

  // 강의실 정보 상세조회
  const searchRoomDtl = (roomId) => {
    // var param = {
    //   lecrm_id : lecrm_id
    // }
    // callAjax("/adm/lectureRoomDtl.do", "post", "json", false, param, delcallback);

    let params = new URLSearchParams();
    params.append("lecrm_id", roomId);

    axios
      .post("/adm/lectureRoomDtl.do", params)
      .then((res) => {
        console.log("searchRoomDtl result : " + JSON.stringify(res));

        setRoomName(res.data.selinfo.lecrm_name);
        setRoomSize(res.data.selinfo.lecrm_size);
        setRoomSeatNum(res.data.selinfo.lecrm_snum);
        setRoomEtc(res.data.selinfo.lecrm_note);

        setSearchRoomId(roomId);
        setRoomAction("U");
        setIsRoomRegBtn(false);
        setRoomModalDisplay(true);
      })
      .catch((err) => {
        console.log("searchRoomDtl error!!!");
        alert(err.message);
      });
  }; 

  // 강의실 등록/수정
  const saveRoom = () => {
    // var param = {
    //   lecrm_name : $("#lecrm_name").val()
    //   , lecrm_size : $("#lecrm_size").val()
    //   , lecrm_snum : $("#lecrm_snum").val()
    //   , lecrm_note : $("#lecrm_note").val()
    //   , action : $("#action").val() 
    //   , lecrm_id : $("#lecrm_id").val()
    // }
    // callAjax("/adm/lectureRoomSave.do", "post", "json", false, param, savecallback);

    let checkValidation = commonjs.nullcheck([
      { inval: roomName, msg: "강의실 명을 입력해 주세요." },
      { inval: roomSize, msg: "강의실 크기를 입력해 주세요." },
      { inval: roomSeatNum, msg: "강의실 자리수를 입력해 주세요."},
    ]);

    if (!checkValidation) {
      return;
    }

    let params = new URLSearchParams();

    params.append("lecrm_name", roomName);
    params.append("lecrm_size", roomSize);
    params.append("lecrm_snum", roomSeatNum);
    params.append("lecrm_note", roomEtc);
    params.append("action", roomAction);
    params.append("lecrm_id", searchRoomId);

    axios
      .post("/adm/lectureRoomSave.do", params)
      .then((res) => {
        console.log("saveRoom() result : " + JSON.stringify(res));

        if (res.data.result === "S") {
          alert(res.data.resultmsg);
          closeRoomModal();

          if (roomAction === "I") {
            searchRoomList();
          } else {
            searchRoomList(roomCurrentPage);
          }
        } else {
          alert(res.data.resultmsg);
        }
      })
      .catch((err) => {
        console.log("saveRoom() error: " + err.message);
        alert(err.message);
      });
  };

  // 강의실 삭제
  const deleteRoom = () => {
    let params = new URLSearchParams();

    params.append("action", "D");
    params.append("lecrm_id", searchRoomId);

    axios
      .post("/adm/lectureRoomSave.do", params)
      .then((res) => {
        console.log("deleteRoom's result : " + JSON.stringify(res));

        if (res.data.result === "S") {
          alert(res.data.resultmsg);

          closeRoomModal();
          searchRoomList(roomCurrentPage);
        } else {
          alert(res.data.resultmsg);
        }
      })
      .catch((err) => {
        console.log("deleteRoom error!!!");
        alert(err.message);
      });
  };

  // 강의실 신규등록 모달창 open
  const openRoomModal = () => {
    setRoomModalDisplay(true);
    setIsRoomRegBtn(true);

    setRoomName("");
    setRoomSize(0);
    setRoomSeatNum(0);
    setRoomEtc("");
    setRoomAction("I");
  };

  // 강의실 모달창 close
  const closeRoomModal = () => {
    setRoomModalDisplay(false);
  };

  // 장비 목록 조회 (roomId 값 저장)
  const getEquList = (roomId) => {
    // alert("getEquList() roomId : " + roomId);
    setSearchRoomId(roomId);
  }

  // 장비 목록 조회
  const searchEquList = async (cpage) => {    

    cpage = cpage || 1;
    setEquCurrentPage(cpage);
    setEquListDisplay(true);    

    // alert("roomId : " + searchRoomId + ", cpage : " + cpage);

    // var param = {
		// 	lecrm_id : $("#lecrm_id").val()
		// 	, cpage : cpage
		// 	, pagesize : pagesize
		// };
    // callAjax("/adm/equList.do", "post", "text", false, param, listCallback);

    let params = new URLSearchParams();
    params.append("lecrm_id", searchRoomId);
    params.append("cpage", cpage);
    params.append("pagesize", pageSize);

    await axios
      .post("/adm/equListjson.do", params)
      .then((res) => {
        console.log("searchEquList() result console : " + JSON.stringify(res));

        setEquTotalCnt(res.data.listcnt);
        setEquList(res.data.listdata);
      })
      .catch((err) => {
        console.log("searchEquList() result error : " + err.message);
        alert(err.message);
      });
  }

  // 장비 정보 상세조회
  const searchEquDtl = (equId) => {
    // var param = {
    //   equ_id : equ_id
    // }
    // callAjax("/adm/equDtl.do", "post", "json", false, param, dtlCallback);
    setEquId(equId);

    let params = new URLSearchParams();
    params.append("equ_id", equId);

    axios
      .post("/adm/equDtl.do", params)
      .then((res) => {
        console.log("searchEquDtl() result : " + JSON.stringify(res));

        setEquName(res.data.selinfo.equ_name);
        setEquCnt(res.data.selinfo.equ_num);
        setEquEtc(res.data.selinfo.equ_note);

        setEquAction("U");
        setIsEquRegBtn(false);
        setEquModalDisplay(true);
      })
      .catch((err) => {
        console.log("searchEquDtl() error : " + err.message);
        alert(err.message);
      });
  }

  // 장비 등록/수정
  const saveEqu = () => {
		// var param = {
    //   lecrm_id : $("#lecrm_id").val()
    //   , equ_name : $("#equ_name").val()
    //   , equ_num : $("#equ_num").val()
    //   , equ_note : $("#equ_note").val()
    //   , equ_id : $("#equ_id").val()
    //   , action : $("#action").val()
    // }
    // callAjax("/adm/equSave.do", "post", "json", false, param, saveCallback);

    let checkValidation = commonjs.nullcheck([
      { inval: equName, msg: "장비 명을 입력해 주세요." },
      { inval: equCnt, msg: "장비 개수를 입력해 주세요." },      
    ]);

    if (!checkValidation) {
      return;
    }

    let params = new URLSearchParams();

    params.append("lecrm_id", searchRoomId);
    params.append("equ_name", equName);
    params.append("equ_num", equCnt);
    params.append("equ_note", equEtc);
    params.append("equ_id", equId);
    params.append("action", equAction);

    axios
      .post("/adm/equSave.do", params)
      .then((res) => {
        console.log("saveEqu() result : " + JSON.stringify(res));

        if (res.data.result === "S") {
          alert(res.data.resultmsg);
          closeEquModal();

          if (equAction === "I") {
            searchEquList();
          } else {
            searchEquList(equCurrentPage);
          }
        } else {
          alert(res.data.resultmsg);
        }
      })
      .catch((err) => {
        console.log("saveEqu() error : " + err.message);
        alert(err.message);
      });
  }

  // 장비 삭제
  const deleteEqu = () => {
    let params = new URLSearchParams();

    params.append("action", "D");
    params.append("lecrm_id", searchRoomId);
    params.append("equ_id", equId);

    axios
      .post("/adm/equSave.do", params)
      .then((res) => {
        console.log("deleteEqu() result : " + JSON.stringify(res));

        if (res.data.result === "S") {
          alert(res.data.resultmsg);

          closeEquModal();
          searchEquList(equCurrentPage);
        } else {
          alert(res.data.resultmsg);
        }
      })
      .catch((err) => {
        console.log("deleteEqu() error : " + err.message);
        alert(err.message);
      });
  }

  // 장비 신규등록 모달창 open
  const openEquModal = () => {
    if (searchRoomId === 0) {
      alert("강의실을 먼저 선택해 주세요.");
      return;
    }

    setEquAction("I");
    setIsEquRegBtn(true);
    setEquModalDisplay(true);
    
    setEquName("");
    setEquCnt(0);
    setEquEtc("");
  };

  // 장비 모달창 close
  const closeEquModal = () => {    
    setEquModalDisplay(false);
  };  

  const searchstyle = {
    fontsize: "15px",    
    fontweight: "bold",
  };

  const searchstylewidth = {
    height: "28px",
    width: "200px",    
  };

  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      boxShdow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      transform: "translate(-50%, -50%)",
    },
  };


  return (
    <div className="content">
      <p className="Location">
        <a className="btn_set home">메인으로</a>{" "}
        <span className="btn_nav bold">시설 관리</span>{" "}
        <span className="btn_nav bold">강의실</span>{" "}
        <a className="btn_set refresh">새로고침</a>
      </p>

      {/* 강의실 목록 조회 */}
      <p className="conTitle">
        <span>강의실</span>{" "}
        <span className="fr">
          <span style={searchstyle}>강의실 명</span>{" "}
          <input type="text" 
                 className="form-control"
                 id="searchRoomName"
                 name="searchRoomName"
                 placeholder=""
                 style={searchstylewidth}
                 onChange={changeSearchRoomName}/>{" "}
          <button className="btn btn-primary"
                  id="searchbtn"
                  name="searchbtn"
                  onClick={searchRoomList}>
            <span>검색</span>
          </button>{" "}
          <button className="btn btn-primary"
                  id="registerRoomBtn"
                  name="registerRoomBtn"
                  onClick={openRoomModal}>
            <span>강의실 신규등록</span>
          </button>
        </span>
      </p>

      <div>
        <span>총 건수 : {roomTotalCnt} / 현재 페이지 번호 : {roomCurrentPage}</span>
        <table className="col">
          <colgroup>
            <col width="20%"/>
            <col width="15%"/>
            <col width="15%"/>
            <col width="40%"/>
            <col width="15%"/>
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
            {/* 강의실 목록 looping */}
            {
                roomTotalCnt === 0 && (
                  <tr>
                    <td colSpan="5">데이터가 없습니다.</td>
                  </tr>
                )
            }
            {
              roomTotalCnt > 0 && roomList.map((item) => {
                return (
                  <tr key={item.lecrm_id}>
                    <td className="pointer-cursor"
                        onClick={() => {getEquList(item.lecrm_id)}}>
                      {item.lecrm_name}
                    </td>
                    <td>{item.lecrm_size}</td>
                    <td>{item.lecrm_snum}</td>
                    <td>{item.lecrm_note}</td>
                    <td>
                      <button className="btn btn-primary"
                              onClick={() => searchRoomDtl(item.lecrm_id)}>수정</button>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        {/* 강의실 목록 페이징 처리 */}
        {
          roomTotalCnt > 0 && <Pagination currentPage={roomCurrentPage}
                                          totalPage={roomTotalCnt}
                                          pageSize={pageSize}
                                          blockSize={blockSize}
                                          onClick={searchRoomList}/>
        }
        
      </div>

      {/* 장비 목록 조회 */}
      {equListDisplay && (
        <div>
          <p className="conTitle">
            <span>장비 목록</span>
            <span className="fr">
              <button className="btn btn-primary"
                      name="registerEquBtn"
                      id="registerEquBtn"
                      onClick={openEquModal}>
                <span>장비 신규등록</span>
              </button>
            </span>
          </p>

          <div>
            <span>총 건수 : {equTotalCnt} / 현재 페이지 번호 : {equCurrentPage}</span>
            <table className="col">
              <colgroup>
                <col width="20%"/>
                <col width="15%"/>
                <col width="15%"/>
                <col width="40%"/>
                <col width="15%"/>
              </colgroup>
              <thead>
                <tr>
                  <th>강의실 명</th>
                  <th>장비 명</th>
                  <th>장비수</th>
                  <th>비고</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>                
                {/* 장비 목록 looping */}
                {
                  equTotalCnt === 0 && (
                      <tr>
                        <td colSpan="5">데이터가 없습니다.</td>
                      </tr>
                  )
                }
                {
                  equTotalCnt > 0 && equList.map((item) => {
                    return (
                      <tr key={item.equ_id}>
                        <td>{item.lecrm_name}</td>
                        <td>{item.equ_name}</td>
                        <td>{item.equ_num}</td>
                        <td>{item.equ_note}</td>
                        <td>
                          <button className="btn btn-primary"
                                  onClick={() => searchEquDtl(item.equ_id)}>수정</button>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
            {/* 장비 목록 페이징 처리 */}
            {
              equTotalCnt > 0 && <Pagination currentPage={equCurrentPage}
                                             totalPage={equTotalCnt}
                                             pageSize={pageSize}
                                             blockSize={blockSize}
                                             onClick={searchEquList}/>
            }            
          </div>
        </div>
      )}      

      {/* 강의실 모달 */}
      <Modal style={modalStyle}
             isOpen={roomModalDisplay}
             onRequestClose={closeRoomModal}>
        <div id="roomForm">
          <p className="conTitle">
            <span>{isRoomRegBtn? "강의실 등록" : "강의실 수정"}</span>
          </p>
          <table style={{ width: "550px", height: "200px" }}>
            <tr>
              <th>
                강의실 명 <span className="font_red">*</span>
              </th>
              <td colSpan="3">
                <input type="text"
                       className="form-control input-sm"
                       style={{ width: "440px" }}
                       value={roomName}
                       onChange={(e) => {
                        setRoomName(e.target.value);
                       }}/>
              </td>
            </tr>
            <tr>
              <th>
                강의실 크기 <span className="font_red">*</span>
              </th>
              <td>
                <input type="text"
                       className="form-control input-sm"
                       style={{ width: "150px" }}
                       value={roomSize}
                       onChange={(e) => {
                        setRoomSize(e.target.value);
                       }}/>
              </td>
              <th>
                강의실 자릿수 <span className="font_red">*</span>
              </th>
              <td>
                <input type="text"
                       className="form-control input-sm"
                       style={{ width: "150px" }}
                       value={roomSeatNum}
                       onChange={(e) => {
                        setRoomSeatNum(e.target.value);
                       }}/>
              </td>
            </tr>
            <tr>
              <th>비고</th>
              <td colSpan="3">
                <input type="text"
                       className="form-control input-sm"
                       style={{ width: "440px" }}
                       value={roomEtc}
                       onChange={(e) => {
                        setRoomEtc(e.target.value);
                       }}/>
              </td>
            </tr>
          </table>
          <div className="modal-button">
            {isRoomRegBtn && (
                <button className="btn btn-primary mx-2" 
                        onClick={saveRoom}>등록</button>
            )}
            {!isRoomRegBtn && (
                <button className="btn btn-primary mx-2" 
                        onClick={saveRoom}>수정</button>
            )}
            {!isRoomRegBtn && (
              <button className="btn btn-primary mx-2" 
                    onClick={deleteRoom}>삭제</button>
            )}
            <button className="btn btn-primary mx-2" 
                  onClick={closeRoomModal}>닫기</button>
          </div>
        </div>      
      </Modal>
      
      {/* 장비 모달 */}
      <Modal style={modalStyle}
             isOpen={equModalDisplay}
             onRequestClose={closeEquModal}>
        <div id="equForm">
          <p className="conTitle">
            <span>{isEquRegBtn? "장비 등록" : "장비 수정"}</span>
          </p>
          <table style={{ width: "550px", height: "200px" }}>
            <tr>
              <th>
                장비명 <span className="font_red">*</span>
              </th>
              <td>
                <input type="text"
                       className="form-control input-sm"
                       style={{ width: "200px" }}
                       value={equName}
                       onChange={(e) => {
                        setEquName(e.target.value);
                       }}/>
              </td>
              <th>
                장비수 <span className="font_red">*</span>
              </th>
              <td>
                <input type="text"
                       className="form-control input-sm"
                       style={{ width: "150px" }}
                       value={equCnt}
                       onChange={(e) => {
                        setEquCnt(e.target.value);
                       }}/>
              </td>
            </tr>
            <tr>
              <th>비고</th>
              <td colSpan="3">
                <input type="text"
                       className="form-control input-sm"
                       style={{ width: "460px" }}
                       value={equEtc}
                       onChange={(e) => {
                        setEquEtc(e.target.value);
                       }}/>
              </td>
            </tr>
          </table>
          <div className="modal-button">
            {isEquRegBtn && (
                <button className="btn btn-primary mx-2" 
                        onClick={saveEqu}>등록</button>
            )}
            {!isEquRegBtn && (
                <button className="btn btn-primary mx-2" 
                        onClick={saveEqu}>수정</button>
            )}
            {!isEquRegBtn && (
              <button className="btn btn-primary mx-2" 
                    onClick={deleteEqu}>삭제</button>
            )}
            <button className="btn btn-primary mx-2" 
                  onClick={closeEquModal}>닫기</button>
          </div>
        </div>      
      </Modal>      

    </div>    
  );
};

export default SamplePage6;