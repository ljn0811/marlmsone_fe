import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import ResumeStudentList from "./a_resumeContorol/ResumeStudentList";

const A_reaumeControl = () => {
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [lectureList, setLectureList] = useState([]);
    const [totalCnt, setTotalCnt] = useState(0);
    const pageSize = 5;

    const searchRoomName = useRef();

    const [resumeStudentList, setResumeStudentList] = useState(false);

    useEffect(() => {
        allLectureList(currentPage);
        setResumeStudentList(false);
    }, [currentPage]);

    const allLectureList = (currentPage) => {
        if (typeof currentPage === "number") {
            currentPage = currentPage || 1;
        } else {
            currentPage = 1;
        }
        setCurrentPage(currentPage);

        let params = new URLSearchParams();
        params.append("currentPage", currentPage);
        params.append("pageSize", pageSize);
        params.append("searchRoomName", searchRoomName.current.value);

        axios
            .post("/adm/allLectureListJson.do", params)
            .then((res) => {
                setTotalCnt(res.data.totalCount);
                setLectureList(res.data.lectureList);
                setCurrentPage(currentPage);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const searchResumeStdList = (lec_id) => {
        const query = [`id=${lec_id ?? 0}`];
        navigate(`/dashboard/adm/a_resumeControl?${query}`);
        setResumeStudentList(true);
    };

    return (
        <div className="content">
            <p className="Location">
                <a href="" className="btn_set home">
                    메인으로
                </a>
                <span className="btn_nav bold">취업 관리 / 이력서 관리</span>
                <a href="#" className="btn_set refresh">
                    새로고침
                </a>
            </p>

            <p className="conTitle" id="searcharea">
                <span>강의목록</span>
                <span className="fr" style={{ width: "430px" }}>
                    <strong style={{ fontSize: "16px", marginRight: "5px" }}>
                        강의명
                    </strong>
                    <input
                        type="text"
                        id="lectureValue"
                        name="lectureValue"
                        className="form-control"
                        style={{ width: "300px", marginRight: "5px" }}
                        ref={searchRoomName}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={allLectureList}
                    >
                        검색
                    </button>
                </span>
            </p>

            <div className="divLecture" id="divLecture">
                <table className="col">
                    <caption>caption</caption>
                    <colgroup>
                        <col width="10%" />
                        <col width="30%" />
                        <col width="20%" />
                        <col width="15%" />
                        <col width="25%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="row">강의ID</th>
                            <th scope="row">강의명</th>
                            <th scope="row">담당 강사</th>
                            <th scope="row">수강인원</th>
                            <th scope="row">개강일/종강일</th>
                        </tr>
                    </thead>
                    <tbody id="lectureList">
                        {lectureList.map((item) => {
                            return (
                                <tr key={item.lec_id}>
                                    <td>{item.lec_id}</td>
                                    <td
                                        onClick={() => {
                                            searchResumeStdList(item.lec_id);
                                        }}
                                    >
                                        {item.lec_name}
                                    </td>
                                    <td>{item.tutor_id}</td>
                                    <td>{item.pre_pnum}</td>
                                    <td>{item.lectureDate}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPage={totalCnt}
                pageSize={pageSize}
                blockSize={5}
                onClick={allLectureList}
            />
            {resumeStudentList && <ResumeStudentList></ResumeStudentList>}
        </div>
    );
};

export default A_reaumeControl;
