import { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import * as commonjs from "../../../components/common/commonfunction.js";

const ModalEquipment = (props) => {
    const [selinfo, setSelinfo] = useState({});

    useEffect(() => {
        console.log("ModalEquipment> pros.lecrmId=" + props.lecrmId + ", pros.equipId=" + props.equipId  + typeof props.equipId);

        if (props.equipId !== null && props.equipId !== "") {
            console.log("ModalEquipment> pros.lecrmId=" + props.lecrmId + ", pros.equipId=" + props.equipId);

            equipDetail(props.equipId);
            return () => {
                setSelinfo({});
            }
        }
    }, [props.equipId]);

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

    // 장비 정보 상세보기
    const equipDetail = (id) => {

        let params = new URLSearchParams();
        params.append("equ_id", id);

        axios
            .post("/adm/equDtl.do", params)
            .then((res) => {
                setSelinfo(res.data.selinfo);
                console.log("equipDetail> res.data.selinfo : " + JSON.stringify(res.data.selinfo));
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    // 장비 등록/수정/삭제
    const postHandler = (action) => {

        if (action !== "D") {
            let checkresult = commonjs.nullcheck([
                { inval: selinfo.equ_name, msg: "장비 명을 입력해 주세요." },
                { inval: selinfo.equ_num, msg: "장비 수를 입력해 주세요." },
            ]);
            if (!checkresult) return;
        }
        let params = new URLSearchParams(selinfo);
        params.append("lecrm_id", props.lecrmId);
        params.append("equ_id", props.equipId);
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
                <div id="modalform">
                    <p className="conTitle">
                        <span>{props.equipId === "" ? "장비 등록" : "장비 수정"}</span>
                    </p>
                    <table style={{ width: "550px", height: "150px" }}>
                        <tbody>
                            <tr>
                                <th>
                                    장비 명 <span className="font_red">*</span>
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
                                    장비 수 <span className="font_red">*</span>
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        style={{ width: "150px" }}
                                        defaultValue={selinfo?.equ_num}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, equ_num: e.target.value }
                                            });
                                            console.log(selinfo)
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
                                        defaultValue={selinfo?.equ_note}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return { ...prev, equ_note: e.target.value }
                                            })
                                        }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="modal-button">
                        {
                            props.equipId === "" ?
                                <button className="btn btn-primary mx-2" onClick={() => postHandler("I")}>
                                    등록
                                </button> : null
                        }
                        {
                            props.equipId !== "" ?
                                <button className="btn btn-primary mx-2" onClick={() => postHandler("U")}>
                                    수정
                                </button> : null
                        }
                        {
                            props.equipId !== "" ?
                                <button className="btn btn-primary mx-2" onClick={() => postHandler("D")}>
                                    삭제
                                </button> : null
                        }
                        <button className="btn btn-primary" onClick={close}>닫기</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModalEquipment;