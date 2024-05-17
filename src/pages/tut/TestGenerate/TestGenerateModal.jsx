import axios from "axios";
import { useState } from "react";
import Modal from "react-modal";
import * as commonjs from "../../../components/common/commonfunction.js";

const TestGenerateModal = (props) => {

    console.log(props)
    const [selinfo, setSelinfo] = useState({});

    // useEffect(() => {
    //     // roommod(props.id);
    //     // return () => {
    //     //     setSelinfo({});
    //     // }
    // }, [props.id]);

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

    // const roommod = (id) => {
    //     let params = new URLSearchParams();
    //     params.append("test_id", id);
    //     axios
    //         .post("/tut/tutTestDetailJson.do", params)
    //         .then((res) => {
    //             setSelinfo(res.data.selinfo);
    //         })
    //         .catch((err) => {
    //             alert(err.message);
    //         });
    // };

    const postHandler = (action) => {
        if (action !== "D") {
            let checkresult = commonjs.nullcheck([
                { inval: selinfo.equ_name, msg: "강의명을 입력해 주세요." },
                { inval: selinfo.equ_num, msg: "강의 분류를 입력해 주세요." },
            ]);
            if (!checkresult) return;
        }
        let params = new URLSearchParams(selinfo);
        params.append("test_id", props.id);
        params.append("action", action);
        axios
            .post("/adm/equSave.do", params)
            .then((res) => {

                if (res.data.result === "S") {
                    alert(res.data.resultmsg);
                    props.setModalAction(false);

                    if (action === "I") {
                        props.setCurrentPage(1);
                        props.setModalAction(false);
                    } else {
                        props.setModalAction(false);
                    }
                } else {
                    alert(res.data.resultmsg);
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const close = () => {
        props.setModalAction(false);
    }

    return (
        <div>
            <Modal
                style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="noticeform">
                    <p className="conTitle">
                        <span>{props.id === "" ? "시험문제 등록" : "시험문제 확인"}</span>
                    </p>
                    <table style={{ width: "550px", height: "350px" }}>
                        <tbody>
                            <tr>
                                <th>
                                    {" "}
                                    강의명 
                                    <span className="font_red">*</span>
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        style={{ width: "150px" }}
                                        defaultValue={selinfo?.equ_name}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, equ_name: e.target.value }
                                            });
                                            console.log(selinfo)
                                        }}
                                    />
                                </td>
                                <th>
                                    {" "}
                                    강의분류
                                    <span className="font_red">*</span>
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ width: "150px" }}
                                    />
                                </td> 
                            </tr>
                            <tr>
                                <th> 시험명 </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ width: "150px" }}
                                    />
                                </td>
                                <th> 문항수 </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ width: "150px" }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th> 시험 시작일 </th>
                                <td>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="start_datepicker" 
                                        name="testStartDate" 
                                        data-date-format='yyyy.mm.dd'
                                        style={{ width: "150px" }}
                                    />
                                </td>
                                <th> 시험 종료일 </th>
                                <td>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="end_datepicker" 
                                        name="testEndDate" 
                                        data-date-format='yyyy.mm.dd'
                                        style={{ width: "150px" }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="modal-button">
                        {
                            props.id === "" ?
                                <button className="btn btn-primary mx-2" onClick={() => postHandler("I")}>
                                    {" "}
                                    시험지 생성
                                    {" "}
                                </button> : null
                        }
                        {
                            props.id !== "" ?
                                <button className="btn btn-primary mx-2" onClick={() => postHandler("U")}>
                                    {" "}
                                    수정
                                    {" "}
                                </button> : null
                        }
                        {
                            props.id !== "" ?
                                <button className="btn btn-primary mx-2" onClick={() => postHandler("D")}>
                                    {" "}
                                    삭제
                                    {" "}
                                </button> : null
                        }

                        <button className="btn btn-primary" onClick={close}>
                            {" "}
                            닫기
                            {" "}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default TestGenerateModal;