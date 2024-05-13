import React, {useState, useRef, useEffect} from "react";
import axios from "axios";
import Pagination from "../../components/common/Pagination";
import { useQueryParam } from "../../hook/useQueryParam";
import ModalLecStudent from "./ModalLecStudent";


const Student = () => {
    const queryParam = useQueryParam();
    const queryLecId = queryParam.get('lecId');
    const queryTutorId = queryParam.get('tutorId');

    const searchInput = useRef('');
    const [searchKey, setSearchKey] = useState('');

    let pageSize = 5;
    let blockSize = 10;
    const [lecStdCurrentPage, setLecStdCurrentPage] = useState(1);

    // 수강생 목록
    const [lecStdList, setLecStdList] = useState([]);
    const [lecStdTotalCnt, setLecStdTotalCnt] = useState(0);

    const [stdDtlModalOn, setStdDtlModalOn] = useState(false);
    const [selStdId, setSelStdId] = useState('');

    

    useEffect(() => {
        if (queryLecId !== null) {
            console.log("lecId:"+queryLecId+", toturId:"+queryTutorId);
            searchLecStdList();
        }
    }, [queryLecId]);

    // 수강생 목록 조회
    const searchLecStdList = (cpage) => {

        cpage = typeof cpage === 'number'? cpage || 1 : 1;
        
        setLecStdCurrentPage(cpage);
        // setLecStdListDisplay(true);

        // var param = {
        //    tutorId : tutorId,
        //    lectureValue : lectureId,
        //    currentPage : currentPage,
        //    pageSize : pageSize,
        //    searchKey: searchKey,
        //    studentValue : studentValue
        // }
        // url: '/tut/LectureStudentList',

        let params = new URLSearchParams();

        params.append('tutorId', queryTutorId);
        params.append('lectureValue', queryLecId);
        params.append('currentPage', cpage);
        params.append('pageSize', pageSize);
        params.append('searchKey', searchKey);
        params.append('studentValue', searchInput.current.value);

        axios.post("/tut/LectureStudentListjson.do", params)
            .then((res) => {
                // {"data":{"lectureStudentList":
                console.log("searchLecStdList() result console : " + JSON.stringify(res));

                setLecStdTotalCnt(res.data.totalCount);
                setLecStdList(res.data.lectureStudentList);
            })
            .catch((err) => {
                console.log("searchLecStdList() result error : " + err.message);
                alert(err.message);
            });
    }

    // 수강생 정보 상세보기 modal open
    const searchStdDetail = (id) => {
        setSelStdId(id);
        setStdDtlModalOn(true);
    }

    // 수강신청 승인
    const approveLecStd = (stdId, lecId) => {

        if ( window.confirm("수강을 승인하겠습니까?") ) {
            // var param = {
            //     studentId : studentId,
            //     lectureId : lectureId
            // }
            // url: '/tut/lectureStudentApprove',

            let params = new URLSearchParams();

            params.append('studentId', stdId);
            params.append('lectureId', lecId);

            axios.post("/tut/lectureStudentApprove.do", params)
                .then((res) => {
                    // {"data":true,"status":200,"statusText":"OK"
                    console.log("approveLecStd() result console : " + JSON.stringify(res));

                    if (res.data === true) {
                        alert("수강 승인이 완료되었습니다.");
                        searchLecStdList(lecId, lecStdCurrentPage);
                    }
                })
                .catch((err) => {
                    console.log("approveLecStd() result error : " + err.message);
                    alert(err.message);
                });
        }
    }

    // 수강신청 취소
    const cancelLecStd = (stdId, lecId) => {

        if ( window.confirm("수강을 취소하겠습니까?") ) {

            // var param = {
            //     studentId : studentId,
            //     lectureId : lectureId
            // }
            // url: '/tut/lectureStudentApprove',

            let params = new URLSearchParams();

            params.append('studentId', stdId);
            params.append('lectureId', lecId);

            axios.post("/tut/lectureStudentCancle.do", params)
                .then((res) => {
                    // {"data":true,"status":200,"statusText":"OK"
                    console.log("cancelLecStd() result console : " + JSON.stringify(res));

                    if (res.data === true) {
                        alert("수강 취소가 완료되었습니다.");
                        searchLecStdList(lecId, lecStdCurrentPage);
                    }
                })
                .catch((err) => {
                    console.log("cancelLecStd() result error : " + err.message);
                    alert(err.message);
                });
        }
    }

    // 날짜를 yyyy-MM-dd 형식으로 포맷하는 함수
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const searchstyle = {
        fontsize: "15px",    
        fontweight: "bold",
    };

    const searchstylewidth = {
        height: "28px",
        width: "200px",    
    };

    return (
        <div>
            {/* 수강생목록 조회 */}
            <div>
                <p className="conTitle">
                    <span>수강생 목록</span>
                    <span className="fr">
                        <select id="searchKey" 
                                className="form-control"
                                style={searchstyle}
                                onChange={(e) => {
                                    setSearchKey(e.target.value)
                                }}>
                            <option value="all">전체</option>
                            <option value="studentName">이름</option>
                            <option value="studentId">아이디</option>
                            <option value="studentTel">전화번호</option>
                        </select>                    
                        <input type="text" 
                            className="form-control"
                            id="searchInput"
                            name="searchInput"
                            placeholder=""
                            style={searchstylewidth}
                            ref={searchInput}
                        />
                        <button className="btn btn-primary"
                            id="searchbtn"
                            name="searchbtn"
                            onClick={(e) => {
                                searchLecStdList(lecStdCurrentPage);
                            }}
                        >
                            <span>검색</span>
                        </button>
                    </span>
                </p>

                <div>
                    <span>총 건수 : {lecStdTotalCnt} / 현재 페이지 번호 : {lecStdCurrentPage}</span>
                    <table className="col">
                        <colgroup>
                            <col width="15%"/>
                            <col width="15%"/>
                            <col width="20%"/>
                            <col width="20%"/>
                            <col width="15%"/>
                            <col width="15%"/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>학번</th>
                                <th>학생명(ID)</th>
                                <th>휴대전화</th>
                                <th>가입일자</th>
                                <th>승인여부</th>
                                <th>강의 승인</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                lecStdTotalCnt === 0 && (
                                    <tr>
                                        <td colSpan="6">데이터가 없습니다.</td>
                                    </tr>
                                )
                            }
                            {/* 학생 목록 looping */}
                            {
                                // {"data":{"lectureStudentList":
                                //          [{"lec_Id":1,"lec_name":null,
                                //            "std_id":"123123 ","student_name":"123",
                                //            "student_number":"26","student_tel":"123-1231-1234",
                                //            "student_sex":"M","student_mail":"123@123",
                                //            "student_addr":"123,123,123","join_date":"2021-05-06",
                                //            "survey_yn":"y","approve_yn":"Y","startDate":null,"endDate":null}
                                //          "pageSize":5,"lectureValue":"1","totalCount":5,"currentPage":1}

                                lecStdTotalCnt > 0 && lecStdList.map((item) => {
                                    return (
                                        <tr>
                                            <td>{item.student_number}</td>
                                            <td className="pointer-cursor" 
                                                onClick={() => {
                                                    searchStdDetail(item.std_id)
                                                }}>{item.student_name} ({item.std_id})</td>                                        
                                            <td>{item.student_tel}</td>
                                            <td>{formatDate(item.join_date)}</td>
                                            <td>{item.approve_yn}</td>
                                            <td>{
                                                item.approve_yn === 'N'? 
                                                    <button className="btn btn-primary"
                                                            id="searchbtn"
                                                            name="searchbtn"
                                                            onClick={(e) => {
                                                                approveLecStd(item.std_id, item.lec_Id)
                                                            }}>
                                                            <span>승인</span>
                                                    </button> :
                                                    <button className="btn btn-primary"
                                                            id="searchbtn"
                                                            name="searchbtn"
                                                            onClick={(e) => {
                                                                cancelLecStd(item.std_id, item.lec_Id)
                                                            }}>
                                                            <span>취소</span>
                                                    </button>
                                                }                                            
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                    {/* 학생목록 페이징 */}
                    {lecStdTotalCnt > 0 && <Pagination currentPage={lecStdCurrentPage}
                                                    totalPage={lecStdTotalCnt}
                                                    pageSize={pageSize}
                                                    blockSize={blockSize}
                                                    onClick={searchLecStdList}/>}
                </div>
            </div>{/* End 수강생목록 조회 */}
            {stdDtlModalOn? <ModalLecStudent modalAction={stdDtlModalOn} 
                                        setModalAction={setStdDtlModalOn} 
                                        tutorId={queryTutorId}
                                        stdId={selStdId}></ModalLecStudent> : null}
        </div>
    )    
}

export default Student