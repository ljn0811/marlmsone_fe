import { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import * as commonjs from "../../components/common/commonfunction.js";


const AdviceModal=(props)=>{
    console.log('등록/수정 컴포넌트 실행 > ',props);
    //게시물 정보 관리 
    const [selinfo,setSelinfo]=useState({});
    //상담 등록 시 사용된 학생 id
    const [stdList,setStdList] =useState([]);
    const [std_id,setStd_id] = useState('');
    //상담 등록 시 사용된 강의 id
    const [lec_id,setLec_id] = useState('');
    const [lecList,setLecList] = useState([]); // 강의 정보

                

    useEffect(()=>{
        allLec();
        //console.log('props', props)
        if(props.adv_id) {
            advmod(props.adv_id);
        }
        return ()=>{
            setSelinfo({});
        }
    }, [props.openModal])
  
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

    /** 강의목록 */    
    const allLec=()=>{
        axios.get("/adv/lecListR.do")
            .then((res)=>{
                    setLecList(res.data.listData)
                })
        }
    
    /** 강의 선택 onchage */
    const selectLec=(e)=>{
        setLec_id(e.target.value);
        setSelinfo((prev)=>{
            return {...prev,lec_id:e.target.value }
        });
        allStd(e.target.value);

    }

    /** 학생목록 */    
    const allStd=(lec_id)=>{
        let params = new URLSearchParams();
        params.append("lec_id",lec_id)
        axios.get("/adv/stdListJson.do",{params})
            .then((res)=>{
                    setStdList(res.data.listData);
                })
        }
    
    /** 학생 선택 onchage */
    const selectStd=(e)=>{
        setStd_id(e.target.value);
        setSelinfo((prev)=>{
                return {...prev,std_id:e.target.value }
            })
 

    }


    /** 등록, 수정 */
    const postHandler = (action) => {
        //유효성 
        if(action!=="D"){
        let nullcheck = commonjs.nullcheck([
            {inval: selinfo.lec_id, msg:"강의명을 선택 해 주세요"},
            {inval: selinfo.std_id, msg:"학생명 선택 해주세요"}
        ]);
        if(!nullcheck) {return;}

    }

        let params = new URLSearchParams(selinfo);
         params.append("action", action);
         axios
                .post("/adv/advSave.do", params)
                .then((res) => {
                    if (res.data.result === "S") {
                        alert(res.data.resultMsg);
                        props.setAdvModal(false);

                        if (action === "I") {
                            props.setAdvModal(false);
                            props.setCurrentPage(1);
                        } else {
                            props.setAdvModal(false);
                        }
                } else {
                    alert(res.data.resultMsg);
                    props.setAdvModal(false);
                }
            })
            .catch((err) => {
                alert(err.message);
            });

    };
    
    const advmod = (adv_id) => {
        let params = new URLSearchParams(selinfo);
        params.append("adv_id",adv_id);
        axios
        .post("/adv/advDetailR.do",params)
        .then((res)=>{
            setSelinfo(res.data.data);
            allStd(res.data.data.lec_id)
        })
    }
    

    const advDelete =(adv_id)=>{
        let params = new URLSearchParams(selinfo);
        params.append("adv_id",adv_id);
        axios
        .post("/adv/advDelete.do",params)
        .then((res)=>{
            setSelinfo(res.data.data);
            alert(res.data.resultMsg);
            props.setAdvModal(false);
        })
       
        
    }

    const close=(e)=>{
        props.setAdvModal(false);
    }

    return(
        <Modal
              style={modalStyle}
              isOpen={props.openModal}
              appElement={document.getElementById('app')}
          >
            <div>
                <div>
                    강의명
                    <select onChange={selectLec} 
                            value={selinfo?.lec_id}>
                        <option value="">전체</option>
                        {
                          lecList.map((i)=>{
                              return ( 
                                 <option key={i.lec_id} value={i.lec_id}>{i.lec_name}</option>
                                )
                          }) 
                        }  
                    </select>
                </div>    
                <div>
                    학생명
                    <select onChange={selectStd} value={selinfo?.std_id}>
                        <option value="">전체</option>
                     
                    {
                          stdList.map((i)=>{
                              return ( 
                                 <option key={i.std_id} value={i.std_id}>{i.std_name}</option>
                                )
                          }) 
                     
                     
                        }  
                    </select>
                    
                </div>
                <div>
                    상담일자
                    <input 
                        type="date" 
                        name="adv_date"
                        defaultValue={selinfo?.adv_date}
                        onBlur={(e)=>{
                            setSelinfo((prev)=>{
                                return {...prev,adv_date:e.target.value }
                            })
                        }}
                    >    
                    </input>
                </div>
                <div>
                    상담장소
                    <input  type="text" 
                            name="adv_place"
                            defaultValue={selinfo?.adv_place} 
                            onBlur={(e)=>{
                                setSelinfo((prev)=>{
                                    return {...prev,adv_place:e.target.value }
                                })
                            }}
                    >
                    </input>
                </div>
                <div>
                    상담내용
                    <textarea 
                        name="adv_content"
                        defaultValue={selinfo?.adv_content} 
                        onBlur={(e)=>{
                            setSelinfo((prev)=>{
                                return {...prev,adv_content:e.target.value }
                            })
                        }}
                    >

                    </textarea>
                </div>
                <div className="modal-button">
                        {
                            props.adv_id === "" ?
                                <button className="btn btn-primary mx-2" onClick={() => postHandler("I")}>
                                    등록
                                </button> : null
                        }
                        {
                            props.adv_id !== "" ?
                                <button className="btn btn-primary mx-2" onClick={() => postHandler("U")}>
                                    수정
                                </button> : null
                        }
                        {
                            props.adv_id !== "" ?
                                <button className="btn btn-primary mx-2" onClick={()=>{advDelete(props.adv_id)}}>
                                    삭제
                                </button> : null
                        }

                        <button className="btn btn-primary" onClick={close}>
                            닫기
                        </button>
                    </div>


            </div>

          </Modal>
    )
}
export default AdviceModal;