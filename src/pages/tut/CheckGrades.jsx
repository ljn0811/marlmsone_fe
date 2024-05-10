import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Pagination from "../../components/common/Pagination";
import CheckStdList from "./list/CheckStdList";
import * as commonjs from "../../components/common/commonfunction.js";
import { useNavigate } from "react-router-dom";

// import Modal from "react-modal";

const CheckGrades = () => {

    const searchLecTest = useRef();
    const navigate = useNavigate();
    const [lecList, setLecList] = useState([]);
    const [testNameList, setTestNameList] = useState([]);
    const [totalcnt, setTotalcnt] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInfo, setSearchInfo] = useState("");
    const [selected, setSelected] = useState("");
    const [checkgradeList, setCheckGradeList] = useState([]);
    const [totalGradeCnt, setTotalGradeCnt] = useState(0);

    const searchstylewidth = {
        height: "28px",
        width: "200px",
    };
    
    const searchstyle = {
        fontsize: "15px",
        fontweight: "bold",
    }
    useEffect(() => {
        searchGradeList(currentPage);
    }, [currentPage, searchLecTest, searchInfo, lecList])

    const handleSearch = () => {
        setSearchInfo(searchLecTest.current.value);
    };
    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const OPTIONS = [
        { value: "all", name: "전체"},
        { value: "lec_name", name: "강의명"},
        { value: "test_name", name: "시험명"},
    ];
    
    const SelectBox = (props) => {
        return (
            <select
                id="searchSelectBox"
                value={selected}
                onChange={changeSelected}
            >
                {props.options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select>
        )
    }

    const changeSelected = (event) => {
        setSelected(event.target.value);
    }

    const searchTestList = (id) => {
        const query = [`id=${id ?? 0}`];
        navigate(`/dashboard/tut/checkGrades?${query}`)
    };

    const searchGradeList = async (cpage) => {
        if (typeof cpage === 'number') {
            cpage = cpage || 1;
        } else {
            cpage = 1;
        }
        let params = new URLSearchParams();
        params.append("cpage", cpage);
        params.append("pagesize", 5);
        params.append("checkgradeList", checkgradeList);
        params.append("totalGradeCnt", totalGradeCnt);
        params.append("searchInfo", searchLecTest.current.value);
        params.append("searchKey", selected);

        await axios
            .post("/tut/checkGradesList.do", params)
            .then((res) => {
                setCheckGradeList(res.data.checkgradeList);
                setTotalGradeCnt(res.data.totalGradeCnt);
                setCurrentPage(cpage);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    return (
        <div className="content">
            <p className="Location">
                <a className="btn_set home">메인으로</a>{" "}
                <span className="btn_nav bold">학습관리 </span>{" "}
                <span className="btn_nav bold"> 성적조회</span>{" "}
                <a className="btn_set refresh">새로고침</a>
            </p>
            <p className="conTitle">
                <span>시험 목록</span>
                <SelectBox options={OPTIONS} />
                <input
                    type="text"
                    id="searchLecTest"
                    name="searchLecTest"
                    className="form-control"
                    placeholder=""
                    style={searchstylewidth}
                    ref={searchLecTest}
                />
                <button
                    className="btn btn-primary"
                    onClick={searchGradeList}
                    name="searchbtn"
                    id="searchbtn"
                >
                    <span>검색</span>
                </button>
            </p>

            <div>
                <table className="col">
                    <colgroup>
                        <col width="20%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="10%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>강의명</th>
                            <th>시험명</th>
                            <th>상태</th>
                            <th>대상</th>
                            <th>응시자 수</th>
                            <th>미응시자 수</th>
                        </tr>
                    </thead>
                    <tbody>
                            {checkgradeList.map((list) => {
                                return (
                                        <tr key={list.lec_id}>
                                            <td>{list.lec_name}</td>
                                            <td
                                                style={{color: "black", cursor: "pointer"}}
                                                onClick={() => searchTestList(list.lec_id)}
                                            >
                                                    {list.test_name}
                                            </td>
                                            <td>{list.lecStatus}</td>
                                            <td>{list.pre_pnum}</td>
                                            <td>{list.cnt}</td>
                                            <td>{list.noTest}</td>
                                        </tr>
                                        )
                                    }
                                )}
                        </tbody>
                </table>
                <Pagination 
                    currentPage={currentPage}
                    totalPage={totalGradeCnt}
                    pageSize={5}
                    blockSize={5}
                    onClick={searchGradeList}
                />
                <div>
                    <CheckStdList />
                </div>
            </div>
        </div>
    );

};

export default CheckGrades; 