import React, {useState, useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Pagination from "../../components/common/Pagination";
import Student from "./Student";
import ModalLecture from "../tut/ModalTutLecture";



const StudentControl = () => {

    const navigate = useNavigate();
    const searchLecInput = useRef();

    let pageSize = 5;
    let blockSize = 10;

    const [lecCurrentPage, setLecCurrentPage] = useState(1);

    // 강의 목록
    const [lecList, setLecList] = useState([]);
    const [lecTotalCnt, setLecTotalCnt] = useState(0);

    const [lecStdListOn, setLecStdListOn] = useState(false);
    const [lecDtlModalOn, setLecDtlModalOn] = useState(false);
    const [selLecId, setSelLecId] = useState(0);
    const [selTutorId, setSelTutorId] = useState('');

    
    useEffect(() => {
        searchLecInfoList();
    }, []);

    // 강의 전체 목록 조회
    const searchLecInfoList = (cpage) => {
        
        cpage = typeof cpage === 'object'? 1 : cpage || 1;
        setLecCurrentPage(cpage);
        setLecStdListOn(false);

		// var param = {
		// 	searchWord_lec : searchWord,
		// 	currentPage : currentPage,
		// 	pageSize : pageSize
		// }
		// callAjax("/adm/plist_lec.do", "post", "text", true, param, resultCallback);

        let params = new URLSearchParams();

        params.append('searchWord_lec', searchLecInput.current.value);
        params.append('currentPage', cpage);
        params.append('pageSize', pageSize);        

        axios.post("/adm/plist_lec_json.do", params)
            .then((res) => {
                // {"data":{"totalCnt_lec":46,
                //          "list_lec":[{"lec_id":1,"lecrm_id":0,
                //          "max_pnum":0,"pre_pnum":0,
                //          "start_date":"2024.03.05","end_date":"2024.06.15",
                //          "process_day":0,"lec_type_id":0,
                //          "lec_type_name":null,"test_id":0,
                //          "test_start":null,"test_end":null,"tutor_id":null,
                //          "lec_name":"자바의이해","lec_goal":null,"lec_sort":null,"loginID":null,
                //          "user_type":null,"use_yn":null, "name":null,"password":null,
                //          "tel":null,"sex":null, "mail":null,"addr":null,
                //          "join_date":null,"regi_num":null,"std_num":null}],"currentPage_lec":1,"pageSize":5}
                console.log("searchLecInfoList() result console : " + JSON.stringify(res));

                setLecTotalCnt(res.data.totalCnt_lec);
                setLecList(res.data.list_lec);
                // setTutorId(res.data.loginId);
            })
            .catch((err) => {
                console.log("searchLecInfoList() result error : " + err.message);
                alert(err.message);
            });
    };

    // 강의 정보 상세보기 modal open
    const searchLecDetail = (lecId, tutorId) => {
        setSelLecId(lecId);
        setSelTutorId(tutorId);        
        setLecDtlModalOn(true);
    }

    // 수강생 목록 조회
    const searchLecStdList = (lecId, lecName) => {

        const query_lecId = [`lecId=${lecId ?? 0}`];
        const query_lecName = [`lecName=${lecName ?? 0}`];
        
        setLecStdListOn(true);
        navigate(`/dashboard/adm/StudentControl?${query_lecId}&&${query_lecName}`);
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
                <span className='btn_nav bold'>인원관리</span>
                <span className='btn_nav bold'>학생관리</span>
                <a className='btn_set refresh'>새로고침</a>
            </p>

            {/* 전체 강의목록 조회 */}
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
                {/* {"data":{"totalCnt_lec":46,
                          "list_lec":[{"lec_id":1,"lecrm_id":0,
                                       "max_pnum":0,"pre_pnum":0,
                                       "start_date":"2024.03.05","end_date":"2024.06.15",
                                       "process_day":0,"lec_type_id":0,
                                       "lec_type_name":null,"test_id":0,
                                       "test_start":null,"test_end":null,"tutor_id":null,
                                       "lec_name":"자바의이해","lec_goal":null,"lec_sort":null,"loginID":null,
                                       "user_type":null,"use_yn":null, "name":null,"password":null,
                                       "tel":null,"sex":null, "mail":null,"addr":null,
                                       "join_date":null,"regi_num":null,"std_num":null}],"currentPage_lec":1,"pageSize":5} */}
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
                                                searchLecDetail(item.lec_id, item.tutor_id)
                                            }}>{item.lec_name}</td>
                                        <td>{ formatDate(item.start_date)} ~ {formatDate(item.end_date)}</td>
                                        <td>
                                        <button className="btn btn-primary"
                                            id="searchbtn"
                                            name="searchbtn"
                                            onClick={(e) => {
                                                searchLecStdList(item.lec_id, item.lec_name)
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
                {/* 전체 강의목록 페이징 */}
                {lecTotalCnt > 0 && <Pagination currentPage={lecCurrentPage}
                                                totalPage={lecTotalCnt}
                                                pageSize={pageSize}
                                                blockSize={blockSize}
                                                onClick={searchLecInfoList}/>}
            </div> {/* End 전체 강의목록 조회 */}
            {lecStdListOn? <Student></Student> : null}
            {lecDtlModalOn? <ModalLecture modalAction={lecDtlModalOn} 
                                        setModalAction={setLecDtlModalOn}
                                        setListAction={setLecStdListOn}
                                        tutorId={selTutorId}
                                        lecId={selLecId}></ModalLecture> : null}
        </div>
    )    
}

export default StudentControl