import React, {useState, useRef, useEffect} from "react";
import axios from "axios";
import Pagination from "../../components/common/Pagination";
import { useQueryParam } from "../../hook/useQueryParam";
import ModalStudent from "./ModalStudent";


const Student = () => {
    const queryParam = useQueryParam();
    const queryLecId = queryParam.get('lecId');
    const queryLecName = queryParam.get('lecName');

    const searchInput = useRef('');
    const [searchKey, setSearchKey] = useState('all');

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
            console.log("lecId : " + queryLecId);
            console.log("lecName : " + queryLecName);
            searchLecStdList();
        }
    }, [queryLecId]);

    // 수강생 목록 조회
    const searchLecStdList = (cpage, lecId) => {

        cpage = typeof cpage === 'number'? cpage || 1 : 1;
        setLecStdCurrentPage(cpage);

        // var param = {
		// 	searchKey_std : searchKey,
		// 	searchWord_std : searchWord,
		// 	lec_id : lec_id,
		// 	currentPage_std : currentPage,
		// 	pageSize_std : pageSize_std,
		// 	from_date:from_date,
		// 	to_date:to_date
		// }
        // callAjax("/adm/list_std.do", "post", "text", true, param, resultCallback);

        let params = new URLSearchParams();

        params.append('searchKey_std', searchKey);
        params.append('searchWord_std', searchInput.current.value);
        params.append('lec_id', (lecId != null) ? lecId : queryLecId);
        params.append('currentPage_std', cpage);
        params.append('pageSize_std', pageSize);
        params.append('from_date', '');
        params.append('to_date', '');

        axios.post("/adm/list_std_json.do", params)
            .then((res) => {
                // {"data":{"pageSize_std":5,
                //          "list_std":[{"lec_id":1,"lecrm_id":0,"max_pnum":0,"pre_pnum":0,"start_date":null,"end_date":null,
                //                       "process_day":0,"lec_type_id":0,"lec_type_name":null,
                //                       "test_id":0,"test_start":null,"test_end":null,
                //                       "tutor_id":null,"lec_name":"자바의이해","lec_goal":null,"lec_sort":null,
                //                       "loginID":"wont92","user_type":null,"use_yn":null,
                //                       "name":"원태형","password":null,"tel":"221-2312-3123",
                //                       "sex":null,"mail":null,"addr":null,"join_date":null,"regi_num":null,"std_num":null}],
                //          "totalCnt_std":6,"currentPage_std":1}
                console.log("searchLecStdList() result console : " + JSON.stringify(res));

                setLecStdTotalCnt(res.data.totalCnt_std);
                setLecStdList(res.data.list_std);
            })
            .catch((err) => {
                console.log("searchLecStdList() result error : " + err.message);
                alert(err.message);
            });
    }

    // 회원 탈퇴
    const banUser = (stdId) => {

        if ( window.confirm("정말 탈퇴시키겠습니까?") ) {
            // 	var param = {
            //         loginID : loginID
            // };
            // callAjax("/adm/ban_user.do", "post", "json", true, param, resultCallback);
            
            let params = new URLSearchParams();
            params.append('loginID', stdId);

            axios.post("/adm/ban_user.do", params)
                .then((res) => {
                    // {"result":"SUCCESS","resultMsg":"회원 탈퇴 되었습니다."}
                    console.log("banUser() result console : " + JSON.stringify(res));

                    if (res.data.result === "SUCCESS") {
                        alert(res.data.resultMsg);
                        searchLecStdList();
                    }
                })
                .catch((err) => {
                    console.log("banUser() result error : " + err.message);
                    alert(err.message);
                });
        }
    }

    // 수강생 정보 상세보기 modal open
    const searchStdDetail = (id) => {
        setSelStdId(id);
        setStdDtlModalOn(true);
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
            {/* 학생목록 조회 */}
            <div>
                <p className="conTitle">
                    <span>학생 목록</span>
                    <span className="fr">

                        <select id="searchKey" 
                                className="form-control"
                                style={searchstyle}
                                onChange={(e) => {
                                    setSearchKey(e.target.value);
                                    if (e.target.value === "all") {
                                        searchInput.current.value = '';
                                    }
                                }}>
                            <option value="all">전체</option>
                            <option value="stdNm">학생명</option>
                            <option value="stdId">아이디</option>
                            <option value="tel">전화번호</option>
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
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button className="btn btn-primary"
                            id="searchbtn"
                            name="searchbtn"
                            onClick={(e) => {
                                searchLecStdList(lecStdCurrentPage);
                            }}
                    >
                        <span>전체 학생</span>
                    </button>
                    <button className="btn btn-primary"
                        id="searchbtn"
                        name="searchbtn"
                        onClick={(e) => {
                            searchLecStdList(lecStdCurrentPage, '미수강');
                        }}
                    >
                        <span>미수강 학생</span>
                    </button>
                </div>
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
                                <th>수강강의</th>
                                <th>학생명(ID)</th>
                                <th>휴대전화</th>
                                <th>가입일자</th>
                                <th></th>
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
                                // {"data":{"pageSize_std":5,
                                // "list_std":[{"lec_id":1,"lecrm_id":0,"max_pnum":0,"pre_pnum":0,"start_date":null,"end_date":null,
                                //             "process_day":0,"lec_type_id":0,"lec_type_name":null,
                                //             "test_id":0,"test_start":null,"test_end":null,
                                //             "tutor_id":null,"lec_name":"자바의이해","lec_goal":null,"lec_sort":null,
                                //             "loginID":"wont92","user_type":null,"use_yn":null,
                                //             "name":"원태형","password":null,"tel":"221-2312-3123",
                                //             "sex":null,"mail":null,"addr":null,"join_date":null,"regi_num":null,"std_num":null}],
                                // "totalCnt_std":6,"currentPage_std":1}
                                lecStdTotalCnt > 0 && lecStdList.map((item) => {
                                    return (
                                        <tr key={item.loginID}>
                                            <td>{item.std_num}</td>
                                            <td>{queryLecName}</td>
                                            <td className="pointer-cursor" 
                                                onClick={() => {
                                                    searchStdDetail(item.loginID)
                                                }}>{item.name} ({item.loginID})</td>                                        
                                            <td>{item.tel}</td>
                                            <td>{item.join_date}</td>
                                            <td>
                                                <button className="btn btn-primary"
                                                        onClick={(e) => {
                                                            banUser(item.loginID)
                                                        }}>
                                                    <span>탈퇴</span>
                                                </button>
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
            </div>{/* End 학생목록 조회 */}
            {stdDtlModalOn? <ModalStudent modalAction={stdDtlModalOn} 
                                        setModalAction={setStdDtlModalOn} 
                                        stdId={selStdId}></ModalStudent> : null}
        </div>
    )    
}

export default Student