import { useEffect, useRef, useState } from "react";
import Pagination from "../../components/common/Pagination";
import axios from "axios";
import ReactModal from "react-modal";
import { nullcheck } from "../../components/common/commonfunction";

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

const SubmittedWork = () => {
  const appElement = document.getElementById("app");

  const submitContentRef = useRef();
  const submitFileRef = useRef();
  const updateContentRef = useRef();
  const updateFileRef = useRef();

  const [list, setList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [hwkId, setHwkId] = useState(0);

  useEffect(() => {
    searchList();
  }, []);

  const searchList = (page) => {
    page = page || 1;
    setCurrentPage(page);

    const params = new URLSearchParams();
    params.append("cpage", page);
    params.append("pagesize", 5);

    axios.post("/std/submitList", params).then((res) => {
      setList(res.data.listdata);
      setTotalPage(res.data.listcnt);
    });
  };

  const openSubmitModal = (id) => {
    setHwkId(id);
    setIsSubmitOpen(true);
  };

  const openUpdateModal = (id) => {
    setHwkId(id);

    const params = new URLSearchParams();
    params.append("hwk_id", id);

    axios.post("/std/getFile.do", params).then((res) => {
      setFileName(res.data.selinfo.submit_fname);
      setContent(res.data.selinfo.submit_con);
      setIsUpdateOpen(true);
    });
  };

  const closeSubmitModal = () => {
    setHwkId(0);
    setIsSubmitOpen(false);
  };

  const closeUpdateModal = () => {
    setHwkId(0);
    setIsUpdateOpen(false);
  };

  const downloadFile = () => {
    const params = new URLSearchParams();
    params.append("hwk_id", hwkId);

    axios
      .post("/std/submitDownload.do", params, { responseType: "blob" })
      .then((res) => {
        const fileName = res.headers.get("content-disposition").split('"')[1];
        const reader = new FileReader();
        reader.readAsDataURL(res.data);
        reader.onloadend = () => {
          const docUrl = document.createElement("a");
          docUrl.href = reader.result;
          docUrl.setAttribute("download", fileName);
          document.body.appendChild(docUrl);
          docUrl.click();
        };
      });
  };

  const downloadSubmittedFile = (id) => {
    const emptyParams = new URLSearchParams();

    axios
      .post(`/tut/tutorProject/fileDownLoadRes/${id}`, emptyParams, {
        responseType: "blob",
      })
      .then((res) => {
        const fileName = res.headers.get("content-disposition").split('"')[1];
        const reader = new FileReader();
        reader.readAsDataURL(new Blob([res.data]));
        reader.onloadend = () => {
          const docUrl = document.createElement("a");
          docUrl.href = reader.result;
          docUrl.setAttribute("download", fileName);
          document.body.appendChild(docUrl);
          docUrl.click();
        };
      });
  };

  const submit = () => {
    const checkresult = nullcheck([
      {
        inval: submitContentRef.current.value,
        msg: "내용을 입력해 주세요.",
      },
      { inval: submitFileRef.current.value, msg: "파일을 추가해 주세요." },
    ]);

    if (!checkresult) return;

    const params = new FormData();
    params.append("hwk_id", hwkId);
    params.append("submit_con", submitContentRef.current.value);
    params.append("file", submitFileRef.current.files[0]);

    axios.post("/std/submitSave.do", params).then((res) => {
      if (res.result === "sucess") {
        alert(res.data.msg);
      } else {
        alert(res.data.msg);
      }
      closeSubmitModal();
      searchList();
    });
  };

  const update = () => {
    const checkresult = nullcheck([
      {
        inval: updateContentRef.current.value,
        msg: "내용을 입력해 주세요.",
      },
      { inval: updateFileRef.current.value, msg: "파일을 추가해 주세요." },
    ]);
    if (!checkresult) return;

    const params = new FormData();
    params.append("hwk_id", hwkId);
    params.append("modify_con", updateContentRef.current.value);
    params.append("file", updateFileRef.current.files[0]);

    axios.post("/std/submitModify.do", params).then((res) => {
      if (res.data.result === "sucess") {
        alert(res.data.msg);
      } else {
        alert(res.data.msg);
      }
      closeUpdateModal();
      searchList(currentPage);
    });
  };

  const canSubmit = (start, end) => {
    return new Date(start) < new Date(end);
  };

  return (
    <div className="content">
      <p className="Location">
        <a className="btn_set home">메인으로</a>
        <span className="btn_nav bold">학습 관리</span>
        <span className="btn_nav bold">과제 제출</span>
        <a className="btn_set refresh">새로고침</a>
      </p>
      <p className="conTitle">
        <span>과제 제출</span>
      </p>
      <div>
        <table className="col">
          <colgroup>
            <col width="20%" />
            <col width="30%" />
            <col width="20%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">강의명</th>
              <th scope="col">과제명</th>
              <th scope="col">제출기한</th>
              <th scope="col">다운로드</th>
              <th scope="col">제출</th>
              <th scope="col">제출여부</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan="6">데이터가 존재하지 않습니다.</td>
              </tr>
            ) : (
              list.map((i) => {
                return (
                  <tr key={i.hwk_id}>
                    <td>{i.lec_name}</td>
                    <td>{i.hwk_name}</td>
                    <td>{i.dead}</td>
                    <td>
                      <span
                        className="pointer"
                        onClick={() => downloadSubmittedFile(i.hwk_id)}
                      >
                        다운
                      </span>
                    </td>
                    {i.yn === "n" ? (
                      <>
                        <td>
                          {canSubmit(i.start, i.dead) ? (
                            <span
                              className="pointer"
                              onClick={() => openSubmitModal(i.hwk_id)}
                            >
                              제출
                            </span>
                          ) : (
                            <span>제출</span>
                          )}
                        </td>
                        <td>미제출</td>
                      </>
                    ) : (
                      <>
                        <td>
                          {canSubmit(i.start, i.dead) ? (
                            <span
                              className="pointer"
                              onClick={() => openUpdateModal(i.hwk_id)}
                            >
                              수정
                            </span>
                          ) : (
                            <span>수정</span>
                          )}
                        </td>
                        <td>제출완료</td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="paging_area">
          <Pagination
            currentPage={currentPage}
            totalPage={totalPage}
            pageSize={5}
            blockSize={5}
            onClick={searchList}
          />
        </div>
      </div>
      <ReactModal
        style={modalStyle}
        isOpen={isSubmitOpen}
        onRequestClose={closeSubmitModal}
        appElement={appElement}
      >
        <div
          className="layerType2"
          style={{ width: 600, position: "relative" }}
        >
          <dl>
            <dt>
              <strong>과제제출</strong>
            </dt>
            <dd className="content">
              <table className="row">
                <colgroup>
                  <col width="120px" />
                  <col width="*" />
                  <col width="120px" />
                  <col width="*" />
                </colgroup>
                <tbody>
                  <tr>
                    <th scope="row">
                      내용 <span className="font_red"></span>
                    </th>
                    <td colSpan="3">
                      <textarea
                        cols="40"
                        rows="5"
                        ref={submitContentRef}
                      ></textarea>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      파일 <span className="font_red"></span>
                    </th>
                    <td colSpan="3">
                      <input type="file" ref={submitFileRef} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="btn_areaC mt30">
                <a
                  className="btnType blue"
                  style={{ cursor: "pointer" }}
                  onClick={submit}
                >
                  <span>등록</span>
                </a>
                <a
                  className="btnType gray"
                  style={{ cursor: "pointer" }}
                  onClick={closeSubmitModal}
                >
                  <span>취소</span>
                </a>
              </div>
            </dd>
          </dl>
        </div>
      </ReactModal>
      <ReactModal
        style={modalStyle}
        isOpen={isUpdateOpen}
        onRequestClose={closeUpdateModal}
        appElement={appElement}
      >
        <div
          className="layerType2"
          style={{ width: 600, position: "relative" }}
        >
          <dl>
            <dt>
              <strong>과제수정</strong>
            </dt>
            <dd className="content">
              <table className="row">
                <colgroup>
                  <col width="120px" />
                  <col width="*" />
                  <col width="120px" />
                  <col width="*" />
                </colgroup>
                <tbody>
                  <tr>
                    <th scope="row">제출파일</th>
                    <td colSpan="3">
                      <a onClick={downloadFile}>
                        <span className="pointer">{fileName}</span>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      내용 <span className="font_red">*</span>
                    </th>
                    <td colSpan="3">
                      <textarea
                        cols="40"
                        rows="5"
                        defaultValue={content}
                        ref={updateContentRef}
                      ></textarea>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      파일 <span className="font_red">*</span>
                    </th>
                    <td colSpan="3">
                      <input type="file" ref={updateFileRef} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="btn_areaC mt30">
                <a
                  className="btnType blue"
                  style={{ cursor: "pointer" }}
                  onClick={update}
                >
                  <span>수정</span>
                </a>
                <a
                  className="btnType gray"
                  style={{ cursor: "pointer" }}
                  onClick={closeUpdateModal}
                >
                  <span>취소</span>
                </a>
              </div>
            </dd>
          </dl>
        </div>
      </ReactModal>
    </div>
  );
};

export default SubmittedWork;
