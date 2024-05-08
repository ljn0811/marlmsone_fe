import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../../components/common/Pagination';
import ModalEqu from './equManagement/ModalEqu';

const searchStyle = {
    height: "30px",
    width: "250px",
};

const pagenationStyle = {
    margin: "auto",
};

const EquManagement = () => {
    const [searchOption , setSearchOption]   = useState("room");         // 검색 조건 (강의실 명, 장비 명)
    const [searchName   , setSearchName  ]   = useState("");             // 검색 명
    
    const [totalCnt     , setTotalCnt    ]   = useState(0);              // 총 게시물 개수
    const [equList      , setEquList     ]   = useState([]);             // 게시물 리스트
    const [equId        , setEquId        ]  = useState("");             // 장비 아이디
    
    const [equCurrentPage  , setEquCurrentPage ]   = useState(1);              // 페이징 - 현재 페이지
    const pageSize                           = 12;                       // 페이징 - 한 페이지 게시물 개수

    const [modalAction     , setModalAction    ]   = useState(false);          // 모달 상태 함수
    
    // 컴포넌트 시작될 때
    useEffect(() => {
        // 리스트 조회
        searchList();
    }, [modalAction]);

    // 검색 박스 선택 값 변경 함수
    const selectChange = (e) => {
        setSearchOption(e.target.value);
    }

    // 검색 조건 변경
    const getSearchName = (e) => {
        setSearchName(e.target.value);
    }
    
    // 리스트 가져오는 함수
    const searchList = (currentPage) => {
        currentPage = (typeof currentPage === 'object') ? 1 : currentPage || 1;
        setEquCurrentPage(currentPage);

        let params = new URLSearchParams();
        params.append('cpage', equCurrentPage);
        params.append('pageSize', pageSize);
        params.append('searchOption', searchOption);
        params.append('searchName', searchName);

        // 비동기 처리
        axios
        .post("/adm/equManagementListJson.do", params)
        .then((res) => {
          setTotalCnt(res.data.listcnt);
          setEquList(res.data.listdata);
        })
        .catch((err) => {
          console.log("list error");
          alert(err.message);
        });

    };

    const newEqu = () => {
        setEquId("");
        setModalAction(true);
    };
    
    const modifyEqu = (id) => {
        setEquId(id);
        setModalAction(true);
    };
    
    return (
        <div id="content">
            <p className="Location">
                <a href="" className="btn_set home">메인으로</a> 
                <span className="btn_nav bold">시설 관리</span> 
                <span className="btn_nav bold"> 장비 관리</span> 
                <a href="" className="btn_set refresh">새로고침</a>
            </p>

            <p className="conTitle">
                <span>장비 관리</span> 
                <span className="fr">
                    <select id={searchOption} className='searchBox' onChange={selectChange}>
                        <option value="room">강의실 명</option>	
                        <option value="equ">장비 명</option>	
                    </select>
                    <input type="text" id={searchName} style={searchStyle} className="form-control" placeholder=""
                        onChange={getSearchName}/>
                    <input type="button" id="searchBtn" className="btn btn-primary" value="검색" onClick={searchList}/>
                    <span className="fr">
                            <button
                                className="btn btn-primary"
                                name="newRegEqu"
                                id="newRegEqu"
                                onClick={() => newEqu()}
                            >
                                <span>장비 신규등록</span>
                            </button>
                    </span>
                </span>
            </p> 
            
            {/* 강의실 장비 목록 */}
            <div className="divEquList divComGrpCodList">
                <table className="col">
                    <caption>caption</caption>
                    <colgroup>
                        <col width="20%"/>
                        <col width="20%"/>
                        <col width="10%"/>
                        <col width="40%"/>
                        <col width="10%"/>
                    </colgroup>

                    <thead>
                        <tr>
                            <th scope="col">강의실 명</th>
                            <th scope="col">장비 명</th>
                            <th scope="col">장비 수</th>
                            <th scope="col">비고</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    
                    <tbody id="listEquBody">
                        {equList.map((item) => {
                            return (
                                <tr key={item.equ_id}>
                                <td
                                    className="pointer-cursor"
                                >
                                    {item.lecrm_name}
                                </td>
                                <td>{item.equ_name}</td>
                                <td>{item.equ_num}</td>
                                <td>{item.equ_note}</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => modifyEqu(item.equ_id)}>수정</button>
                                </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    
                </table>
            </div>
            <div className="paging_area"  id="equPagination" style={pagenationStyle}>
                <Pagination onClick={searchList} 
                    currentPage={equCurrentPage}
                    totalPage={totalCnt}
                    pageSize={pageSize}
                    blockSize={5}
                />
            </div>
            {modalAction ? <ModalEqu modalAction={modalAction} setEquCurrentPage={setEquCurrentPage} setModalAction={setModalAction} id={equId}></ModalEqu> : null}
        </div>
    );
}

export default EquManagement;