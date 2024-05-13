import React, {useState, useEffect, useRef} from "react";
import Modal from "react-modal";
import axios from "axios";
import * as commonjs from "../../components/common/commonfunction.js"
import ModalPostcode from "./ModalPostcode.jsx";


const ModalRegister = (props) => {
    const [selinfo, setSelinfo] = useState({});
    const [checkLoginIdOn, setCheckLoginIdOn] = useState(false);
    const [postcodeModalOn, setPostcodeModalOn] = useState(false);

    const inputLoginID = useRef();
    const inputPassword = useRef();
    const inputRePassword = useRef();
    const inputName = useRef();
    const inputGenderType = useRef();
    const inputBirthday1 = useRef();
    const inputBirthday2 = useRef();
    const inputTel = useRef();
    const inputEmail = useRef();
    const inputZipcode = useRef();
    const inputAddress = useRef();
    const inputDetailAddress = useRef();
    


    useEffect(() => {
        setSelinfo({});
        return () => {
            setSelinfo({});
        }
    }, []);

    const close = () => {
        setSelinfo({});
        setCheckLoginIdOn(false);
        setPostcodeModalOn(false);
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
        
        let params = new URLSearchParams();
        params.append('loginID', selinfo?.loginID);

        axios.post("/check_loginID.do", params)
            .then((res) => {

                console.log("checkLoginId() result console : " + JSON.stringify(res));

                if (res.data === 1) {           // 중복된 아이디 존재함
                    alert("중복된 아이디가 존재합니다.");                    
                    inputLoginID.current.focus();
                } else if (res.data === 0) {    // 중복된 아이디 없음 (사용가능한 아이디임)
                    alert("사용할 수 있는 아이디입니다.");
                    setCheckLoginIdOn(true);
                    inputPassword.current.focus();
                }                
            })
            .catch((err) => {
                console.log("checkLoginId() result error : " + err.message);
                alert(err.message);
            });
    }

    // 이메일 중복체크
    const checkEmailDuplication = () => {
    
        let params = new URLSearchParams();
        params.append('user_email', selinfo?.user_email);

        axios.post("/check_email.do", params)
            .then((res) => {
                console.log("checkEmailDuplication() result console : " + JSON.stringify(res));
                if (res.data === 1) { // 중복된 이메일 존재함
                    return true;
                }
            })
            .catch((err) => {
                console.log("checkEmailDuplication() result error : " + err.message);
                alert(err.message);
            });

        return false;
    }

    // 회원가입
    const registerUser = () => {

        let params = new URLSearchParams();

        params.append('action', "I");
        params.append('user_type', selinfo?.user_type);
        params.append('loginID', selinfo?.loginID);
        params.append('name', selinfo?.name);
        params.append('password', selinfo?.password);
        params.append('tel', selinfo?.tel);
        params.append('gender_cd', selinfo?.gender_cd);
        params.append('user_email', selinfo?.user_email);
        params.append('user_zipcode', selinfo?.user_zipcode);
        params.append('user_address', selinfo?.user_address);
        params.append('user_dt_address', selinfo?.user_dt_address);
        params.append('birthday1', selinfo?.birthday1);
        params.append('birthday2', selinfo?.birthday2);

        console.log("register() params : " + params);

        axios.post("/register.do", params)
            .then((res) => {
                console.log("register() result console : " + JSON.stringify(res));

                if (res.data.result === "SUCCESS") {
                    alert(res.data.resultMsg);
                    close();
                } else {
                    alert(res.data.resultMsg);
                }
            })
            .catch((err) => {
                console.log("register() result error : " + err.message);
                alert(err.message);
            });
    }

    const searchZipcode = () => {
        setPostcodeModalOn(true);
    }

    const checkInputUserType = () => {

        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.user_type, msg: "회원유형을 선택하세요." },
        ]);

        return nullcheckResult;
    }

    const checkInputLoginID = () => {

        let idRules = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
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

        let passwordRules = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=])[a-zA-Z0-9!@#$%^&*+=]{8,15}$/;
        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.password, msg: "비밀번호를 입력하세요." },
        ]);

        if ( !nullcheckResult ) {
            return false;
        }
        if ( !passwordRules.test(selinfo?.password) ) {
            alert("비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.");
            return false;
        }

        return true;
    }

    const checkInputRePassword = () => {

        let passwordRules = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=])[a-zA-Z0-9!@#$%^&+=]{8,15}$/;
        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.password1, msg: "비밀번호 확인을 입력하세요." },
        ]);

        if ( !nullcheckResult ) {
            return false;
        }
        if ( !passwordRules.test(selinfo?.password1) ) {
            console.log(selinfo?.password1);
            alert("비밀번호는 숫자,영문자,특수문자 조합으로 8~15자리를 사용해야 합니다.");
            return false;
        }
        if ( selinfo?.password !== selinfo?.password1 ) {
            alert("비밀번호가 일치하지 않습니다.");
            return false;
        }

        return true;
    }

    const checkInputName = () => {

        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.name, msg: "이름을 입력하세요." },
        ]);

        return nullcheckResult;
    }

    const checkInputGenderType = () => {

        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.gender_cd, msg: "성별을 선택해 주세요." },
        ]);

        return nullcheckResult;
    }

    const checkInputRRN = () => {

        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.birthday1, msg: "주민등록번호를 입력하세요." },
            { inval: selinfo?.birthday2, msg: "주민등록번호를 입력하세요." },
        ]);
        if ( !nullcheckResult ) {
            return false;
        }
        if (selinfo?.birthday1.length !== 6 || selinfo?.birthday2.length !== 7) {
            alert("올바른 주민등록번호 형식이 아닙니다.");
            return false;
        }

        let rrn = selinfo?.birthday1 + selinfo?.birthday2;
        let sum = 0;
        let weight = [2,3,4,5,6,7,8,9,2,3,4,5];
        let checkDigit = parseInt(rrn.charAt(12));

        for (let i = 0; i < 12; i++) {
            sum += parseInt(rrn.charAt(i)) * weight[i];
        }
        sum = 11 - (sum % 11);
        if (sum > 9) { sum = sum % 10; }

        // 테스트를 위해 주석 처리함
        // if (sum !== checkDigit) {
        //     alert("유효하지 않은 주민등록번호입니다.");
        //     return false;
        // }

        return true;
    }

    const checkInputTel = () => {

        let numberRules = /^[0-9]+$/;
        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.tel, msg: "전화번호를 입력하세요." },
        ]);

        if ( !nullcheckResult ) {
            return false;
        }
        if ( !numberRules.test(selinfo?.tel) ) {
            alert("전화번호는 숫자로만 입력해 주세요.");
            return false;
        }
        if (selinfo?.tel.length !== 11) {
            alert("핸드폰 번호는 11자리여야 합니다.");
            return false;
        }
        if (selinfo?.tel.substring(0, 3) !== '010') {
            alert("올바른 핸드폰 번호 형식이 아닙니다.");
            return false;
        }

        return true;
    }

    const checkInputEmail = () => {

        let emailRules = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.user_email, msg: "이메일을 입력하세요." },
        ]);

        if ( !nullcheckResult ) {
            return false;
        }
        if ( !emailRules.test(selinfo?.user_email) ) {
            alert("올바른 이메일 형식이 아닙니다.");
            return false;
        }
        if ( checkEmailDuplication() ) {
            alert("중복된 이메일이 존재합니다.");
            return false;
        }
        
        return true;
    }

    const checkInputZipcode = () => {

        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.user_zipcode, msg: "우편번호를 입력하세요." },
        ]);

        return nullcheckResult;
    }

    const checkInputAddress = () => {

        let nullcheckResult = commonjs.nullcheck([
            { inval: selinfo?.tel, msg: "주소를 입력하세요." },
        ]);
        
        return nullcheckResult;
    }

    const checkRegisterValidation = () => {

        console.log("checkRegisterValidation() selinfo : " + JSON.stringify(selinfo));

        // 필수 입력값 확인
        if ( !checkInputUserType() )    { return; }
        if ( !checkInputLoginID() )     { inputLoginID.current.focus(); return; }
        if ( !checkInputPassword() )    { inputPassword.current.focus(); return; }
        if ( !checkInputRePassword() )  { inputRePassword.current.focus(); return; }
        if ( !checkInputName() )        { inputName.current.focus(); return; }
        if ( !checkInputGenderType() )  { inputGenderType.current.focus(); return; }
        if ( !checkInputRRN() )         { inputBirthday1.current.focus(); return; }
        if ( !checkInputTel() )         { inputTel.current.focus(); return; }
        if ( !checkInputEmail() )       { inputEmail.current.focus(); return; }
        if ( !checkInputZipcode() )     { inputZipcode.current.focus(); return; }
        if ( !checkInputAddress() )     { inputAddress.current.focus(); return; }

        if (!checkLoginIdOn) {
            alert("아이디 중복 여부를 확인해 주세요.");
            return;
        }

        registerUser();
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
                            <th style={{width: "100px"}}>회원유형<span className="font_red">*</span></th>
                            <td>
                            <label style={{ marginRight: "20px" }}>
                                <input
                                    type="radio"
                                    style={{width: "20px"}}
                                    onChange={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, user_type: "A" }
                                        });
                                    }}
                                    checked={selinfo?.user_type === 'A'}/>일반회원</label>
                            <label>
                                <input
                                    type="radio"
                                    style={{width: "20px"}}
                                    onChange={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, user_type: "B" }
                                        });
                                    }}
                                    checked={selinfo?.user_type === 'B'}/>강사회원</label>
                            </td>
                        </tr>
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
                                    placeholder="숫자, 영문자, 특수문자 조합으로 8~15자리"
                                    defaultValue={selinfo?.password}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, password: e.target.value }
                                        });
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
                                    }}
                                    ref={inputRePassword}
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
                                    defaultValue={selinfo?.name}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, name: e.target.value }
                                        });
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
                                    minLength="6"
                                    maxLength="6"
                                    defaultValue={selinfo?.birthday1}
                                    onChange={(e) => {
                                        if (e.target.value.length === 6) {
                                            inputBirthday2.current.focus();
                                        }
                                    }}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, birthday1: e.target.value }
                                        });
                                    }}
                                    ref={inputBirthday1}
                                />{" "}-{" "}
                                <input
                                    type="text"
                                    className="form-control input-sm"
                                    style={{width: "198px"}}
                                    maxLength="7"
                                    defaultValue={selinfo?.birthday2}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, birthday2: e.target.value }
                                        });
                                    }}
                                    ref={inputBirthday2}
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
                                    maxLength="11"
                                    defaultValue={selinfo?.tel}
                                    onBlur={(e) => {
                                        setSelinfo((prev) => {
                                            return { ...prev, tel: e.target.value }
                                        });
                                    }}
                                    ref={inputTel}
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
                                    }}
                                    ref={inputEmail}
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
                                    }}
                                    ref={inputZipcode}
                                />
                                <button className="btn btn-primary mx-2" 
                                        style={{width: "120px"}}
                                        onClick={searchZipcode} >우편번호 찾기</button>
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
                                    }}
                                    ref={inputAddress}
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
                                    }}
                                    ref={inputDetailAddress}
                                />
                            </td>
                        </tr>
                    </table>
                    <div className="modal-button">
                        <button className="btn btn-primary mx-2" onClick={checkRegisterValidation}>회원가입</button>
                        <button className="btn btn-primary mx-2" onClick={close}>취소</button>
                    </div>  
                </div>    
            </Modal>{/* End 회원가입 모달 */}s
            {postcodeModalOn? <ModalPostcode modalAction={postcodeModalOn} 
                                             setModalAction={setPostcodeModalOn}
                                             selinfo={selinfo}
                                             setSelinfo={setSelinfo}
                                             inputDetailAddress={inputDetailAddress}
                                             ></ModalPostcode> : null}
        </div>
    )    
}

export default ModalRegister