import { useEffect, useRef, useState } from "react";
import Pagination from "../../components/common/Pagination";
import ReactModal from "react-modal";
import axios from "axios";
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

const LearningMaterials = () => {
  const selectRef = useRef();
  const regSelectRef = useRef();
  const fileRef = useRef();

  const title = useRef("");
  const content = useRef("");
  const regDate = useRef("");
  const fileName = useRef("");
  const originName = useRef("");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(-1);

  const [lecList, setLecList] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    searchLecList();
  }, []);

  useEffect(() => {
    searchList();
  }, [lecList]);

  const searchLecList = () => {
    axios.post("/tut/t_learningMaterialsReact").then((res) => {
      setLecList(res.data.lectureList);
    });
  };

  const searchList = (page) => {
    page = page || 1;

    setCurrentPage(page);

    const params = new URLSearchParams();
    params.append("lectureValue", selectRef.current.value);
    params.append("currentPage", page);
    params.append("pageSize", 5);

    axios.post("/tut/tutorLearnMatListReact", params).then((res) => {
      setList(res.data.learningMatList);
      setTotalPage(res.data.totalCount);
    });
  };

  const openDetModal = (data) => {
    const splitName = data.materials_fname.split("_");

    title.current = data.learnTitle;
    content.current = data.learnContent;
    regDate.current = dateFormatting(data.writeDate);
    fileName.current = data.materials_fname;
    originName.current = splitName[splitName.length - 1];

    setIsOpen(true);
    setSelectedId(data.learn_data_id);
  };

  const openRegModal = () => {
    title.current = "";
    content.current = "";
    regDate.current = "";
    fileName.current = "";
    originName.current = "";

    setIsOpen(true);
    setSelectedId(-1);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const dateFormatting = (date) => {
    return Intl.DateTimeFormat("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  const fileDownload = () => {
    const emptyParams = new URLSearchParams();

    axios
      .post(`/tut/fileDownload/${fileName.current}`, emptyParams, {
        responseType: "blob",
      })
      .then((res) => {
        const fileName = res.headers.get("content-disposition").split('"')[1];
        const reader = new FileReader();
        reader.readAsDataURL(new Blob([res.data]));
        reader.onloadend = () => {
          const a = document.createElement("a");
          a.href = reader.result;
          a.setAttribute("download", fileName);
          document.body.appendChild(a);
          a.click();
        };
      });
  };

  const saveMaterial = () => {
    const checkResult = nullcheck([
      { inval: title.current, msg: "제목을 입력해 주세요." },
      { inval: content.current, msg: "내용을 입력해 주세요." },
      { inval: fileRef.current.value, msg: "파일을 추가해 주세요." },
    ]);

    if (!checkResult) return;

    const params = new FormData();
    params.append("lecture_value", regSelectRef.current.value);
    params.append("title", title.current);
    params.append("content", content.current);
    params.append("file", fileRef.current.files[0]);

    axios.post("/tut/saveLearningMaterials.do", params).then((res) => {
      if (res.data) {
        alertAndReload("학습 자료가 등록 되었습니다.");
      } else {
        alert("다시 학습 자료를 등록해주세요.");
      }
    });
  };

  const updateMaterial = () => {
    const checkResult = nullcheck([
      { inval: title.current, msg: "제목을 입력해 주세요." },
      { inval: content.current, msg: "내용을 입력해 주세요." },
    ]);

    if (!checkResult) return;

    const params = new FormData();
    params.append("learnMatId", selectedId);
    params.append("updateLearnTitle", title.current);
    params.append("updateLearnContent", content.current);

    const file = fileRef.current.files[0];

    if (file) {
      params.append("updateFile", file);
    }

    axios.post("/tut/updateLearnMat.do", params).then((res) => {
      if (res.data) {
        alertAndReload("수정이 완료 되었습니다.");
      } else {
        alert("수정을 실패했습니다.");
      }
    });
  };

  const deleteMaterial = () => {
    axios.get(`/tut/deleteLearnMat.do/${selectedId}`).then((res) => {
      if (res.data) {
        alertAndReload("학습자료가 삭제 되었습니다.");
      }
    });
  };

  const alertAndReload = (msg) => {
    alert(msg);
    closeModal();
    searchList(currentPage);
  };

  return (
    <div className="content">
      <p className="Location">
        <a className="btn_set home">메인으로</a>
        <span className="btn_nav bold">학습 관리</span>
        <span className="btn_nav bold">학습 자료</span>
        <a className="btn_set refresh">새로고침</a>
      </p>
      <p className="conTitle">
        <span>학습 자료</span>
        <span className="fr">
          <select ref={selectRef} style={{ width: 150, margin: "0 5px 5px 0" }}>
            {lecList.map((lec) => {
              return (
                <option key={lec.lec_id} value={lec.lec_id}>
                  {lec.lec_name}
                </option>
              );
            })}
          </select>
          <a className="btnType blue pointer" onClick={() => searchList()}>
            <span>검색</span>
          </a>
          <a className="btnType blue pointer" onClick={openRegModal}>
            <span>학습 자료 등록</span>
          </a>
        </span>
      </p>
      <div>
        <table className="col">
          <colgroup>
            <col width="15%" />
            <col width="50%" />
            <col width="35%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">NO</th>
              <th scope="col">제목</th>
              <th scope="col">등록일</th>
            </tr>
          </thead>
          <tbody>
            {totalPage < 1 ? (
              <tr>
                <td colSpan="3">데이터가 존재하지 않습니다.</td>
              </tr>
            ) : (
              list.map((i) => {
                return (
                  <tr key={i.learn_data_id}>
                    <td>{i.learn_data_id}</td>
                    <td>
                      <a className="pointer" onClick={() => openDetModal(i)}>
                        {i.learnTitle}
                      </a>
                    </td>
                    <td>{dateFormatting(i.writeDate)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        pageSize={5}
        blockSize={5}
        onClick={(page) => {
          setCurrentPage(page);
          searchList(page);
        }}
      />
      <ReactModal
        style={modalStyle}
        isOpen={isOpen}
        onRequestClose={closeModal}
        appElement={document.getElementById("app")}
      >
        <div
          className="layerType2"
          style={{ width: 600, position: "relative", fontSize: 12 }}
        >
          <dl>
            <dt>
              <strong>학습자료</strong>
            </dt>
            <dd className="content">
              <table className="row">
                <tbody>
                  {selectedId < 0 && (
                    <tr>
                      <th>
                        강의목록<span className="font_red">*</span>
                      </th>
                      <td>
                        <select ref={regSelectRef} defaultValue={48}>
                          {lecList.map((lec) => {
                            return (
                              <option key={lec.lec_id} value={lec.lec_id}>
                                {lec.lec_name}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <th scope="row">
                      제목<span className="font_red">*</span>
                    </th>
                    <td colSpan="3">
                      <input
                        type="text"
                        className="inputTxt p100"
                        defaultValue={title.current}
                        onBlur={(e) => (title.current = e.target.value)}
                      />
                    </td>
                    <th scope="row">등록일자</th>
                    <td colSpan="3">
                      <input
                        type="text"
                        className="inputTxt p100"
                        defaultValue={regDate.current}
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      자료내용<span className="font_red">*</span>
                    </th>
                    <td colSpan="6">
                      <textarea
                        style={{ border: 0, resize: "none" }}
                        defaultValue={content.current}
                        onBlur={(e) => (content.current = e.target.value)}
                      ></textarea>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      첨부파일<span className="font_red">*</span>
                    </th>
                    <td colSpan="6">
                      <input type="file" ref={fileRef} />
                      {selectedId > 0 && (
                        <div style={{ margin: 5 }}>
                          <a className="pointer" onClick={fileDownload}>
                            {originName.current}
                          </a>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="btn_areaC mt30">
                {selectedId < 0 ? (
                  <a className="btnType blue pointer" onClick={saveMaterial}>
                    <span>저장</span>
                  </a>
                ) : (
                  <>
                    <a
                      className="btnType blue pointer"
                      onClick={updateMaterial}
                    >
                      <span>수정</span>
                    </a>
                    <a
                      className="btnType blue pointer"
                      onClick={deleteMaterial}
                    >
                      <span>삭제</span>
                    </a>
                  </>
                )}
                <a className="btnType gray pointer" onClick={closeModal}>
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

export default LearningMaterials;
