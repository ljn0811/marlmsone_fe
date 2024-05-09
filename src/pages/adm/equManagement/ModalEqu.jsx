import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import * as commonjs from "../../../components/common/commonfunction.js";

const ModalEqu = (props) => {
    const [selinfo, setSelinfo] = useState({});
    const [roomList, setRoomList] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");

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

    useEffect(() => {
        axios
            .post("/adm/equManagementJson.do")
            .then((res) => {
                setRoomList(res.data.roomlist);
                setSelectedOption(props?.lecrmId);
            })
            .catch((err) => {
                alert(err.message);
            });
        equMod(props.id);
    }, []);

    const equMod = (id) => {
        let params = new URLSearchParams();

        params.append("equ_id", id);

        axios
            .post("/adm/equDtl.do", params)
            .then((res) => {
                setSelinfo(res.data.selinfo);
                setSelectedOption(res.data.selinfo?.lecrm_id);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const postHandler = (action) => {
        if (action !== "D") {
            let checkresult = commonjs.nullcheck([
                { inval: selectedOption, msg: "강의실을 선택해 주세요." },
                { inval: selinfo.equ_name, msg: "장비 명을 입력해 주세요." },
                { inval: selinfo.equ_num, msg: "장비 수를 입력해 주세요." },
            ]);
            if (!checkresult) return;
        }
        let params = new URLSearchParams(selinfo);
        if (selinfo.lecrm_id === "") {
            params.append("lecrm_id", selectedOption);
        }
        params.append("action", action);
        axios
            .post("/adm/equSave.do", params)
            .then((res) => {
                if (res.data.result === "S") {
                    alert(res.data.resultmsg);
                    props.setModalAction(false);

                    if (action === "I") {
                        props.setEqucurrentPage(1);
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
    };

    return (
        <div>
            <Modal
                style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById("app")}
            >
                <div id="modalForm">
                    <p className="conTitle">
                        <span>
                            {props.id === "" ? "장비 등록" : "장비 수정"}
                        </span>
                    </p>
                    <table style={{ width: "550px", height: "100px" }}>
                        <tbody>
                            <tr>
                                <th>
                                    강의실 <span className="font_red">*</span>
                                </th>
                                <td colSpan="3">
                                    <select
                                        id={roomList}
                                        value={selectedOption}
                                        onChange={(e) => {
                                            setSelectedOption(e.target.value);
                                            setSelinfo((prev) => {
                                                return {
                                                    ...prev,
                                                    lecrm_id: e.target.value,
                                                };
                                            });
                                        }}
                                    >
                                        <option key={""} value={""}>
                                            ======================선택======================
                                        </option>
                                        {roomList.map((item) => {
                                            return (
                                                <option
                                                    key={item.lecrm_id}
                                                    value={item.lecrm_id}
                                                >
                                                    {item.lecrm_name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    장비 명 <span className="font_red">*</span>
                                </th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control input-sm"
                                        defaultValue={selinfo?.equ_name}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return {
                                                    ...prev,
                                                    equ_name: e.target.value,
                                                };
                                            });
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
                                        defaultValue={selinfo?.equ_num}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return {
                                                    ...prev,
                                                    equ_num: e.target.value,
                                                };
                                            });
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
                                        defaultValue={selinfo?.equ_note}
                                        onBlur={(e) => {
                                            setSelinfo((prev) => {
                                                return {
                                                    ...prev,
                                                    equ_note: e.target.value,
                                                };
                                            });
                                        }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div
                        className="modal-button"
                        style={{ textAlign: "center" }}
                    >
                        {props.id === "" ? (
                            <button
                                className="btn btn-primary mx-2"
                                onClick={() => postHandler("I")}
                            >
                                등록
                            </button>
                        ) : null}
                        {props.id !== "" ? (
                            <button
                                className="btn btn-primary mx-2"
                                onClick={() => postHandler("U")}
                            >
                                수정
                            </button>
                        ) : null}
                        {props.id !== "" ? (
                            <button
                                className="btn btn-primary mx-2"
                                onClick={() => postHandler("D")}
                            >
                                삭제
                            </button>
                        ) : null}

                        <button className="btn btn-primary" onClick={close}>
                            닫기
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ModalEqu;
