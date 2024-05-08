import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import axios from "axios";


const ModalStdLearnMat = (props) => {
    const [selinfo, setSelinfo] = useState({});

    useEffect(() => {

        if (props.id !== null && props.id !== "") {
            console.log("ModalStudent> props.id="+props.id);

            searchStdLearnMatDetail(props.id);
            return () => {
                setSelinfo({});
            }
        }
    }, [props.id]);

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

    // 학생 학습자료 정보 상세보기
    const searchStdLearnMatDetail = (learnDataId) => {

        // data : {
        //     learn_data_id : data,
        // },
        // url : '/std/stdLearnMatDetail.do',

        let params = new URLSearchParams();

        params.append('learn_data_id', learnDataId);

        axios.post("/std/stdLearnMatDetail.do", params)
            .then((res) => {
                // {"data":{"result":"SUCCESS",
                //          "std_detail":{"learn_data_id":1,"lec_id":0,
                console.log("searchStdLearnMatDetail() result console : " + JSON.stringify(res));

                setSelinfo(res.data.std_detail);
            })
            .catch((err) => {
                console.log("searchStdLearnMatDetail() result error : " + err.message);
                alert(err.message);
            });
    }

    const downloadFile = (fileUrl, fileName, learnDataId) => {
        
        let url = "/fileserver/tutor/" + fileName;

        console.log("fileUrl : " + fileUrl);
        console.log("fileName : " + fileName);
        console.log("learnDataId : " + learnDataId);
        console.log("url : " + url);


        // 파일 다운로드를 위한 fetch 요청
        if (window.confirm("다운로드하시겠습니까?")) {
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
        props.setModalAction(false);
    }

    return (
        <div>
            {/* 학생 학습자료 상세정보 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="stdLearnMatDtlForm">
                    <p className="conTitle">
                        <span>학습자료</span>
                    </p>
                    {/*"data":{"result":"SUCCESS",
                              "std_detail":{"learn_data_id":1,"lec_id":0,
                                            "learn_tit":"1주차 자바의 이해 학습자료입니다.123",
                                            "learn_con":"1주차 자바의 이해 학습자료입니다.수정입니다123",
                                            "w_date":"2024-04-11 10:35:37.0",
                                            "learn_fname":"93a609aa-9edc-467f-9ba4-b83e35be2c75_1주차 학습자료(수정본23).docx",
                                            "learn_url":"V:\\FileRepository\\tutor\\93a609aa-9edc-467f-9ba4-b83e35be2c75_1주차 학습자료(수정본23).docx",
                                            "learn_fsize":null,"lec_name":null},"resultMsg":"조회 되었습니다."*/}
                    <table style={{ width: "600px", height: "200px" }}>
                        <colgroup>
                            <col width="20%"/>
                            <col width="80%"/>
                        </colgroup>
                        <tr>
                            <th>등록일자</th>
                            <td>{selinfo?.w_date}</td>
                        </tr>
                        <tr>
                            <th>제목</th>
                            <td col>{selinfo?.learn_tit}</td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>{selinfo?.learn_con}</td>
                        </tr>
                        <tr>
                            <th>첨부파일</th>
                            <td className="pointer-cursor" 
                                onClick={() => {
                                    downloadFile(selinfo?.learn_url, selinfo?.learn_fname, selinfo?.learn_data_id)
                                }}>{selinfo?.learn_fname}
                            </td>
                        </tr>                                          
                    </table>
                        
                    <div className="modal-button">
                        <button className="btn btn-primary mx-2" 
                                onClick={close}>확인</button>                    
                    </div>  
                </div>  
            </Modal>{/* End 학생 학습자료 상세정보 모달 */}
        </div>
    )    
}

export default ModalStdLearnMat