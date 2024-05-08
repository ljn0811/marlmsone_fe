import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Pagination from "../../components/common/Pagination";
import * as commonjs from "../../components/common/commonfunction.js";




const SamplePage1 = () => {

  let pageSize = 10;
  let blockSize = 5;

  const [currentPage, setCurrentPage] = useState(1);  

  const [searchTitle, setSearchTitle] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");

  const [action, setAction] = useState("");
  const [noticeList, setNoticeList] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);

  const [isRegisterBtn, setIsRegisterBtn] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // 공지사항 상세 조회
  const [noticeNo, setNoticeNo] = useState(0);  
  const [loginID, setLoginID] = useState("");
  const [loginName, setLoginName] = useState("");  
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");

  const [fileyn, setFileyn] = useState("");
  const [selfileyn, setSelfileyn] = useState(false);  
  const [preview, setPreview] = useState("");
  const [attfile, setAttfile] = useState({});
  const [filename, setFilename] = useState("");
  const [disfilename, setDisfilename] = useState("");

  useEffect(() => {
    let today = new Date();

    let yearstr = today.getFullYear().toString(); //년도
    let month = today.getMonth()+1;               //월
    let startdate = today.getDate()-2;            //검색 시작날짜
    let enddate = today.getDate()+1;              //검색 끝날짜
    
    let monthstr = "";
    let startdatestr = "";
    let enddatestr = "";

    monthstr = month<10? "0"+month.toString() : month.toString();
    startdatestr = startdate<10? "0"+startdate.toString() : startdate.toString();
    enddatestr = enddate<10? "0"+enddate.toString() : enddate.toString();
      
    console.log(yearstr + "-" + monthstr + "-" + startdatestr + "~" + enddatestr);
    
    // setSearchStartDate(yearstr + "-" + monthstr + "-" + startdatestr);
    // setSearchEndDate(yearstr + "-" + monthstr + "-" + enddatestr);

    searchList();
  }, []);

  // 공지사항 목록 조회
  const searchList = async (cpage) => {
    console.log("searchList() start");
    
    console.log("searchTitle : " + searchTitle);
    console.log("searchStartDate :" + searchStartDate);
    console.log("searchEndDate : " + searchEndDate);
    console.log("cpage : " + cpage);

    cpage = typeof cpage === "object" ? 1 : cpage || 1;    
    //cpage = cpage || 1;
    setCurrentPage(cpage);
    
    console.log("currentPage : " + currentPage);

    //alert(searchRoomName);
		// var param = {
		// 	searchtitle : $("#searchtitle").val(),
		// 	searchstdate : $("#searchstdate").val(),
		// 	searcheddate : $("#searcheddate").val(),
		// 	cpage : cpage,
		// 	pagesize : pagesize,
		// };
    // callAjax("/notice/noticelist.do", "post", "text", false, param, listcallback);

    let params = new URLSearchParams();
    params.append("searchtitle", searchTitle);
    params.append("searchstdate", searchStartDate);
    params.append("searcheddate", searchEndDate);
    params.append("cpage", cpage);
    params.append("pagesize", pageSize);

    await axios
      .post("/notice/noticelistjson.do", params)
      .then((res) => {
        console.log("searchList() result : " + JSON.stringify(res));        
        console.log("total cnt : " + res.data.listcnt);      

        setTotalCnt(res.data.listcnt);
        setNoticeList(res.data.listdata);
      })
      .catch((err) => {
        console.log("searchList() error : " + err.message);
        alert(err.message);
      });
  }

  // 공지사항 상세 조회
  const noticeDetail = (id) => {
    console.log("noticeDetail() start");
    console.log("noticeNo:::" + id);    

    // var param = {
		// 	notice_id : notice_id
		// }
    // callAjax("/notice/noticeView.do", "get", "json", false, param, getContent);

    let params = new URLSearchParams();
    params.append("notice_id", id);    

    axios
      .post("/notice/noticeView.do", params)
      .then((res) => {
        console.log("noticeDetail() result : " + JSON.stringify(res));

        // result console : {"data":{"selinfo":{
        //      "notice_id":97,"loginID":"admin",
        //      "notice_tit":"테스트- 파일 있는 글 수정 (파일 없앰)",
        //      "notice_con":"파일 없어야됨",
        //      "regdate":"24-04-16","hit":8,
        //      "filename":null,"physicalpath":null,"logicalpath":null,
        //      "filesize":0,"fileext":null,"file_yn":"y","name":"관리자"}}        

        setNoticeNo(id);
        setLoginID(res.data.selinfo.loginID);
        setLoginName(res.data.selinfo.name);
        setNoticeTitle(res.data.selinfo.notice_tit);
        setNoticeContent(res.data.selinfo.notice_con);

        if (res.data.selinfo.filename === "") {
          setPreview("");
          setFileyn(false);
          setAttfile();
          setFilename("");
        }

        setAction("U");
        setIsRegisterBtn(false);
        setModalIsOpen(true);
        // let fileext = res.data.selinfo.fileext;        
      
        // console.log('파일명 : ' + res.data.selinfo.filename);
        // console.log('파일 확장자 : ' + fileext);
        // console.log('파일 크기 : ' + res.data.selinfo.filesize);


      })
      .catch((err) => {
        console.log("noticeDetail() error : " + err.message);
        alert(err.message);
      });
    };

  //       if (res.data.selinfo.filename === '') {
  //         // 파일 미첨부
  //         setPreview(false);
  //         setAttfile([]);


  //       }

  //       if (
  //         fileext === 'jpg' ||
  //         fileext === 'png' ||
  //         fileext === 'gif' ||
  //         fileext === 'jpeg'
  //       ) {
  //         setSelfileyn(true);
  //         attachfileproc('P', id);          
  //       } else {          
  //         setSelfileyn(false);
  //         setPreview(res.data.selinfo.filename);
  //       }
       
  //       setSelfileyn(true);
  //       setFileyn("Y");        
  //       //setPreview(
  //       //  "<img src='" +
  //       //    window.URL.createObjectURL(selfile.files[0]) +
  //       //    "'  style='width: 100px; height: 100px;' />",
  //       //)
  //     //  else {
  //     //   // setPreview('./logo.svg');
  //     //   // setSelfileyn(false);
  //     // }


        
  //     //   // setNoodiceDisplay(true);
  //     // })
  //     // .catch((err) => {
  //     //   console.log("noticeDetail() error : " + err.message);
  //     //   alert(err.message);
  //     // });
  //  })
  

  // // type: P(미리보기), D(다운로드)
  // const attachfileproc = (ptyle, noticeNo) => {
  //   let params = new URLSearchParams();
  //   params.append("notice_id", noticeNo);    

  //   axios
  //     .post("/notice/noticeView.do", params)
  //     .then((res) => {
  //       console.log("result console : " + JSON.stringify(res));

  //       // result console : {"data":{"selinfo":{
  //       //      "notice_id":97,"loginID":"admin",
  //       //      "notice_tit":"테스트- 파일 있는 글 수정 (파일 없앰)",
  //       //      "notice_con":"파일 없어야됨",
  //       //      "regdate":"24-04-16","hit":8,
  //       //      "filename":null,"physicalpath":null,"logicalpath":null,
  //       //      "filesize":0,"fileext":null,"file_yn":"y","name":"관리자"}}        

  //       setSelNoticeNo(id);
  //       setNoticeTitle(res.data.selinfo.notice_tit);
  //       setNoticeContent(res.data.selinfo.notice_con);

  //       let fileext = res.data.selinfo.fileext;        
      
  //       console.log('파일명 : ' + res.data.selinfo.filename);
  //       console.log('파일 확장자 : ' + fileext);
  //       console.log('파일 크기 : ' + res.data.selinfo.filesize);


  // }

  // 공지사항 등록/수정
  const noticeSave = (e) => {
    console.log("noticeSave() start");
    e.preventDefault();

    // let params = new URLSearchParams();
    let params = new FormData();
    params.append("noticeNo", noticeNo);
    params.append("notice_tit", noticeTitle);
    params.append("notice_con", noticeContent);
    params.append("file_yn", fileyn);
    params.append("file", attfile);
    params.append("action", action);

    axios
      .post("/notice/noticeSave.do", params)
      .then((res) => {
        console.log("noticeSave() result : " + JSON.stringify(res));

        alert(res.data.result);

        if (res.data.result === "success") {
          closeModal();
          searchList();        
        }
      })
      .catch((err) => {
        console.log("list error");
        alert(err.message);
      });
  }

  // 공지사항 삭제
  const noticeDelete = (e) => {
    console.log("noticeDelete() start");

    e.preventDefault();

    let params = new URLSearchParams();
    params.append("noticeNo", noticeNo);

    console.log("noticeDelete() params : " + params);

    axios
      .post("/notice/noticeDelete.do", params)
      .then((res) => {
        console.log("noticeDelete() result : " + JSON.stringify(res));        

        if (res.data.success) {
          alert(res.data.msg);
          closeModal();
          searchList();        
        }
      })
      .catch((err) => {
        console.log("noticeDelete() error : " + err.message);
        alert(err.message);
      });
  }
  
  // 공지사항 신규등록 모달 Open
  const registerOpenModal = () => {
    console.log("registerOpenModal() start");

    // 초기화
    setNoticeNo(0);
    setNoticeTitle("");
    setNoticeContent("");
    setPreview();
    setAction("I");
    
    setIsRegisterBtn(true);
    setModalIsOpen(true);
  }

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // 첨부파일 미리보기
  const previewfunc = (e) => {
    let selfile = e.currentTarget;

    console.log('previewfunc() file : ' + selfile.files[0])
    if (selfile.files[0]) {
      setAttfile(selfile.files[0]);
      
      //alert(window.URL.createObjectURL(image.files[0]));
      //this.imgpath = window.URL.createObjectURL(image.files[0]);

      let filePath = selfile.value; //C:\a.jpg
      console.log("previewfunc() filePath : " + filePath);

      //전체경로를 \ 나눔.
      let filePathSplit = filePath.split('\\');

      //전체경로를 \로 나눈 길이.
      let filePathLength = filePathSplit.length;
      //마지막 경로를 .으로 나눔 : a.jpg
      let fileNameSplit = filePathSplit[filePathLength - 1].split('.');
      //파일명 : .으로 나눈 앞부분
      let fileName = fileNameSplit[0];
      //파일 확장자 : .으로 나눈 뒷부분
      let fileExt = fileNameSplit[1];
      //파일 크기
      let fileSize = selfile.files[0].size;

      console.log('previewfunc() 파일 경로 : ' + filePath);
      console.log('previewfunc() 파일명 : ' + fileName);
      console.log('previewfunc() 파일 확장자 : ' + fileExt);
      console.log('previewfunc() 파일 크기 : ' + fileSize);

      if (
        fileExt === 'jpg' ||
        fileExt === 'png' ||
        fileExt === 'gif' ||
        fileExt === 'jpeg'
      ) {        
        const reader = new FileReader();

        reader.readAsDataURL(selfile.files[0]);
        reader.onloadend = () => {
          console.log(reader);
          setPreview(reader.result);
          console.log("previewfunc() reader.result : " + reader.result);          
        }

        setSelfileyn(true);        
        //setPreview(
        //  "<img src='" +
        //    window.URL.createObjectURL(selfile.files[0]) +
        //    "'  style='width: 100px; height: 100px;' />",
        //)
      } else {
        setPreview('./logo.svg');
        setSelfileyn(false);
      }
    }
  }

  const searchstyle = {
    fontsize: "15px",
    fontweight: "bold",
  };

  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <div className="content">
      <p className="Location">
        <a className="btn_set home">메인으로</a>{" "}
        <span className="btn_nav bold">학습지원</span>{" "}
        <span className="btn_nav bold">공지사항</span>{" "}
        <a className="btn_set refresh">새로고침</a>
      </p>

      <p className="conTitle">
        <span>공지사항</span>{" "}
        <span className="fr">
        <span style={searchstyle}>제목</span>
          <input type="text"
              id="searchRoomName"
              name="searchRoomName"
              className="form-control"
              style={{width:150}}
              placeholder=""
              value={searchTitle}
              onChange={(e) => {setSearchTitle(e.target.value)}}/>
          <span style={searchstyle}>기간</span>
          <input type="date"
              id="searchRoomName"
              name="searchRoomName"
              className="form-control"
              style={{width:150}}
              placeholder=""
              value={searchStartDate}
              onChange={(e) => {setSearchStartDate(e.target.value)}}/>
          ~
          <input type="date"
              id="searchRoomName"
              name="searchRoomName"
              className="form-control"
              style={{width:150}}
              placeholder=""
              value={searchEndDate}
              onChange={(e) => {setSearchEndDate(e.target.value)}}/>
          <button className="btn btn-primary"
              name="searchbtn"
              id="searchbtn"              
              onClick={searchList}><span>검색</span>              
          </button>
          <button className="btn btn-primary"
              name="newReg"
              id="newReg"
              onClick={registerOpenModal}><span>신규등록</span>
          </button>
        </span>
      </p>

      <div>
        <b>
          총건수 : {totalCnt} 현재 페이지 번호 : {currentPage}
        </b>
        <table className="col">
          <colgroup>
            <col width="15%" />
            <col width="45%" />
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>등록일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
              { totalCnt === 0 && <tr><td colSpan={5}>조회된 데이터가 없습니다.</td></tr> }
              { totalCnt > 0 && 
                  noticeList.map((item) => {
                    return (
                      <tr key={item.notice_id}>
                        <td className="pointer-cursor"
                            onClick={() => noticeDetail(item.notice_id)}>
                          {item.notice_id}
                        </td>
                        <td>{item.notice_tit}</td>
                        <td>{item.loginID}</td>
                        <td>{item.regdate}</td>
                        <td>{item.hit}</td>
                      </tr>
                    )
                  })
              }
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPage={totalCnt}
          pageSize={pageSize}
          blockSize={blockSize}
          onClick={searchList}
        />
      </div>

      <Modal
        style={modalStyle}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
      >
        <div id="noticeform">
          <p className="conTitle">
            <span>{isRegisterBtn ? "공지사항 등록" : "공지사항 수정"}</span>
          </p>
          <table style={{ width: "550px", height: "350px" }}>
            <colgroup>
              <col style={{ width: '20%' }}/>
              <col style={{ width: '20%' }}/>
              <col style={{ width: '20%' }}/>
              <col style={{ width: '40%' }}/>
            </colgroup>
            <tbody>
              <tr>                
                {!isRegisterBtn && (<th>공지번호</th>)}
                {!isRegisterBtn && (
                <td>            
                  <input type="text"
                         className="form-control input-sm"
                         readOnly={true}
                         value={noticeNo}
                  />
                </td>
                )}
                {!isRegisterBtn && (<th>등록자ID</th>)}
                {!isRegisterBtn && (
                <td>
                  <input type="text"
                         className="form-control input-sm"
                         readOnly={true}
                         value={loginID + "(" + loginName + ")"}
                  />
                </td>
                )}
              </tr>
              <tr>
                <th>제목 <span className="font_red">*</span></th>
                <td colSpan="3">
                  <input type="text"
                         className="form-control input-sm"
                         value={noticeTitle}
                         onChange={(e) => {setNoticeTitle(e.target.value);}}
                  />
                </td>
              </tr>
              <tr>
                <th>내용 <span className="font_red">*</span></th>
                <td colSpan="3">
                  <textarea className="form-control input-sm"
                            cols="40" 
                            rows="5"
                            value={noticeContent}
                            onChange={(e) => {setNoticeContent(e.target.value)}}
                  ></textarea>
                </td>
              </tr>
              <tr>
              <th>첨부파일</th>
                <td>
                  <input type='file'
                         className="form-control input-sm"
                         id='attachfile'
                         onChange={previewfunc}
                         // ref={imgRef}
                  />
                </td>
              </tr>
              <tr>
              <th>미리보기</th>
              <td colSpan="3">
                  {selfileyn && (
                    <img src={preview ? preview : `./logo.svg`}
                         alt='preview'                         
                         className='filepreview'
                         style={{ maxWidth: '150px', maxHeight: '150px' }}
                         // onClick={filePreview}
                    />
                  )}
                  {!selfileyn && disfilename}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="modal-button">
            {isRegisterBtn && (<button className="btn btn-primary mx-2" onClick={noticeSave}> 등록 </button>)}
            {!isRegisterBtn && (<button className="btn btn-primary mx-2" onClick={noticeSave}> 수정 </button>)}
            {!isRegisterBtn && (<button className="btn btn-primary mx-2" onClick={noticeDelete}> 삭제 </button>)}
            <button className="btn btn-primary" onClick={closeModal}> 닫기 </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SamplePage1;