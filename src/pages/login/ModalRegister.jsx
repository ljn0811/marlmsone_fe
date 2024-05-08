import React, {useState, useEffect, useRef} from "react";
import Modal from "react-modal";
import axios from "axios";
import * as commonjs from "../../components/common/commonfunction.js"
import userEvent from "@testing-library/user-event";


const ModalRegister = (props) => {
    const [selinfo, setSelinfo] = useState({});
    const [checkLoginIdOn, setCheckLoginIdOn] = useState(false);

    const inputLoginID = useRef();
    const inputPassword = useRef();
    const inputPasswordConfirm = useRef();
    const inputName = useRef();
    const inputGenderType = useRef();



    useEffect(() => {

        setCheckLoginIdOn(false);
        return () => {
            setSelinfo({});
        }
    }, []);


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

    // 아이디 중복체크
    const checkIdDuplication = () => {
        
        let idRules =  /^[a-z0-9]{6,20}$/g ;
        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.loginID, msg: "이름을 입력해 주세요." },
        ]);

        if (!nullcheckResult) {
            inputLoginID.current.focus();
            return;
        }
        if(!idRules.test(selinfo?.loginID)){
            alert("아이디는 숫자, 영문자 조합으로 6~20자리를 사용해야 합니다.");
            inputLoginID.current.focus();
            return;
        }
        
        // url: '/tut/tutorLectureDetail',
        // var data = {"loginID" : $("#registerId").val()};
        // url : '/check_loginID.do',
        let params = new URLSearchParams();
        params.append('loginID', selinfo?.loginID);

        axios.post("/check_loginID.do", params)
            .then((res) => {
                // {"data":1,"status":200,"statusText":"OK",
                // {"data":0,"status":200,"statusText":"OK",
                console.log("checkLoginId() result console : " + JSON.stringify(res));

                if (res.data === 1) {           // 중복된 아이디 존재함
                    alert("중복된 아이디가 존재합니다.");
                    inputLoginID.current.focus();
                    return;
                } else if (res.data === 0) {    // 중복된 아이디 없음 (사용가능한 아이디임)
                    alert("사용할 수 있는 아이디입니다.");
                    setCheckLoginIdOn(true);
                }                
            })
            .catch((err) => {
                console.log("checkLoginId() result error : " + err.message);
                alert(err.message);
            });
    }

    const checkInputLoginID = () => {

        let idRules =  /^[a-z0-9]{6,20}$/g ;
        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.loginID, msg: "아이디를 입력하세요." },
        ]);

        if ( !nullcheckResult ) {
            return false;
        }
        if ( !idRules.test(selinfo?.loginID) ) {
            alert("아이디는 숫자, 영문자 조합으로 6~20자리를 사용해야 합니다.");
            return false;
        }
        return true;
    }

    const checkInputPassword = () => {

        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.password, msg: "비밀번호를 입력하세요." },
        ]);
        return nullcheckResult;
    }

    const checkInputPasswordConfirm = () => {

        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.password1, msg: "비밀번호 확인을 입력하세요." },
        ]);
        return nullcheckResult;
    }

    const checkInputName = () => {

        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.regiName, msg: "이름을 입력하세요." },
        ]);
        return nullcheckResult;
    }

    const checkInputGenderType = () => {

        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.gender_cd, msg: "성별을 선택해 주세요." },
        ]);
        return nullcheckResult;
    }

    const checkRegisterValidation = () => {

        if ( !checkInputLoginID() ) {
            inputLoginID.current.focus();
            return;
        }
        if ( !checkInputPassword() ) {
            inputPassword.current.focus();
            return;
        }
        if ( !checkInputPasswordConfirm() ) {
            inputPasswordConfirm.current.focus();
            return;
        }
        if ( !checkInputName() ) {
            inputPasswordConfirm.current.focus();
            return;
        }
        if ( !checkInputGenderType() ) {
            inputGenderType.current.focus();
            return;
        }
        // if ( !checkInputBirthday1() ) {
        //     inputBirthday1.current.focus();
        //     return;
        // }
        // if ( !checkInputBirthday2() ) {
        //     inputBirthday2.current.focus();
        //     return;
        // }
/*
        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.loginID,      msg: "아이디를 입력하세요." },
            { inval: selinfo?.password,     msg: "비밀번호를 입력하세요." },
            { inval: selinfo?.password1,    msg: "비밀번호 확인을 입력하세요." },
            { inval: selinfo?.regiName,     msg: "이름을 입력하세요." },
            { inval: selinfo?.gender_cd,    msg: "성별을 선택해 주세요." },
            { inval: selinfo?.birthday1,    msg: "주민등록번호를 입력하세요." },
            { inval: selinfo?.birthday2,    msg: "주민등록번호를 입력하세요." },
            { inval: selinfo?.tel,          msg: "전화번호를 입력하세요." },
            { inval: selinfo?.user_email,   msg: "이메일을 입력하세요." },
            { inval: selinfo?.user_zipcode, msg: "우편번호를 입력하세요." },
            { inval: selinfo?.user_address, msg: "주소를 입력하세요." },
        ]);

        if (!nullcheckResult) {
            // inputRegisterId.current.focus();
            return;
        }

        if (!checkLoginIdOn) {
            alert("아이디 중복 여부를 확인해 주세요.");
            return;
        }
                */
    }

    return (
        <div>
            {/* 회원가입 모달 */}
            <Modal style={modalStyle}
                isOpen={props.modalAction}
                appElement={document.getElementById('app')}
            >
                <div id="registerForm">
                    <p className="conTitle">
                        <span>회원가입</span>
                    </p>
                    <table style={{ width: "500px", height: "450px" }}>
                        <tr>
                            <th style={{width: "100px"}}>아이디<span className="font_red">*</span></th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    style={{width: "280px"}}
                                    placeholder="숫자, 영문자 조합으로 6~20자리 "
                                    defaultValue={selinfo?.loginID}
                                    onBlur={(e) => {
                                        console.log("###" + e.target.value);
                                        setSelinfo((prev) => {
                                            return { ...prev, loginID: e.target.value }
                                        });                                        
                                    }}
                                    ref={inputLoginID}
                                />
                                <button className="btn btn-primary mx-2" 
                                        style={{width: "120px"}}
                                        onClick={checkIdDuplication} >중복확인</button>
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>비밀번호<span className="font_red">*</span></th>
                            <td>
                                <input
                                    type="password"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    // placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                                    defaultValue={selinfo?.password}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, password: e.target.value }
                                        });
                                        console.log(selinfo)
                                    }}
                                    ref={inputPassword}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>비밀번호 확인<span className="font_red">*</span></th>
                            <td>
                                <input
                                    type="password"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    defaultValue={selinfo?.password1}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, password1: e.target.value }
                                        });
                                        console.log(selinfo)
                                    }}
                                    ref={inputPasswordConfirm}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>이름<span className="font_red">*</span></th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    style={{width: "130px"}}
                                    defaultValue={selinfo?.regiName}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, regiName: e.target.value }
                                        });
                                        console.log(selinfo)
                                    }}
                                    ref={inputName}
                                />
                            </td>
                        </tr>
                        <tr>
                        <th style={{width: "100px"}}>성별<span className="font_red">*</span></th>
                            <td>
                                <select id="genderId" 
                                    className="form-control"
                                    style={{width: "130px"}}
                                    defaultValue={selinfo?.gender_cd}
                                    onChange={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, gender_cd: e.target.value }
                                        });                                    
                                    }}
                                    ref={inputGenderType}
                                    >
                                    <option value="" selected="selected">선택</option>
                                    <option value="M">남자</option>
                                    <option value="F">여자</option>
                                </select> 
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>주민등록번호<span className="font_red">*</span></th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    style={{width: "185px"}}
                                    defaultValue={selinfo?.birthday1}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, birthday1: e.target.value }
                                        });
                                        console.log(selinfo)
                                    }}
                                />{" "}-{" "}
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    style={{width: "198px"}}
                                    defaultValue={selinfo?.birthday2}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, birthday2: e.target.value }
                                        });
                                        console.log(selinfo)
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>전화번호<span className="font_red">*</span></th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    defaultValue={selinfo?.tel}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, tel: e.target.value }
                                        });
                                        console.log(selinfo)
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>이메일<span className="font_red">*</span></th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    defaultValue={selinfo?.user_email}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, user_email: e.target.value }
                                        });
                                        console.log(selinfo)
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>우편번호<span className="font_red">*</span></th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    style={{width: "280px"}}                                    
                                    defaultValue={selinfo?.user_zipcode}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, user_zipcode: e.target.value }
                                        });
                                        console.log(selinfo)
                                    }}
                                />
                                <button className="btn btn-primary mx-2" 
                                        style={{width: "120px"}}
                                        onClick={close} >우편번호 찾기</button>
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>주소<span className="font_red">*</span></th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    defaultValue={selinfo?.user_address}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, user_address: e.target.value }
                                        });
                                        console.log(selinfo)
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "100px"}}>상세주소</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    style={{width: "400px"}}
                                    defaultValue={selinfo?.user_dt_address}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, user_dt_address: e.target.value }
                                        });
                                        console.log(selinfo)
                                    }}
                                />
                            </td>
                        </tr>
                    </table>
                    <div className="modal-button">
                        <button className="btn btn-primary mx-2" onClick={checkRegisterValidation}>회원가입</button>
                        <button className="btn btn-primary mx-2" onClick={close}>취소</button>
                    </div>  
                </div>    
            </Modal>{/* End 회원가입 모달 */}
        </div>
    )    
}

export default ModalRegister