import React, {useState, useEffect} from "react";
import axios from "axios";
import Pagination from "../../components/common/Pagination";
import ModalStdLearnMat from "./ModalStdLearnMat"


const S_learningMaterials = () => {

    let pageSize = 5;
    let blockSize = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // 검색어 정보
    const [searchKey, setSearchKey] = useState('');
    const [searchInput, setSearchInput] = useState('');

    // 학생 학습자료 목록
    const [stdLearnMatList, setStdLearnMatList] = useState([]);
    const [stdLearnMatTotalCnt, setStdLearnMatTotalCnt] = useState(0);

    const [learnMatModalOn, setLearnMatModalOn] = useState(false);
    const [selLearnDataId, setSelLearnDataId] = useState('');


    useEffect(() => {
        searchStdLearnMatList();
    }, []);

    // 학생 학습자료 목록 조회
    const searchStdLearnMatList = (cpage) => {
        
        cpage = typeof cpage === 'object'? 1 : cpage || 1;
        setCurrentPage(cpage);

        // var param = {
        //     pageSize : pageSize,
        //     currentPage : currentPage,
        //     searchInfo : $("#searchInfo").val(),
        //     searchKey : $("#searchKey").val()
        // }
        // url : '/std/stdLearnMatList.do',

        let params = new URLSearchParams();

        params.append('pageSize', pageSize);
        params.append('currentPage', cpage);
        params.append('searchInfo', searchInput);
        params.append('searchKey', searchKey);

        axios.post("/std/stdLearnMatListjson.do", params)
            .then((res) => {
                // {"data":{"learningMatList":[{"learn_data_id":1,"lec_id":1,
                //          ],"pageSize":5,"totalCount":13,"currentPage":1}                
                console.log("searchLearnMatList() result console : " + JSON.stringify(res));
                
                setStdLearnMatTotalCnt(res.data.totalCount);
                setStdLearnMatList(res.data.learningMatList);
            })
            .catch((err) => {
                console.log("searchLearnMatList() result error : " + err.message);
                alert(err.message);
            });
    };

    // 학생 학습자료 정보 상세보기
    const searchStdLearnMatDetail = (learnDataId) => {
        setSelLearnDataId(learnDataId);
        setLearnMatModalOn(true);
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
                <span className='btn_nav bold'>학습 관리</span>
                <span className='btn_nav bold'>학습 자료</span>
                <a className='btn_set refresh'>새로고침</a>
            </p>
            {/* 학생 학습자료 목록 조회 */}
            <p className="conTitle">
                <span>학습 자료</span>{" "}
                <span className="fr">
                    <select id="searchKey" 
                            className="form-control"
                            style={searchstyle}
                            onChange={(e) => {
                                setSearchKey(e.target.value)
                            }}>
                        <option id="all" value="all">전체</option>
                        <option id="title" value="title">제목</option>
                        <option id="lec_name" value="lec_name">강의명</option>
                    </select>                    
                    <input type="text" 
                        className="form-control"
                        id="searchLecStdInput"
                        name="searchLecStdInput"
                        placeholder=""
                        style={searchstylewidth}
                        onChange={(e) => {
                            setSearchInput(e.target.value)
                        }}
                    />
                    <button className="btn btn-primary"
                        id="searchbtn"
                        name="searchbtn"
                        onClick={(e) => {
                            searchStdLearnMatList();
                        }}
                    >
                        <span>검색</span>
                    </button>
                </span>
            </p>
            <div>
                <span>총 건수 : {stdLearnMatTotalCnt} / 현재 페이지 번호 : {currentPage}</span>
                <table className="col">
                    <colgroup>
                        <col width="15%"/>
                        <col width="20%"/>
                        <col width="40%"/>
                        <col width="25%"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>강의명</th>
                            <th>제목</th>
                            <th>등록일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            stdLearnMatTotalCnt === 0 && (
                                <tr>
                                    <td colSpan="4">데이터가 없습니다.</td>
                                </tr>
                            )
                        }
                        {/* 학생 학습자료 목록 looping */}
                        {
                            // {"data":{"learningMatList":[{"learn_data_id":1,"lec_id":1,
                            //          "learn_tit":"1주차 자바의 이해 학습자료입니다.123",
                            //          "learn_con":"1주차 자바의 이해 학습자료입니다.수정입니다123",
                            //          "w_date":"2024-04-11 10:35:37.0",
                            //          "learn_fname":"93a609aa-9edc-467f-9ba4-b83e35be2c75_1주차 학습자료(수정본23).docx",
                            //          "learn_url":"V:\\FileRepository\\tutor\\93a609aa-9edc-467f-9ba4-b83e35be2c75_1주차 학습자료(수정본23).docx",
                            //          "learn_fsize":null,"lec_name":"자바의이해"}]
                            stdLearnMatTotalCnt > 0 && stdLearnMatList.map((item) => {
                                return (
                                    <tr>
                                        <td>{item.learn_data_id}</td>
                                        <td>{item.lec_name}</td>
                                        <td className="pointer-cursor" 
                                            onClick={() => {
                                                searchStdLearnMatDetail(item.learn_data_id)
                                            }}>{item.learn_tit}</td>
                                        <td>{item.w_date}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                {/* 학생 학습자료 목록 페이징 */}
                {stdLearnMatTotalCnt > 0 && <Pagination currentPage={currentPage}
                                                        totalPage={stdLearnMatTotalCnt}
                                                        pageSize={pageSize}
                                                        blockSize={blockSize}
                                                        onClick={searchStdLearnMatList}/>}
            </div> {/* End 학생 학습자료 목록 조회 */}
            {learnMatModalOn? <ModalStdLearnMat modalAction={learnMatModalOn} 
                                                setModalAction={setLearnMatModalOn}
                                                id={selLearnDataId}></ModalStdLearnMat> : null}
        </div>
    )
}

export default S_learningMaterials