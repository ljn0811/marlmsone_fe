import React, { useState, useEffect, useRef } from "react";
import { useQueryParam } from "../../../hook/useQueryParam";
import axios from "axios";
import Pagination from "../../../components/common/Pagination";

const ResumeStudentList = () => {
    const queryParam = useQueryParam();
    const searchResumeStdList = queryParam.get("id");

    const [stdList, setStdList] = useState([]);
    const [stdCurrentPage, setStdCurrentPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    const [searchKey, setSearchKey] = useState("");
    const searchValue = useRef();

    useEffect(() => {
        studentList(stdCurrentPage);
    }, [searchResumeStdList]);

    const studentList = (currentPage) => {
        if (typeof currentPage === "number") {
            currentPage = currentPage || 1;
        } else {
            currentPage = 1;
        }
        setStdCurrentPage(currentPage);

        let params = new URLSearchParams();
        params.append("lectureId", searchResumeStdList);
        params.append("currentPage", stdCurrentPage);
        params.append("pageSize", 5);

        params.append("searchKey", searchKey);
        params.append("searchValue", searchValue.current.value);

        axios
            .post("/adm/studentResumeListJson.do", params)
            .then((res) => {
                setTotalCnt(res.data.totalCount);
                setStdList(res.data.studentResumeList);
                setStdCurrentPage(currentPage);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    return (
        <div>
            <p className="conTitle">
                <span>수강생 이력서 목록</span>
                <span className="fr">
                    <select
                        id="searchKey"
                        defaultValue={searchKey}
                        className="form-select"
                        onChange={(e) => {
                            setSearchKey(e.target.value);
                        }}
                    >
                        <option value="">전체</option>
                        <option value="studentName">이름</option>
                        <option value="studentId">아이디</option>
                        <option value="studentTel">전화번호</option>
                    </select>
                    <input
                        type="text"
                        id="lectureValue"
                        name="lectureValue"
                        className="form-control"
                        style={{ width: "300px", marginRight: "5px" }}
                        ref={searchValue}
                    />
                    <button className="btn btn-primary" onClick={studentList}>
                        검색
                    </button>
                </span>
            </p>

            <div className="lecStudent" id="lecStudent">
                <table className="col">
                    <caption>caption</caption>
                    <colgroup>
                        <col width="20%" />
                        <col width="20%" />
                        <col width="20%" />
                        <col width="20%" />
                        <col width="20%" />
                    </colgroup>

                    <thead>
                        <tr>
                            <th scope="col">학생 이름</th>
                            <th scope="col">학생 ID</th>
                            <th scope="col">학생 전화번호</th>
                            <th scope="col">이메일</th>
                            <th scope="col">이력서</th>
                        </tr>
                    </thead>
                    <tbody id="studentResumeList">
                        {stdList.map((item) => {
                            return (
                                <tr key={item.studentId}>
                                    <td>{item.studentName}</td>
                                    <td>{item.studentId}</td>
                                    <td>{item.studentTel}</td>
                                    <td>{item.studentMail}</td>
                                    <td>일단 이력서 제끼고~</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={stdCurrentPage}
                totalPage={totalCnt}
                pageSize={5}
                blockSize={5}
                onClick={studentList}
            />
        </div>
    );
};

export default ResumeStudentList;
