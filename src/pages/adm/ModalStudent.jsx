import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import axios from "axios";
import ModalStdLecRegister from "./ModalStdLecRegister";


const ModalStudent = (props) => {
    const [selinfo, setSelinfo] = useState({});
    const [stdLecList, setStdLecList] = useState([]);
    const [stdLecTotalCnt, setStdLecTotalCnt] = useState(0);
    const [lecRegModalOn, setLecRegModalOn] = useState(false);


    useEffect(() => {

        if (props.stdId !== null && props.stdId !== "") {
            console.log("ModalStudent> props.stdId="+props.stdId);

            searchStdInfoDetail(props.stdId);
            searchStdLecList(props.stdId);
            return () => {
                setSelinfo({});
            }
        }
    }, [props.stdId]);

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

    // 학생 정보 상세보기
    const searchStdInfoDetail = (stdId) => {

		// var param = {
		// 	loginID : loginID
		// };
        // callAjax("/adm/user_info.do", "post", "json", true, param, resultCallback);
        let params = new URLSearchParams();

        params.append('loginID', stdId);

        axios.post("/adm/user_info.do", params)
            .then((res) => {
                // {"data":{"result":"SUCCESS",
                //          "user_model":{"lec_id":0,"lecrm_id":0,"max_pnum":0,"pre_pnum":0,
                //                        "start_date":null,"end_date":null,"process_day":0,
                //                        "lec_type_id":0,"lec_type_name":null,"test_id":0,
                //                        "test_start":null,"test_end":null,"tutor_id":null,
                //                        "lec_name":null,"lec_goal":null,"lec_sort":null,
                //                        "loginID":"wont92","user_type":"A","use_yn":null,
                //                        "name":"원태형","password":"123","tel":"221-2312-3123",
                //                        "sex":"M","mail":"asdbx@gmail.com",
                //                        "addr":"경기 시흥시 장현천로 170 (군자동, 장현 동원로얄듀크 메트로포레)",
                //                        "join_date":null,"regi_num":null,"std_num":null},
                //             "resultMsg":"조회 되었습니다."}
                console.log("searchStdInfoDetail() result console : " + JSON.stringify(res));
                
                setSelinfo(res.data.user_model);
            })
            .catch((err) => {
                console.log("searchStdInfoDetail() result error : " + err.message);
                alert(err.message);
            });
    }

    // 학생 수강내역 조회
    const searchStdLecList = (stdId) => {

        // var param = {
		// 	loginID : loginID,
		// 	user_type:'a'
		// }
        // callAjax("/adm/slist_lec.do", "post", "text", true, param, resultCallback);
        
        let params = new URLSearchParams();

        params.append('loginID', stdId);
        params.append('user_type', 'a');

        axios.post("/adm/slist_lec_json.do", params)
            .then((res) => {
                // {"data":{"slist_lec":[{"lec_id":1,"lecrm_id":0,"max_pnum":0,"pre_pnum":0,
                //                        "start_date":"2024.03.05","end_date":"2024.06.15","process_day":0,
                //                        "lec_type_id":0,"lec_type_name":null,"test_id":0,"test_start":null,"test_end":null,
                //                        "tutor_id":null,"lec_name":"자바의이해","lec_goal":null,"lec_sort":null,
                //                        "loginID":null,"user_type":null,"use_yn":null,"name":null,"password":null,
                //                        "tel":null,"sex":null,"mail":null,"addr":null,
                //                        "join_date":null,"regi_num":null,"std_num":null}],
                //          "std_lec_count":1}
                console.log("searchStdLecList() result console : " + JSON.stringify(res));

                setStdLecTotalCnt(res.data.std_lec_count);
                setStdLecList(res.data.slist_lec);
            })
            .catch((err) => {
                console.log("searchStdLecList() result error : " + err.message);
                alert(err.message);
            });
    }

    // 수강신청 취소
    const cancelStdLec = (stdId, lecId) => {

        if ( window.confirm("수강을 취소하겠습니까?") ) {
            // var param = {
			// 	std_id : std_id,
			// 	lec_id : lec_id
		    // }	
            // callAjax("/adm/std_lec_del.do", "post", "json", true, param, resultCallback);

            let params = new URLSearchParams();

            params.append('std_id', stdId);
            params.append('lec_id', lecId);

            axios.post("/adm/std_lec_del.do", params)
                .then((res) => {
                    // {"data":{"result":"SUCCESS","resultMsg":"수강 취소 되었습니다."}
                    console.log("cancelStdLec() result console : " + JSON.stringify(res));

                    if (res.data.result === "SUCCESS") {
                        alert(res.data.resultMsg);
                        searchStdLecList(props.stdId);
                    }
                })
                .catch((err) => {
                    console.log("cancelStdLec() result error : " + err.message);
                    alert(err.message);
                });
        }
    }

    // 수강등록 modal open
    const registerLec = () => {
        setLecRegModalOn(true);
    }

    const close = () => {
        props.setModalAction(false);
    }

    function isLecEnded(end_date) {
        const currentDate = new Date();
        const endDate = new Date(end_date);

        if (currentDate > endDate) {
            return true;
        }
        return false;
    }

    return (
        <div>
            {/* 학생 상세정보 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="stdDtlForm">
                    <p className="conTitle">
                        <span>학생 정보</span>
                    </p>
                    {/* {"data":{"result":"SUCCESS",
                             "user_model":{"lec_id":0,"lecrm_id":0,"max_pnum":0,"pre_pnum":0,
                                           "start_date":null,"end_date":null,"process_day":0,
                                           "lec_type_id":0,"lec_type_name":null,"test_id":0,
                                           "test_start":null,"test_end":null,"tutor_id":null,
                                           "lec_name":null,"lec_goal":null,"lec_sort":null,
                                           "loginID":"wont92","user_type":"A","use_yn":null,
                                           "name":"원태형","password":"123","tel":"221-2312-3123",
                                           "sex":"M","mail":"asdbx@gmail.com",
                                           "addr":"경기 시흥시 장현천로 170 (군자동, 장현 동원로얄듀크 메트로포레)",
                                           "join_date":null,"regi_num":null,"std_num":null},
                             "resultMsg":"조회 되었습니다."} */}
                    {/* <table style={{ width: "550px", height: "200px" }}> */}
                    <table className="col">                   
                        <colgroup>
                            <col width="15%"/>
                            <col width="35%"/>
                            <col width="15%"/>
                            <col width="35%"/>
                        </colgroup>
                        <tr>
                            <th>ID</th>
                            <td>{selinfo?.loginID}</td>
                            <th>학번</th>
                            <td>{selinfo?.std_num}</td>
                        </tr>
                        <tr>
                            <th>이름</th>
                            <td>{selinfo?.name}</td>
                            <th>생년월일</th>
                            <td>{selinfo?.regi_num}</td>
                        </tr>
                        <tr>
                            <th>전화번호</th>
                            <td>{selinfo?.tel}</td>
                            <th>성별</th>
                            <td>{selinfo?.sex}</td>
                        </tr>
                        <tr>
                            <th>이메일</th>
                            <td>{selinfo?.mail}</td>
                        </tr>
                        <tr>
                            <th>주소</th>
                            <td colSpan="3">{selinfo?.addr}</td>
                        </tr>
                    </table>
                    <p className="conTitle">
                        <span>강의목록</span>{" "}            
                            <span className="fr">
                            <button className="btn btn-primary"
                                id="registerbtn"
                                name="registerbtn"
                                onClick={(e) => {
                                    registerLec()
                                }}
                            ><span>수강등록</span>
                            </button>
                        </span>
                    </p>
                    <table className="col">                   
                        <colgroup>
                            <col width="15%"/>
                            <col width="25%"/>
                            <col width="35%"/>
                            <col width="15%"/>
                            <col width="10%"/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>강의ID</th>
                                <th>강의명</th>
                                <th>기간</th>
                                <th>상태</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 수강생의 수강 목록 looping */}
                            {/* {"data":{"slist_lec":[{"lec_id":1,"lecrm_id":0,"max_pnum":0,"pre_pnum":0,
                                                   "start_date":"2024.03.05","end_date":"2024.06.15","process_day":0,
                                                   "lec_type_id":0,"lec_type_name":null,"test_id":0,"test_start":null,"test_end":null,
                                                   "tutor_id":null,"lec_name":"자바의이해","lec_goal":null,"lec_sort":null,
                                                   "loginID":null,"user_type":null,"use_yn":null,"name":null,"password":null,
                                                   "tel":null,"sex":null,"mail":null,"addr":null,
                                                   "join_date":null,"regi_num":null,"std_num":null}],
                                     "std_lec_count":1} */}
                            {
                                stdLecTotalCnt === 0 && (
                                <tr><td colSpan="5">수강정보가 없습니다.</td></tr>)}
                            {
                                stdLecTotalCnt > 0 && stdLecList.map((item) => {
                                    return (
                                        <tr>
                                            <td>{item.lec_id}</td>
                                            <td>{item.lec_name}</td>
                                            <td>{item.start_date} ~ {item.end_date}</td>                                            
                                            <td>{isLecEnded(item.end_date)? '종료' : '진행중'}</td>
                                            <td>
                                                {isLecEnded(item.end_date)? (
                                                    <span>수강종료</span>) : (
                                                        <button className="btn btn-primary"
                                                            onClick={(e) => {
                                                                cancelStdLec(props.stdId, item.lec_id)
                                                            }}>
                                                        <span>수강취소</span>
                                                    </button>
                                                    )
                                                }
                                            </td>
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
            </Modal>{/* End 학생 상세정보 모달 */}
            {lecRegModalOn? <ModalStdLecRegister modalAction={lecRegModalOn} 
                                            setModalAction={setLecRegModalOn}
                                            stdId={props.stdId}
                                            setList={setStdLecList}
                                            setTotalCnt={setStdLecTotalCnt}></ModalStdLecRegister> : null}
        </div>
    )    
}

export default ModalStudent