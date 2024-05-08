import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import * as commonjs from "../../../components/common/commonfunction.js";

const ModalLecture = (props) => {
    const [selinfo, setSelinfo] = useState({});

    useEffect(() => {
        roommod(props.id);
        return () => {
            setSelinfo({});
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

    const roommod = (id) => {
        let params = new URLSearchParams();

        params.append("lecrm_id", id);

        axios
            .post("/adm/lectureRoomDtl.do", params)
            .then((res) => {
                setSelinfo(res.data.selinfo);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const postHandler = (action) => {

        if (action !== "D") {
            let checkresult = commonjs.nullcheck([
                { inval: selinfo.lecrm_name, msg: "강의실 명을 입력해 주세요." },
                { inval: selinfo.lecrm_size, msg: "강의실 크기을 입력해 주세요." },
                { inval: selinfo.lecrm_snum, msg: "강의실 자리수을 입력해 주세요." },
            ]);
            if (!checkresult) return;
        }
        let params = new URLSearchParams(selinfo);
        params.append("lecrm_id", props.id);
        params.append("action", action);
        axios
            .post("/adm/lectureRoomSave.do", params)
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
                        <span>{props.id === "" ? "강의실 등록" : "강의실 수정"}</span>
                    </p>
                    <table style={{ width: "550px", height: "350px" }}>
                        <tbody>
                            <tr>
                                <th>
                                    {" "}
                                    강의실명 <span className="font_red">*</span>
                                </th>
                                <td colSpan="3">
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        style={{ width: "150px" }}
                                        defaultValue={selinfo?.lecrm_name}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, lecrm_name: e.target.value }
                                            });
                                            console.log(selinfo)
                                        }}
                                    // onChange={(e) => {
                                    //     setSelinfo((prev) => {
                                    //         return { ...prev, lecrm_name: e.target.value }
                                    //     });
                                    //     console.log(selinfo)
                                    // }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    강의실 크기<span className="font_red">*</span>
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        style={{ width: "150px" }}
                                        defaultValue={selinfo?.lecrm_size}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, lecrm_size: e.target.value }
                                            })
                                        }}
                                    />
                                </td>
                                <th>
                                    강의실 자릿수<span className="font_red">*</span>
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        style={{ width: "150px" }}
                                        defaultValue={selinfo?.lecrm_snum}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, lecrm_snum: e.target.value }
                                            })
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th> 비고 </th>
                                <td colSpan="3">
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        style={{ width: "350px" }}
                                        defaultValue={selinfo?.lecrm_note}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, lecrm_note: e.target.value }
                                            })
                                        }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="modal-button">
                        {
                            props.id === "" ?
                                <button className="btn btn-primary mx-2" onClick={() => postHandler("I")}>
                                    등록
                                </button> : null
                        }
                        {
                            props.id !== "" ?
                                <button className="btn btn-primary mx-2" onClick={() => postHandler("U")}>
                                    수정
                                </button> : null
                        }
                        {
                            props.id !== "" ?
                                <button className="btn btn-primary mx-2" onClick={() => postHandler("D")}>
                                    삭제
                                </button> : null
                        }

                        <button className="btn btn-primary" onClick={close}>
                            닫기
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModalLecture;