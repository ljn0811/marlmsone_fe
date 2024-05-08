import React, {useState, useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Pagination from "../../components/common/Pagination";
import Student from "./Student";
import ModalLecture from "./ModalLecture";



const LectureStudentInfo = () => {

    const navigate = useNavigate();
    const searchLecInput = useRef();

    let pageSize = 5;
    let blockSize = 10;

    const [lecCurrentPage, setLecCurrentPage] = useState(1);

    // login id
    const [tutorId, setTutorId] = useState('');

    // 강의 목록
    const [lecList, setLecList] = useState([]);
    const [lecTotalCnt, setLecTotalCnt] = useState(0);

    const [lecStdListOn, setLecStdListOn] = useState(false);
    const [lecDtlModalOn, setLecDtlModalOn] = useState(false);
    const [selLecId, setSelLecId] = useState('');

    
    useEffect(() => {
        searchLecInfoList();
    }, []);

    // 강사의 강의목록 조회
    const searchLecInfoList = (cpage) => {
        
        cpage = typeof cpage === 'object'? 1 : cpage || 1;
        setLecCurrentPage(cpage);
        setLecStdListOn(false);

        // var param = {
        //     tutorId : tutorId,
        //     lectureValue : lectureValue,
        //     currentPage : currentPage,
        //     pageSize : pageSize
        // }
        // url: '/tut/tutorLectureList',

        let params = new URLSearchParams();

        params.append('tutorId', tutorId);
        params.append('lectureValue', searchLecInput.current.value);
        params.append('currentPage', cpage);
        params.append('pageSize', pageSize);        

        axios.post("/tut/tutorLectureListjson.do", params)
            .then((res) => {
                // "data":{"loginId":"bbb123"
                //         "lectureList":[{"lec_id":1,"lec_name":"자바의이해",
                //         "pageSize":10,"totalCount":15
                console.log("searchLecInfoList() result console : " + JSON.stringify(res));

                setLecTotalCnt(res.data.totalCount);
                setLecList(res.data.lectureList);                
                setTutorId(res.data.loginId);
            })
            .catch((err) => {
                console.log("searchLecInfoList() result error : " + err.message);
                alert(err.message);
            });
    };

    // 강의 정보 상세보기 modal open
    const searchLecDetail = (id) => {
        setSelLecId(id);
        setLecDtlModalOn(true);
    }

    // 수강생 목록 조회
    const searchLecStdList = (lecId) => {

        const query_lecId = [`lecId=${lecId ?? 0}`];
        const query_tutorId = [`tutorId=${tutorId ?? 0}`];
        
        setLecStdListOn(true);
        navigate(`/dashboard/tut/LectureStudentInfo?${query_lecId}&${query_tutorId}`);
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
        <div className='content'>
            <p className='Location'>
                <a className='btn_set home'>메인으로</a>
                <span className='btn_nav bold'>학습관리</span>
                <span className='btn_nav bold'>수강생 정보</span>
                <a className='btn_set refresh'>새로고침</a>
            </p>

            {/* 강사의 강의목록 조회 */}
            <p className="conTitle">
                <span>강의목록</span>{" "}            
                <span className="fr">
                    <span style={searchstyle}>강의명</span>{" "}
                    <input type="text" 
                        className="form-control"
                        id="searchLecInput"
                        name="searchLecInput"
                        placeholder=""
                        style={searchstylewidth}
                        ref={searchLecInput}
                    />
                    <button className="btn btn-primary"
                        id="searchbtn"
                        name="searchbtn"
                        onClick={(e) => {
                            searchLecInfoList(lecCurrentPage)
                        }}
                    >
                        <span>검색</span>
                    </button>
                </span>
            </p>
            <div>
                {/* "data":{"lectureList":[{"lec_id":1,"lec_name":"자바의이해",
                                        "tutor_id":"bbb123","tutor_name":"스티븐잡스",
                                        "lecrm_id":5,"lecrm_name":"4 강의실",
                                        "start_date":1709564400000,"end_date":1718377200000,
                                        "pre_pnum":5,"max_pnum":50,"process_day":0}, */}
                <span>총 건수 : {lecTotalCnt} / 현재 페이지 번호 : {lecCurrentPage}</span>
                <table className="col">
                    <colgroup>
                        <col width="15%"/>
                        <col width="45%"/>
                        <col width="25%"/>
                        <col width="15%"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>과정ID</th>
                            <th>과정명</th>
                            <th>기간</th>
                            <th>수강생 보기</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lecTotalCnt === 0 && (
                            <tr><td colSpan="4">데이터가 없습니다.</td></tr>
                        )}
                        {/* 강의 목록 looping */}
                        {
                            lecTotalCnt > 0 && lecList.map((item) => {
                                return (
                                    <tr>
                                        <td>{item.lec_id}</td>
                                        <td className="pointer-cursor" 
                                            onClick={() => {
                                                searchLecDetail(item.lec_id)
                                            }}>{item.lec_name}</td>
                                        <td>{ formatDate(item.start_date)} ~ {formatDate(item.end_date)}</td>
                                        <td>
                                        <button className="btn btn-primary"
                                            id="searchbtn"
                                            name="searchbtn"
                                            onClick={(e) => {
                                                searchLecStdList(item.lec_id)
                                            }}
                                        >
                                            <span>검색</span>
                                        </button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                {/* 강의목록 페이징 */}
                {lecTotalCnt > 0 && <Pagination currentPage={lecCurrentPage}
                                                totalPage={lecTotalCnt}
                                                pageSize={pageSize}
                                                blockSize={blockSize}
                                                onClick={searchLecInfoList}/>}
            </div> {/* End 강사의 강의목록 조회 */}
            {lecStdListOn? <Student></Student> : null}
            {lecDtlModalOn? <ModalLecture modalAction={lecDtlModalOn} 
                                      setModalAction={setLecDtlModalOn}
                                      setListAction={setLecStdListOn}
                                      tutorId={tutorId}
                                      lecId={selLecId}></ModalLecture> : null}
        </div>
    )    
}

export default LectureStudentInfo