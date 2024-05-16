import React, {useState, useEffect} from "react";
import axios from "axios";
import Pagination from "../../components/common/Pagination";
import ModalProjectDetail from "./ModalProjectDetail";
import ModalProjectSubmit from "./ModalProjectSubmit";


const Project = (props) => {

    let pageSize = 5;
    let blockSize = 10;

    const [projectDetailModalOn, setProjectDetailModalOn] = useState(false);
    const [projectSubmitModalOn, setProjectSubmitModalOn] = useState(false);
    const [selProjectId, setSelProjectId] = useState(0);

    const [projectCurrentPage, setProjectCurrentPage] = useState(1);
    const [projectTotalCnt, setProjectTotalCnt] = useState(0);  // 강의 과제 총 개수
    const [projectList, setProjectList] = useState([]);         // 강의 과제목록


    useEffect(() => {
        if (props.lecId !== null) {
            console.log("Project> lecId:" + props.lecId +", toturId:" + props.tutorId);
            searchProjectList();
        }
    }, [props.lecId, props.tutorId]);


    // 강의 과제목록 조회
    const searchProjectList = (cpage) => {
    
        cpage = typeof cpage === 'object'? 1 : cpage || 1;
        setProjectCurrentPage(cpage);

        // var param = {
		// 	tutorId : tutorId,
		// 	lectureId : lectureValue,
		// 	currentPage: currentPage,
		// 	pageSize : pageSize
		// }
        // url:'/tut/tutorProjectList',

        let params = new URLSearchParams();

        params.append('tutorId', props.tutorId);
        params.append('lectureId', props.lecId);
        params.append('currentPage', cpage);
        params.append('pageSize', pageSize);        

        axios.post("/tut/tutorProjectListjson.do", params)
            .then((res) => {
                // {"data":{"loginId":"bbb123","pageSize":5,
                //          "tutorProjectList":[{"projectId":2,"lectureId":1,
                //                               "projectTitle":"자바의 이해 과제입니다.123123",
                //                               "projectContent":"자바의 이해 과제입니다.123123",
                //                               "startDate":"2024-04-10","deadLineDate":"2024-05-25",
                //                               "hwk_fname":"8c67fbec-e6f0-4345-8cd2-bb05150711a5_1주차 학습자료(수정본23).docx",
                //                               "project_orginal_fname":null,
                //                               "hwk_url":"V:\\FileRepository\\project\\tutor\\8c67fbec-e6f0-4345-8cd2-bb05150711a5_1주차 학습자료(수정본23).docx",
                //                               "hwk_fsize":"21487Byte"}],
                //          "totalCount":2,"currentPage":1}
                console.log("searchProjectList() result console : " + JSON.stringify(res));

                setProjectTotalCnt(res.data.totalCount);
                setProjectList(res.data.tutorProjectList);
            })
            .catch((err) => {
                console.log("searchProjectList() result error : " + err.message);
                alert(err.message);
            });
    };

    // 강의 과제정보 상세보기 modal open
    const searchProjectDetail = (id) => {
        setSelProjectId(id);
        setProjectDetailModalOn(true);
    }

    // 과제 제출현황 상세보기 modal open
    const searchProjectSubmit = (id) => {
        setSelProjectId(id);
        setProjectSubmitModalOn(true);
    }

    return (
        <div>
             {/* 강의 과제목록 */}
             <div>
                <h4 style={{fontWeight: "bold"}}>과제 정보</h4>
                <table className="col">
                    <colgroup>
                        <col width="15%"/>
                        <col width="50%"/>
                        <col width="10%"/>
                        <col width="10%"/>
                        <col width="15%"/>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>과제 번호</th>
                            <th>과제 이름</th>
                            <th>제출일</th>
                            <th>마감일</th>
                            <th>제출 현황</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 과제 목록 looping */}
                        {/* {"data":{"loginId":"bbb123","pageSize":5,
                             "tutorProjectList":[{"projectId":2,"lectureId":1,
                                                  "projectTitle":"자바의 이해 과제입니다.123123",
                                                  "projectContent":"자바의 이해 과제입니다.123123",
                                                  "startDate":"2024-04-10","deadLineDate":"2024-05-25",
                                                  "hwk_fname":"8c67fbec-e6f0-4345-8cd2-bb05150711a5_1주차 학습자료(수정본23).docx",
                                                  "project_orginal_fname":null,
                                                  "hwk_url":"V:\\FileRepository\\project\\tutor\\8c67fbec-e6f0-4345-8cd2-bb05150711a5_1주차 학습자료(수정본23).docx",
                                                  "hwk_fsize":"21487Byte"}],
                             "totalCount":2,"currentPage":1} */}
                        {projectTotalCnt === 0 && (
                            <tr><td colSpan="5">데이터가 존재하지 않습니다.</td></tr>
                        )}
                        {
                            projectTotalCnt > 0 && projectList.map((item) => {
                                return (
                                    <tr key={item.projectId}>
                                        <td>{item.projectId}</td>
                                        <td onClick={() => searchProjectDetail(item.projectId)}>{item.projectTitle}</td>
                                        <td>{item.startDate}</td>
                                        <td>{item.deadLineDate}</td>
                                        <td className="pointer-cursor" 
                                            onClick={() => {
                                                searchProjectSubmit(item.projectId)
                                            }}>자세히 보기
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                 {/* 과제목록 페이징 */}
                 {projectTotalCnt > 0 && <Pagination currentPage={projectCurrentPage}
                                                     totalPage={projectTotalCnt}
                                                     pageSize={pageSize}
                                                     blockSize={blockSize}
                                                     onClick={searchProjectList}/>}
            </div>{/* End 강의 과제목록 */}

            {projectDetailModalOn? <ModalProjectDetail modalAction={projectDetailModalOn} 
                                                    setModalAction={setProjectDetailModalOn} 
                                                    requestAction="U"
                                                    id={selProjectId}
                                                    searchList={searchProjectList}></ModalProjectDetail> : null}
            {projectSubmitModalOn? <ModalProjectSubmit modalAction={projectSubmitModalOn} 
                                                    setModalAction={setProjectSubmitModalOn} 
                                                    projectId={selProjectId}></ModalProjectSubmit> : null}
        </div>
    )    
}

export default Project