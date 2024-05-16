import React, {useState, useEffect, useRef} from "react";
import Modal from "react-modal";
import axios from "axios";
import * as commonjs from "../../components/common/commonfunction.js"



const ModalProjectDetail = (props) => {
    const [selinfo, setSelinfo] = useState({});

    const inputProjectTitle = useRef();
    const inputProjectContent = useRef();
    const inputStartDate = useRef();
    const inputDeadLineDate = useRef();
    const inputFile = useRef();

    useEffect(() => {

        console.log("ModalProjectDetail> props.requestAction=" + props.requestAction + ", props.id=" + props.id);
        if (props.requestAction === "U") {
            searchProjectDetail(props.id);
        }
        if (props.requestAction === "I") {
            setSelinfo(prevSelinfo => ({
                ...prevSelinfo,
                startDate: getTodayDate(),
                deadLineDate: getTodayDate(),
            }));
        }
        
        return () => {
            setSelinfo({});
        }
    }, [props.id]);

    // 과제정보 상세보기
    const searchProjectDetail = (projectId) => {

		// var param = {
		// 	projectDateId : projectDateId
		// };
        // url:'/tut/getDetailTutorProject',

        let params = new URLSearchParams();

        params.append('projectDateId', projectId);

        axios.post("/tut/getDetailTutorProject.do", params)
            .then((res) => {
                // "data":{"detailTutorProject":{"projectId":2,"lectureId":1,
                //                               "projectTitle":"자바의 이해 과제입니다.123123",
                //                               "projectContent":"자바의 이해 과제입니다.123123",
                //                               "startDate":"2024-04-10","deadLineDate":"2024-05-25",
                //                               "hwk_fname":"8c67fbec-e6f0-4345-8cd2-bb05150711a5_1주차 학습자료(수정본23).docx",
                //                               "project_orginal_fname":"1주차 학습자료(수정본23).docx",
                //                               "hwk_url":"V:\\FileRepository\\project\\tutor\\8c67fbec-e6f0-4345-8cd2-bb05150711a5_1주차 학습자료(수정본23).docx",
                //                               "hwk_fsize":"21487Byte"}}
                console.log("searchProjectDetail() result console : " + JSON.stringify(res));
                
                setSelinfo(res.data.detailTutorProject);                
            })
            .catch((err) => {
                console.log("searchProjectDetail() result error : " + err.message);
                alert(err.message);
            });
    }

    const checkValidation = (checkItem, alertMsg) => {

        let nullcheckResult = commonjs.nullcheck([
            { inval: checkItem, msg: alertMsg },
        ]);
        
        return nullcheckResult;
    }

    // 과제 등록
    const registerProject = () => {

        if ( window.confirm("과제를 등록하겠습니까?") ) {
            if (!checkValidation(selinfo?.projectTitle, "제목을 입력해 주세요")) { inputProjectTitle.current.focus(); return; }
            if (!checkValidation(selinfo?.projectContent, "내용을 입력해 주세요")) { inputProjectContent.current.focus(); return; }
            if (!checkValidation(inputStartDate.current.value, "제출일을 선택해 주세요")) { inputStartDate.current.focus(); return; }
            if (!checkValidation(inputDeadLineDate.current.value, "마감일을 선택해 주세요")) { inputDeadLineDate.current.focus(); return; }
            if (!checkValidation(inputFile.current.value, "파일을 선택해 주세요")) { inputFile.current.focus(); return; }

            if (inputStartDate.current.value < getTodayDate()) {
                alert("오늘 이전 날짜는 선택할 수 없습니다.");

                inputStartDate.current.value = getTodayDate();
                inputStartDate.current.focus(); 
                return;
            }
            if (inputDeadLineDate.current.value < getTodayDate()) {
                alert("오늘 이전 날짜는 선택할 수 없습니다.");

                inputDeadLineDate.current.value = getTodayDate();
                inputDeadLineDate.current.focus(); 
                return;
            }

    
            // var formData = new FormData();		
            // formData.append("lectureValue", lectureValue);
            // formData.append("projectTitle", projectTitle);
            // formData.append("proejectContent", proejectContent);
            // formData.append("projectSubmitDate", projectSubmitDate);
            // formData.append("projectDeadLineDate", projectDeadLineDate);
            // formData.append("file", file);
            // url:'/tut/saveLectureProject',

            const formData = new FormData();

            formData.append('lectureValue', props.id);
            formData.append('projectTitle', inputProjectTitle.current.value);
            formData.append('proejectContent', inputProjectContent.current.value);
            formData.append('projectSubmitDate', inputStartDate.current.value);
            formData.append('projectDeadLineDate', inputDeadLineDate.current.value);
            if (selinfo.file) {
                formData.append('file', selinfo.file);
            }

            axios.post("/tut/saveLectureProject", formData)
                .then((res) => {
                    // {"data":true,"status":200,"statusText":"OK"
                    console.log("registerProject() result console : " + JSON.stringify(res));

                    if (res.data === true) {
                        alert("과제 등록이 완료되었습니다.");
                        close();
                    }
                })
                .catch((err) => {
                    console.log("registerProject() result error : " + err.message);
                    alert(err.message);
                });
        }
    }

    // 과제 수정
    const updateProject = () => {

        if ( window.confirm("과제를 수정하겠습니까?") ) {
            if (!checkValidation(selinfo?.projectTitle, "제목을 입력해 주세요")) { inputProjectTitle.current.focus(); return; }
            if (!checkValidation(selinfo?.projectContent, "내용을 입력해 주세요")) { inputProjectContent.current.focus(); return; }
            if (!checkValidation(inputStartDate.current.value, "제출일을 선택해 주세요")) { inputStartDate.current.focus(); return; }
            if (!checkValidation(inputDeadLineDate.current.value, "마감일을 선택해 주세요")) { inputDeadLineDate.current.focus(); return; }

            if (inputStartDate.current.value < getTodayDate()) {
                alert("오늘 이전 날짜는 선택할 수 없습니다.");
                inputStartDate.current.focus(); return; 
            }
            if (inputDeadLineDate.current.value < getTodayDate()) {
                alert("오늘 이전 날짜는 선택할 수 없습니다.");
                inputDeadLineDate.current.focus(); return; 
            }
            
            // formData.append("projectId", projectId);
            // formData.append("updateProjectTitle", updateProjectTitle);
            // formData.append("updateProjectContent", updateProjectContent);
            // formData.append("updateProjectSubmitDate", updateProjectSubmitDate);
            // formData.append("updateProjectDeadLineDate", updateProjectDeadLineDate);
            // formData.append("updateFile", updateFile);
			// url: '/tut/updateTutorProject',

            const formData = new FormData();

            formData.append('projectId', props.id);
            formData.append('updateProjectTitle', inputProjectTitle.current.value);
            formData.append('updateProjectContent', inputProjectContent.current.value);
            formData.append('updateProjectSubmitDate', inputStartDate.current.value);
            formData.append('updateProjectDeadLineDate', inputDeadLineDate.current.value);
            if (selinfo.file) {
                formData.append('updateFile', selinfo.file);
            }

            axios.post("/tut/updateTutorProject", formData)
                .then((res) => {
                    // {"data":true,"status":200,"statusText":"OK"
                    console.log("updateProject() result console : " + JSON.stringify(res));

                    if (res.data === true) {
                        alert("과제 수정이 완료되었습니다.");
                        close();
                    }
                })
                .catch((err) => {
                    console.log("updateProject() result error : " + err.message);
                    alert(err.message);
                });
        }
    }

    // 과제 삭제
    const deleteProject = () => {

        if ( window.confirm("과제를 정말로 삭제하겠습니까?") ) {

            // url:'/tut/deleteTutorProject/' + projectId,
			// type: "GET",

            axios.get("/tut/deleteTutorProject/" + props.id)
                .then((res) => {
                    // {"data":true,"status":200,"statusText":"OK"
                    console.log("deleteProject() result console : " + JSON.stringify(res));

                    if (res.data === true) {
                        alert("과제가 삭제되었습니다.");
                        close();
                    }
                })
                .catch((err) => {
                    console.log("deleteProject() result error : " + err.message);
                    alert(err.message);
                });
        }
    }

    const downloadFile = (fileUrl, fileName, downloadFileName) => {
        
        let url = "/serverfile/project/tutor/" + fileName;

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
                    downloadLink.download = downloadFileName; // 다운로드될 파일의 이름 설정

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
        props.searchList();
        props.setModalAction(false);
    }

    // 오늘 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

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
            {/* 과제정보 상세보기 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="projectDtlForm">
                    <p className="conTitle">
                        <span>과제 등록</span>
                    </p>
                    {/* "data":{"detailTutorProject":{"projectId":2,"lectureId":1,
                                                      "projectTitle":"자바의 이해 과제입니다.123123",
                                                      "projectContent":"자바의 이해 과제입니다.123123",
                                                      "startDate":"2024-04-10","deadLineDate":"2024-05-25",
                                                      "hwk_fname":"8c67fbec-e6f0-4345-8cd2-bb05150711a5_1주차 학습자료(수정본23).docx",
                                                      "project_orginal_fname":"1주차 학습자료(수정본23).docx",
                                                      "hwk_url":"V:\\FileRepository\\project\\tutor\\8c67fbec-e6f0-4345-8cd2-bb05150711a5_1주차 학습자료(수정본23).docx",
                                                      "hwk_fsize":"21487Byte"}} */}
                    <p>
                        ※ <span className="font_red">제출일</span>과 <span className="font_red">마감일</span>을 반드시 입력하세요.
                    </p>
                    <table style={{ width: "500px", height: "250px" }}>
                        <colgroup>
                            <col width="15%"/>
                            <col width="35%"/>
                            <col width="50%"/>
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>제목<span className="font_red">*</span></th>
                                <td colSpan="2">
                                    <input 
                                        type ="text"
                                        className="form-control input-sm"
                                        defaultValue={selinfo?.projectTitle}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, projectTitle: e.target.value }
                                            });
                                        }}
                                        ref={inputProjectTitle}
                                    />                                
                                </td>
                            </tr>
                            <tr>
                                <th>내용<span className="font_red">*</span></th>
                                <td colSpan="2">
                                    <input 
                                        type ="text"
                                        className="form-control input-sm"
                                        defaultValue={selinfo?.projectContent}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, projectContent: e.target.value }
                                            });
                                        }}
                                        ref={inputProjectContent}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>제출일<span className="font_red">*</span></th>
                                <td colSpan="2">
                                    <input 
                                        type ="date"
                                        className="form-control input-sm"
                                        defaultValue={selinfo?.startDate}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, startDate: e.target.value }
                                            });
                                        }}
                                        ref={inputStartDate}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>마감일<span className="font_red">*</span></th>
                                <td colSpan="2">
                                    {console.log("#### " + selinfo?.deadLineDate)}
                                    <input 
                                        type ="date"
                                        className="form-control input-sm"
                                        defaultValue={selinfo?.deadLineDate}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, deadLineDate: e.target.value }
                                            });
                                        }}
                                        ref={inputDeadLineDate}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    파일
                                    {(props.requestAction === "I") && (
                                    <span className="font_red">*</span>
                                    )}
                                </th>
                                <td>
                                    <input 
                                        type ="file"
                                        className="form-control input-sm"
                                        onChange={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, file: e.target.files[0] }
                                            });
                                        }}
                                        ref={inputFile}
                                    />
                                </td>
                                <td className="pointer-cursor" 
                                    style={{textAlign: "right"}}
                                    onClick={() => {
                                        downloadFile(selinfo?.hwk_url, selinfo?.hwk_fname, selinfo?.project_orginal_fname)
                                    }}>{selinfo?.project_orginal_fname}
                                </td>
                            </tr>
                        </tbody>
                    </table><br/>

                    {(props.requestAction === "I") && (
                        <div className="modal-button">
                            <button className="btn btn-primary mx-2" onClick={registerProject}>등록</button>
                            <button className="btn btn-primary mx-2" onClick={close}>취소</button>
                        </div>
                    )}
                    {(props.requestAction === "U") && (
                        <div className="modal-button">
                            <button className="btn btn-primary mx-2" onClick={updateProject}>수정</button>
                            <button className="btn btn-primary mx-2" onClick={deleteProject}>삭제</button>
                            <button className="btn btn-primary mx-2" onClick={close}>취소</button>
                        </div>
                    )}
                </div>    
            </Modal>{/* End 과제정보 상세보기 모달 */}            
        </div>
    )    
}

export default ModalProjectDetail