import React, {useState, useEffect} from "react";
import Modal from "react-modal";
import axios from "axios";


const ModalStdLecRegister = (props) => {
    const [lecRegList, setLecRegList] = useState([]);
    const [lecRegTotalCnt, setLecRegTotalCnt] = useState(0);
    const [selLecId, setSelLecId] = useState(0);


    useEffect(() => {

        if (props.stdId !== null && props.stdId !== "") {
            console.log("ModalLecRegister> props.stdId=" + props.stdId);

            // searchStdInfoDetail(props.stdId);
            searchLecRegList(props.stdId);
            return () => {
                setLecRegList([]);
                setSelLecId('');
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

    // 수강신청 가능한 강의목록 조회
    const searchLecRegList = (stdId) => {

        // var param = {
		// 	loginID : loginID,
		// }
        // callAjax("/adm/plist_lecreg_json.do", "post", "text", true, param, resultCallback);
        
        let params = new URLSearchParams();

        params.append('loginID', stdId);

        axios.post("/adm/plist_lecreg_json.do", params)
            .then((res) => {
                // {"data":{"list_lec":[{"lec_id":9,"lecrm_id":0,
                //                       "max_pnum":0,"pre_pnum":0,
                //                       "start_date":"2024.04.05","end_date":"2024.05.30",
                //                       "process_day":0,"lec_type_id":0,"lec_type_name":null,
                //                       "test_id":0,"test_start":null,"test_end":null,
                //                       "tutor_id":null,"lec_name":"ㅇㅇㅇㅇ","lec_goal":null,
                //                       "lec_sort":null,"loginID":null,"user_type":null,"use_yn":null,
                //                       "name":null,"password":null,"tel":null,"sex":null,"mail":null,"addr":null,
                //                       "join_date":null,"regi_num":null,"std_num":null},
                //          "totalCnt_lec":18,
                console.log("searchLecRegList() result console : " + JSON.stringify(res));

                setLecRegTotalCnt(res.data.totalCnt_lec);
                setLecRegList(res.data.list_lec);
            })
            .catch((err) => {
                console.log("searchLecRegList() result error : " + err.message);
                alert(err.message);
            });
    }

    // 수강신청
    const registerStdLec = (stdId, lecId) => {

        if ( window.confirm("수강등록을 하겠습니까?") ) {
            // var param = {
			// 	std_id : std_id,
			// 	lec_id : lec_id
		    // }	
            // callAjax("/adm/std_lec_reg.do", "post", "json", true, param, resultCallback);

            let params = new URLSearchParams();

            params.append('std_id', stdId);
            params.append('lec_id', lecId);

            axios.post("/adm/std_lec_reg.do", params)
                .then((res) => {
                    // {"data":{"result":"SUCCESS","resultMsg":"수강 신청 되었습니다."}
                    console.log("() result console : " + JSON.stringify(res));

                    if (res.data.result === "SUCCESS") {
                        alert(res.data.resultMsg);  
                        searchStdLecList(stdId);
                        props.setModalAction(false);
                    }
                })
                .catch((err) => {
                    console.log("() result error : " + err.message);
                    alert(err.message);
                });
        }
    }

     // 학생 수강내역 조회
     const searchStdLecList = (stdId) => {
       
        let params = new URLSearchParams();

        params.append('loginID', stdId);
        params.append('user_type', 'a');

        axios.post("/adm/slist_lec_json.do", params)
            .then((res) => {
                console.log("searchStdLecList() result console : " + JSON.stringify(res));

                props.setTotalCnt(res.data.std_lec_count);
                props.setList(res.data.slist_lec);
            })
            .catch((err) => {
                console.log("searchStdLecList() result error : " + err.message);
                alert(err.message);
            });
    }

    const close = () => {        
        searchStdLecList(props.stdId);        
        props.setModalAction(false);
    }

    return (
        <div>
            {/* 수강등록 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="stdDtlForm">
                    <p className="conTitle">
                        <span>수강 등록</span>
                    </p>
                    {/* {"data":{"list_lec":[{"lec_id":9,"lecrm_id":0,
                                        "max_pnum":0,"pre_pnum":0,
                                        "start_date":"2024.04.05","end_date":"2024.05.30",
                                        "process_day":0,"lec_type_id":0,"lec_type_name":null,
                                        "test_id":0,"test_start":null,"test_end":null,
                                        "tutor_id":null,"lec_name":"ㅇㅇㅇㅇ","lec_goal":null,
                                        "lec_sort":null,"loginID":null,"user_type":null,"use_yn":null,
                                        "name":null,"password":null,"tel":null,"sex":null,"mail":null,"addr":null,
                                        "join_date":null,"regi_num":null,"std_num":null},
                            "totalCnt_lec":18, */}
                    <table className="col" style={{height: "100px", width: "500px"}}>
                        <colgroup>
                            <col width="30%"/>
                            <col width="70%"/>
                        </colgroup>
                        <tr >
                            <th>과정선택</th>
                            <td>
                                <select id="reg_lec" name="lec_id" onChange={(e) => {setSelLecId(e.target.value)}}>
                                    {
                                        lecRegTotalCnt > 0 && lecRegList.map((item) => {
                                            return (
                                                <option
                                                    key={item.lec_id}
                                                    value={item.lec_id}>
                                                    ({item.lec_id}){item.lec_name} ({item.start_date} ~ {item.end_date})
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                    </table>                    
                    <div className="modal-button">
                        <button className="btn btn-primary" id="registerbtn"
                                                            name="registerbtn"
                                                            onClick={(e) => {
                                                                registerStdLec(props.stdId, selLecId)
                                                            }}><span>수강 등록</span>
                        </button>
                        <button className="btn btn-primary mx-2" onClick={close}>확인</button>
                    </div>
                </div>    
            </Modal>{/* End 수강등록 모달 */}
        </div>
    )    
}

export default ModalStdLecRegister