import React, {useState, useRef, useEffect} from "react";
import axios from "axios";
import Project from "./Project";
import ModalProjectDetail from "./ModalProjectDetail";


const ProjectControl = () => {

    const tutorId = useRef('');         // login ID
    const selLecId = useRef(0);         // 강의 ID
    const selLecIdx = useRef(0);        // 강의리스트 index
    
    const [lecList, setLecList] = useState([]);                 // 강사의 강의목록
    const [lecDetail, setLecDetail] = useState({});             // 강의 상세정보

    const [projectListOn, setProjectListOn] = useState(false);
    const [projectRegisterModalOn, setProjectRegisterModalOn] = useState(false);

    
    useEffect(() => {
        searchLecList();
    }, []);

    // 강사의 강의목록 조회
    const searchLecList = () => {

        // var param = {
        // }
        // url: '/tut/projectLectureListjson',

        let params = new URLSearchParams();

        axios.post("/tut/projectLectureListjson.do", params)
            .then((res) => {
                // {"data":{"tutorId":"bbb123",
                //          "lectureList":[{"lec_id":1,"lec_name":"자바의이해",
                //                          "tutor_id":"bbb123","tutor_name":"스티븐잡스",
                //                          "lecrm_id":5,"lecrm_name":"8 강의실2",
                //                          "start_date":1709564400000,"end_date":1718377200000,
                //                          "pre_pnum":0,"max_pnum":50,"process_day":0},
                console.log("searchTutLecList() result console : " + JSON.stringify(res));

                setLecList(res.data.lectureList);
                setLecDetail(res.data.lectureList[0]);

                tutorId.current = res.data.tutorId;
                selLecId.current = res.data.lectureList[0].lec_id;

                setProjectListOn(true);                
            })
            .catch((err) => {
                console.log("searchTutLecList() result error : " + err.message);
                alert(err.message);
            });
    };

    // 강의 정보 상세조회
    const searchLecDetail = () => {        // var param = {
        //     tutorId : tutorId,
        //     lectureId : lecture_value
        // }
        // url:'/tut/projectLectureDetail',

        let params = new URLSearchParams();

        params.append('tutorId', tutorId.current);
        params.append('lectureId', selLecId.current);

        axios.post("/tut/projectLectureDetail.do", params)
            .then((res) => {
                // {"data":{"detailTutorLecture":{"lec_id":1,"lec_name":"자바의이해",
                //                                "tutor_id":"bbb123","tutor_name":"스티븐잡스",
                //                                "lecrm_id":5,"lecrm_name":"8 강의실2",
                //                                "start_date":1709564400000,"end_date":1718377200000,
                //                                "pre_pnum":0,"max_pnum":50,"process_day":0}}
                console.log("searchLecDetail() result console : " + JSON.stringify(res));
                setLecDetail(res.data.detailTutorLecture);
            })
            .catch((err) => {
                console.log("searchLecDetail() result error : " + err.message);
                alert(err.message);
            });
    }

    const searchProjectList = () => {
        searchLecDetail();
        setProjectListOn(true);
    }

    const registerProject = () => {
        setProjectListOn(false);
        setProjectRegisterModalOn(true);
    }

    // 날짜를 yyyy-MM-dd 형식으로 포맷하는 함수
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    return (
        <div className='content'>
            <p className='Location'>
                <a className='btn_set home'>메인으로</a>
                <span className='btn_nav bold'>학습관리</span>
                <span className='btn_nav bold'>과제관리</span>
                <a className='btn_set refresh'>새로고침</a>
            </p>

            {/* 강사의 강의목록 조회 */}
            <p className="conTitle">
                <span>강의목록</span>{" "}            
                <span className="fr">
                    <select id="searchKey" name="searchKey" 
                            onChange={(e) => {
                                selLecId.current = e.target.value;
                                selLecIdx.current = e.target.selectedIndex;
                            }}>
                    {
                        lecList.map((item, index) => {
                            return (
                                <option
                                    index={index}
                                    key={item.lec_id}
                                    value={item.lec_id}>
                                    {item.lec_name}
                                </option>
                            );
                        })
                    }
                    </select>
                    <button className="btn btn-primary"
                        id="searchbtn"
                        name="searchbtn"
                        onClick={(e) => {                            
                            searchProjectList();                            
                        }}
                    >
                        <span>검색</span>
                    </button>
                    <button className="btn btn-primary"
                        id="searchbtn"
                        name="searchbtn"
                        onClick={(e) => {
                            registerProject();
                        }}
                    >
                        <span>과제 올리기</span>
                    </button>
                </span>
            </p><br/>

            {/* 강의 상세정보 */}
            <div>
                {/* {"data":{"detailTutorLecture":{"lec_id":1,"lec_name":"자바의이해",
                                                   "tutor_id":"bbb123","tutor_name":"스티븐잡스",
                                                   "lecrm_id":5,"lecrm_name":"8 강의실2",
                                                   "start_date":1709564400000,"end_date":1718377200000,
                                                   "pre_pnum":0,"max_pnum":50,"process_day":0}}                                          */}
                <h4 style={{fontWeight: "bold"}}>수업 정보</h4>
                <table className="col">
                    <colgroup>
                        <col width="30%"/>
                        <col width="15%"/>
                        <col width="10%"/>
                        <col width="10%"/>
                        <col width="10%"/>
                        <col width="15%"/>
                        <col width="10%"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>강의명</th>
                            <th>강사명</th>
                            <th>개강일</th>
                            <th>종강일</th>
                            <th>강의실</th>
                            <th>현재인원</th>
                            <th>정원</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{lecDetail?.lec_name}</td>
                            <td>{lecDetail?.tutor_name}</td>
                            <td>{formatDate(lecDetail?.start_date)}</td>
                            <td>{formatDate(lecDetail?.end_date)}</td>
                            <td>{lecDetail?.lecrm_name}</td>
                            <td>{lecDetail?.pre_pnum}</td>
                            <td>{lecDetail?.max_pnum}</td>
                        </tr>
                    </tbody>
                </table>
            </div>{/* End 강의 상세정보 */}
            <br/><br/>
            {projectListOn? <Project lecId={selLecId.current}
                                     tutorId={tutorId.current}></Project> : null}
            {projectRegisterModalOn? <ModalProjectDetail modalAction={projectRegisterModalOn} 
                                                         setModalAction={setProjectRegisterModalOn} 
                                                         requestAction="I"
                                                         id={selLecId.current}
                                                         searchList={searchProjectList}></ModalProjectDetail> : null}
        </div>
    )    
}

export default ProjectControl