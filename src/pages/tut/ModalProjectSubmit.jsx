import React, {useState, useEffect, useRef} from "react";
import Modal from "react-modal";
import axios from "axios";
import * as commonjs from "../../components/common/commonfunction.js"



const ModalProjectSubmit = (props) => {
    const [selinfo, setSelinfo] = useState({});

    const [projectSubmitTotalCnt, setProjectSubmitTotalCnt] = useState(0);  // 과제제출 총 개수
    const [projectSubmitList, setProjectSubmitList] = useState([]);         // 과제제출 목록


    const inputProjectTitle = useRef();
    const inputProjectContent = useRef();
    const inputStartDate = useRef();
    const inputDeadLineDate = useRef();

    useEffect(() => {

        if (props.projectId !== null && props.projectId !== "") {
            console.log("ModalProjectSubmit> props.projectId=" + props.projectId);

            searchProjectSubmitDetail(props.projectId);
        }
        return () => {
            setSelinfo({});
        }
    }, [props.projectId]);

    // 과제 제출현황 상세보기
    const searchProjectSubmitDetail = (projectId) => {

        // url:url:'/tut/showStudentProject/' + data,
        // type: "GET",

        axios.get("/tut/showStudentProjectjson/" + projectId)
            .then((res) => {
                // {"data":{"studentProjectList":[{"submit_id":"20","std_id":"123123","student_name":"123","hwk_id":"2",
                //                                 "submit_con":"일단 자바의 이해로 과제 테스트를 진행중입니다. ",
                //                                 "submit_fname":"eXERD.exe",
                //                                 "submit_url":"V:\\FileRepository\\submit\\eXERD,,,b0c6fc64-c3d5-4adf-9005-b5fcb33bdefa.exe",
                //                                 "submit_fsize":"53248","submit_date":"2024-04-16"}],
                //          "totalCount":2}
                console.log("searchProjectSubmitDetail() result console : " + JSON.stringify(res));

                setProjectSubmitTotalCnt(res.data.totalCount);
                setProjectSubmitList(res.data.studentProjectList);
            })
            .catch((err) => {
                console.log("searchProjectSubmitDetail() result error : " + err.message);
                alert(err.message);
            });
    }

    const downloadFile = (fileUrl, fileName) => {
        
        let url = "/fileserver/tut/studentProject/fileDownLoad/" + fileName;
        console.log("fileUrl : " + fileUrl);
        console.log("fileName : " + fileName);
        console.log("url : " + url);


        // 파일 다운로드를 위한 fetch 요청
        if (window.confirm("다운로드 하시겠습니까?")) {
            fetch(url)
                .then(response => response.blob()) // 파일 데이터를 Blob으로 변환
                .then(blob => {
                    // Blob을 URL로 변환
                    const blobUrl = window.URL.createObjectURL(blob);

                    // a 태그를 이용하여 다운로드 링크 생성
                    const downloadLink = document.createElement('a');
                    downloadLink.href = blobUrl;
                    downloadLink.download = fileName; // 다운로드될 파일의 이름 설정

                    // 다운로드 링크 클릭 및 제거
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);

                    // Blob URL 해제
                    window.URL.revokeObjectURL(blobUrl);
                })
                .catch(error => {
                    console.error('Error downloading file:', error);
                });
        }
    }

    const close = () => {
        setSelinfo({});
        props.setModalAction(false);
    }

    const modalStyle = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            transform: "translate(-50%, -50%)",
        },
    };

    return (
        <div>
            {/* 과제 제출현황 상세보기 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="projectSubmitForm">
                    <p className="conTitle">
                        <span>제출 현황</span>
                    </p>
                    <table className="col">
                        <colgroup>
                            <col width="20%"/>
                            <col width="45%"/>
                            <col width="15%"/>
                            <col width="20%"/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>학생 이름</th>
                                <th>과제 제목</th>
                                <th>파일</th>
                                <th>제출일</th>
                            </tr>
                        </thead>
                        <tbody>
                        {/* 과제제출 목록 looping */}
                        {/* {"data":{"studentProjectList":[{"submit_id":"20","std_id":"123123","student_name":"123","hwk_id":"2",
                                                            "submit_con":"일단 자바의 이해로 과제 테스트를 진행중입니다. ",
                                                            "submit_fname":"eXERD.exe",
                                                            "submit_url":"V:\\FileRepository\\submit\\eXERD,,,b0c6fc64-c3d5-4adf-9005-b5fcb33bdefa.exe",
                                                            "submit_fsize":"53248","submit_date":"2024-04-16"}],
                                     "totalCount":2} */}
                        {projectSubmitTotalCnt === 0 && (
                            <tr><td colSpan="4">데이터가 존재하지 않습니다.</td></tr>
                        )}
                        {
                            projectSubmitTotalCnt > 0 && projectSubmitList.map((item) => {
                                return (
                                    <tr key={item.submit_id}>
                                        <td>{item.student_name}</td>
                                        <td>{item.submit_con}</td>
                                        <td className="pointer-cursor" 
                                            onClick={() => {
                                                downloadFile(item.submit_url, item.submit_fname)
                                            }}>다운로드
                                        </td>
                                        <td>{item.submit_date}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    </table><br/>
                    <div className="modal-button">
                        <button className="btn btn-primary mx-2" onClick={close}>확인</button>
                    </div>
                </div>
            </Modal>{/* End 과제 제출현황 상세보기 모달 */}
        </div>
    )    
}

export default ModalProjectSubmit