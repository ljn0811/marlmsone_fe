import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import axios from "axios";


const ModalLecStudent = (props) => {
    const [selinfo, setSelinfo] = useState({});
    const [stdLecList, setStdLecList] = useState([]);

    useEffect(() => {

        if (props.tutorId !== null && props.tutorId !== "" &&
            props.stdId !== null && props.stdId !== "") {
            console.log("ModalStudent> props.tutorId="+props.tutorId);
            console.log("ModalStudent> props.stdId="+props.stdId);

            searchLecStdInfoDetail(props.tutorId, props.stdId);
            return () => {
                setSelinfo({});
            }
        }
    }, [props.tutodId, props.stdId]);

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

    // 수강생 정보 상세보기
    const searchLecStdInfoDetail = (tutorId, stdId) => {

        // var param = {
        //     tutorId : tutorId,
        //     studentId : studentId
        // }
        // url: '/tut/lectureStudentDetail',

        let params = new URLSearchParams();

        params.append('tutorId', tutorId);
        params.append('studentId', stdId);

        axios.post("/tut/lectureStudentDetail.do", params)
            .then((res) => {
                // {"data":{"detailTutorLecture":[{"lec_Id":1,"lec_name":"자바의이해",
                console.log("searchLecStdDetail() result console : " + JSON.stringify(res));
                
                setSelinfo(res.data.detailTutorLecture[0]);
                setStdLecList(res.data.detailTutorLecture);                
            })
            .catch((err) => {
                console.log("searchLecStdDetail() result error : " + err.message);
                alert(err.message);
            });
    }

    const close = () => {
        props.setModalAction(false);
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
        <div>
            {/* 수강생 상세정보 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="stdDtlForm">
                    <p className="conTitle">
                        <span>수강생 정보</span>
                    </p>
                    {/* {"data":{"detailTutorLecture":[{"lec_Id":1,"lec_name":"자바의이해",
                                                 "std_id":"123123 ","student_name":"123",
                                                 "student_number":"26","student_tel":"123-1231-1234",
                                                 "student_sex":"M","student_mail":"123@123",
                                                 "student_addr":"123,123,123","join_date":"2021-05-06",
                                                 "survey_yn":"y","approve_yn":"Y",
                                                 "startDate":"2024-03-05","endDate":"2024-06-15"}, */}
                    <table style={{ width: "550px", height: "200px" }}>
                        <colgroup>
                            <col width="15%"/>
                            <col width="35%"/>
                            <col width="15%"/>
                            <col width="35%"/>
                        </colgroup>
                        <tr>
                            <th>ID</th>
                            <td>{selinfo?.std_id}</td>
                            <th>학번</th>
                            <td>{selinfo?.student_number}</td>
                        </tr>
                        <tr>
                            <th>이름</th>
                            <td>{selinfo?.student_name}</td>
                            <th>성별</th>
                            <td>{selinfo?.student_sex}</td>
                        </tr>
                        <tr>
                            <th>전화번호</th>
                            <td>{selinfo?.student_tel}</td>
                            <th>이메일</th>
                            <td>{selinfo?.student_mail}</td>
                        </tr>
                        <tr>
                            <th>주소</th>
                            <td colSpan="3">{selinfo?.student_addr}</td>
                        </tr>                                          
                    </table>
                    <table className="col">
                        <colgroup>
                            <col width="15%"/>
                            <col width="25%"/>
                            <col width="60%"/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>과정ID</th>
                                <th>과정명</th>
                                <th>기간</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 수강생의 수강 목록 looping */}
                            {
                                stdLecList.length > 0 && stdLecList.map((item) => {
                                    return (
                                        <tr>
                                            <td>{item.lec_Id}</td>
                                            <td>{item.lec_name}</td>
                                            <td>{formatDate(item.startDate)} ~ {formatDate(item.endDate)}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>                                                      
                    <div className="modal-button">
                        <button className="btn btn-primary mx-2" onClick={close}>확인</button>
                    </div>
                </div>    
            </Modal>{/* End 수강생 상세정보 모달 */}
        </div>
    )    
}

export default ModalLecStudent