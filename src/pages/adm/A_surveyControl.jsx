import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Pagination from "../../components/common/Pagination";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart, Legend, Title, Tooltip } from "chart.js";

Chart.register(ArcElement, Tooltip, Title, Legend);

const ServeyControl = () => {
  const detailSurveyRef = useRef(null);
  const resultSrvyReviewRef = useRef(null);
  const lectureNameRef = useRef(null);
  const tutorNameRef = useRef(null);
  const listReviewContainerRef = useRef(null);
  const srvyPaginationRef = useRef(null);
  const searchInputRef = useRef(null);
  const selectRef = useRef(null);

  const [list, setList] = useState([]);
  const [totalCnt, setTotalCnt] = useState(-1);

  const [detailSrvyList, setDetailSrvyList] = useState([]);
  const [detailSrvyTutorNmList, setDetailSrvyTutorNmList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailCurrentPage, setDetailCurrentPage] = useState(1);
  const [detailTotalPage, setDetailTotalPage] = useState(1);

  const [tutorName, setTutorName] = useState("");

  const [doughnutDatas, setDoughnutDatas] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    searchList(currentPage);
  }, [currentPage]);

  const searchList = (page) => {
    hideRef(detailSurveyRef);
    hideRef(resultSrvyReviewRef);
    hideRef(lectureNameRef);
    hideRef(tutorNameRef);
    hideRef(listReviewContainerRef);

    setDoughnutDatas([]);
    setReviews([]);

    const params = new URLSearchParams();
    params.append("page", page || 1);

    if (selectRef.current.value === "all") {
      params.append("lec_name", searchInputRef.current.value);
      params.append("tutor_name", searchInputRef.current.value);
    } else {
      params.append(selectRef.current.value, searchInputRef.current.value);
    }

    axios.post("/adm/surveyControl.do", params).then((res) => {
      setList(res.data.list);
      setTotalCnt(res.data.totalCnt);
    });
  };

  const dateFormatting = (date) => {
    return Intl.DateTimeFormat("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  const hideRef = (ref) => {
    ref.current.classList.add("hide");
  };

  const showRef = (ref) => {
    ref.current.classList.remove("hide");
  };

  const fLecNmList = (tutorName) => {
    showRef(detailSurveyRef);
    showRef(tutorNameRef);
    showRef(srvyPaginationRef);

    hideRef(lectureNameRef);
    hideRef(resultSrvyReviewRef);
    hideRef(listReviewContainerRef);

    setDetailSrvyList([]);
    setDoughnutDatas([]);
    setTutorName(tutorName);

    lecListNmSearch(tutorName);
  };

  const lecListSearch = (lecId) => {
    showRef(detailSurveyRef);
    showRef(lectureNameRef);

    hideRef(tutorNameRef);
    hideRef(resultSrvyReviewRef);
    hideRef(listReviewContainerRef);
    hideRef(srvyPaginationRef);

    setDetailSrvyTutorNmList([]);
    setDoughnutDatas([]);

    const params = new URLSearchParams();
    params.append("lec_id", lecId);

    axios.post("/adm/detailSrvyList", params).then((res) => {
      setDetailSrvyList(res.data.detailSrvyList);
    });
  };

  const lecListNmSearch = (tutorName, page) => {
    const params = new URLSearchParams();
    params.append("tutor_name", tutorName);
    params.append("cpage", page || 1);
    params.append("pagesize", 5);

    axios.post("/adm/detailTutorNmSrvyList", params).then((res) => {
      setDetailSrvyTutorNmList(res.data.detailSrvyTutorNmList);
      setDetailTotalPage(res.data.detailNmTotalCnt);
    });
  };

  const result = (lecId) => {
    showRef(resultSrvyReviewRef);
    showRef(listReviewContainerRef);

    const params = new URLSearchParams();
    params.append("lec_id", lecId);

    axios.post("/adm/surveyResult", params).then((res) => {
      showChart(res.data);
    });
  };

  const showChart = (data) => {
    const reviews = data.resultList.map((i) => {
      return i.review;
    });

    setReviews(reviews);

    const datas = [];

    data.resultNumList.forEach((d) => {
      const data = {
        labels: [
          "매우 그렇다",
          "그렇다",
          "보통이다",
          "그렇지 않다",
          "매우 그렇지 않다",
        ],
        datasets: [
          {
            label: d.lec_name,
            backgroundColor: [
              "#70fff3",
              "#b3ff70",
              "#fff170",
              "#ffb870",
              "#ff7070",
            ],
            data: [
              d.review_num_5,
              d.review_num_4,
              d.review_num_3,
              d.review_num_2,
              d.review_num_1,
            ],
            borderWidth: 1,
          },
        ],
      };

      datas.push(
        <Doughnut
          data={data}
          options={{
            plugins: {
              title: {
                display: true,
                text: d.que_num + 1 + "번. " + d.que,
              },
            },
            responsive: true,
          }}
        />
      );
    });

    setDoughnutDatas(datas);
  };

  const inputHandler = (e) => {
    if (e.key === "Enter") {
      searchList();
    }
  };

  return (
    <div className="content">
      <p className="Location">
        <a className="btn_set home">메인으로</a>
        <span className="btn_nav bold">학습 관리</span>
        <span className="btn_nav bold">설문조사 관리</span>
        <a className="btn_set refresh">새로고침</a>
      </p>
      <p className="conTitle">
        <span>설문조사 관리</span>
        <span className="fr">
          <select
            className="form-control"
            style={{ padding: "0 4px", width: 72 }}
            ref={selectRef}
          >
            <option value="all">전체</option>
            <option value="lec_name">강의명</option>
            <option value="tutor_name">강사</option>
          </select>
          <input
            type="text"
            className="form-control"
            style={{
              height: "30px",
              width: "200px",
            }}
            ref={searchInputRef}
            onKeyDown={inputHandler}
          />
          <button className="btn btn-primary" onClick={() => searchList()}>
            <span>검색</span>
          </button>
        </span>
      </p>
      <table className="col">
        <colgroup>
          <col width="30%" />
          <col width="30%" />
          <col width="20%" />
          <col width="20%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">강의명</th>
            <th scope="col">강사</th>
            <th scope="col">강의 시작일</th>
            <th scope="col">강의 종료일</th>
          </tr>
        </thead>
        <tbody>
          {totalCnt <= 0 ? (
            <tr>
              <td colSpan="4">
                <div
                  style={{
                    display: "flex",
                    margin: "20px 0px",
                    justifyContent: "center",
                    color: "#8f8f8f",
                  }}
                >
                  해당되는 정보가 없습니다.
                </div>
              </td>
            </tr>
          ) : (
            list.map((i) => {
              return (
                <tr key={i.lec_id}>
                  <td>
                    <span
                      className="pointer"
                      onClick={() => lecListSearch(i.lec_id)}
                    >
                      {i.lec_name}
                    </span>
                  </td>
                  <td>
                    <span
                      className="pointer"
                      onClick={() => fLecNmList(i.tutor_name)}
                    >
                      {i.tutor_name}
                    </span>
                  </td>
                  <td>{dateFormatting(i.start_date)}</td>
                  <td>{dateFormatting(i.end_date)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPage={totalCnt}
        pageSize={5}
        blockSize={5}
        onClick={setCurrentPage}
      />
      <div ref={detailSurveyRef}>
        <p className="conTitle" style={{ marginTop: "100px" }}>
          <span>설문조사 상세</span>
          <span
            ref={lectureNameRef}
            style={{ fontSize: "27px", fontWeight: "bold" }}
          >
            - 강의명
          </span>
          <span
            ref={tutorNameRef}
            style={{ fontSize: "27px", fontWeight: "bold" }}
          >
            - 강사명
          </span>
        </p>
        <table className="col">
          <colgroup>
            <col width="30%" />
            <col width="30%" />
            <col width="20%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">강의명</th>
              <th scope="col">강사</th>
              <th scope="col">설문조사 참여 현황</th>
              <th scope="col">설문조사 결과</th>
            </tr>
          </thead>
          <tbody>
            {detailSrvyList.length > 0 ? (
              detailSrvyList.map((i) => {
                return (
                  <tr key={i.lec_id}>
                    <td>{i.lec_name}</td>
                    <td>{i.tutor_name}</td>
                    <td>{i.survey_percentage}</td>
                    {i.survey_percentage >= 60 ? (
                      <td>
                        <span
                          className="btn btn-primary"
                          onClick={() => result(i.lec_id)}
                        >
                          결과 확인
                        </span>
                      </td>
                    ) : (
                      <td>
                        <span
                          style={{
                            backgroundColor: "gray",
                            padding: "7px 20px 7px 20px",
                            color: "white",
                          }}
                        >
                          확인 불가능
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : detailSrvyTutorNmList.length > 0 ? (
              detailSrvyTutorNmList.map((i) => {
                return (
                  <tr key={i.lec_id}>
                    <td>{i.lec_name}</td>
                    <td>{i.tutor_name}</td>
                    <td>{i.survey_percentage} %</td>
                    {i.survey_percentage >= 60 ? (
                      <td>
                        <span
                          className="btn btn-primary"
                          onClick={() => result(i.lec_id)}
                        >
                          결과 확인
                        </span>
                      </td>
                    ) : (
                      <td>
                        <span
                          style={{
                            backgroundColor: "gray",
                            padding: "7px 20px 7px 20px",
                            color: "white",
                          }}
                        >
                          확인 불가능
                        </span>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5">
                  <div
                    style={{
                      display: "flex",
                      margin: "20px 0px 20px 0px",
                      justifyContent: "center",
                      color: "#8f8f8f",
                    }}
                  >
                    해당되는 정보가 없습니다.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div ref={srvyPaginationRef}>
          <Pagination
            currentPage={detailCurrentPage}
            totalPage={detailTotalPage}
            pageSize={5}
            blockSize={5}
            onClick={(page) => {
              setDetailCurrentPage(page);
              lecListNmSearch(tutorName, page);
            }}
          />
        </div>
      </div>
      <div
        className="doughnut"
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "40px",
        }}
      >
        {doughnutDatas.map((d, index) => {
          return (
            <div style={{ alignSelf: "center" }} key={index}>
              {d}
            </div>
          );
        })}
      </div>
      <p className="conTitle" ref={resultSrvyReviewRef}>
        <span style={{ fontSize: "16px", marginTop: "20px" }}>
          학습 시 불편했던 사항 또는 개선할 사항
        </span>
      </p>
      <div ref={listReviewContainerRef} style={{ padding: "10px 0 50px 0" }}>
        <table className="col">
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">번호</th>
              <th scope="col">리뷰</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServeyControl;
