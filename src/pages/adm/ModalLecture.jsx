import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import axios from "axios";


const ModalTutLecture = (props) => {
    const [selinfo, setSelinfo] = useState({});

    useEffect(() => {

        if (props.tutorId !== null && props.tutorId !== "" &&
            props.lecId !== null && props.lecId !== "") {
            console.log("ModalLecture> props.tutorId="+props.tutorId);
            console.log("ModalLecture> props.lecId="+props.lecId);

            searchLecInfoDetail(props.tutorId, props.lecId);
            return () => {
                setSelinfo({});
            }
        }
    }, [props.tutorId, props.lecId]);


    // 강의 정보 상세보기
    const searchLecInfoDetail = (tutorId, lecId) => {
        
        // var param = {
        //     tutorId : tutorId,
        //     lectureId : data
        // }
        // url: '/tut/tutorLectureDetail',

        let params = new URLSearchParams();

        params.append('tutorId', tutorId);
        params.append('lectureId', lecId);

        axios.post("/tut/tutorLectureDetail.do", params)
            .then((res) => {
                // {"data":{"detailTutorLecture":{"lec_id":1,"lec_name":"자바의이해",
                console.log("searchLecDetail() result console : " + JSON.stringify(res));

                setSelinfo(res.data.detailTutorLecture);
            })
            .catch((err) => {
                console.log("searchLecDetail() result error : " + err.message);
                alert(err.message);
            });
    }

    const close = () => {
        props.setModalAction(false);
        props.setListAction(false);
    }

    // 날짜를 yyyy-MM-dd 형식으로 포맷하는 함수
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
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
            {/* 강의 상세정보 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="lecDtlForm">
                    <p className="conTitle">
                        <span>강의 정보</span>
                    </p>
                    {/* {"data":{"detailTutorLecture":{"lec_id":1,"lec_name":"자바의이해",
                                  "tutor_id":"bbb123","tutor_name":"스티븐잡스",
                                  "lecrm_id":5,"lecrm_name":"4 강의실",
                                  "start_date":1709564400000,"end_date":1718377200000,
                                  "pre_pnum":5,"max_pnum":50,"process_day":0}}, */}
                    <table style={{ width: "550px", height: "200px" }}>
                        <tr>
                            <th>강의명</th>
                            <td>{selinfo?.lec_name}</td>
                        </tr>
                        <tr>
                            <th>최대인원</th>
                            <td>{selinfo?.max_pnum}</td>
                        </tr>
                        <tr>
                            <th>강사명</th>
                            <td>{selinfo?.tutor_name}</td>
                        </tr>
                        <tr>
                            <th>강의실</th>
                            <td>{selinfo?.lecrm_name}</td>
                        </tr>
                        <tr>
                            <th>과정일수</th>
                            <td>{selinfo?.process_day}</td>
                        </tr>
                        <tr>
                            <th>시작일자</th>
                            <td>{formatDate(selinfo?.start_date)}</td>
                        </tr>
                        <tr>
                            <th>종료일자</th>
                            <td>{formatDate(selinfo?.end_date)}</td>
                        </tr>                                            
                    </table>
                    <div className="modal-button">
                        <button className="btn btn-primary mx-2" onClick={close}>확인</button>
                    </div>  
                </div>    
            </Modal>{/* End 강의 상세정보 모달 */}
        </div>
    )    
}

export default ModalTutLecture