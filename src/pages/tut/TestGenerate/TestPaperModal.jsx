import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import styles from '../../../assets/css/admin/common.css'

const TestPaperModal = (props) => {
    
    const [testDetailList, setTestDetailList] = useState([]);
    const [testName, setTestName] = useState('');
    const [lecName, setLecName] = useState('');

    useEffect(() => {        
        roommod(props.id);
        return () => {            
            setTestDetailList({});
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
            overflow: "auto",
            maxHeight: "80vh"
        },
    };

    const roommod = (id, page) => {       

        let params = new URLSearchParams()
        params.append("test_id", id);
        params.append("page", page);

        axios
            .post("/tut/tutTestDetailJson.do", params)
            .then((res) => {
                setTestDetailList(res.data.listData);
                setTestName(res.data.test_name);
                setLecName(res.data.lec_name);
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
                <div id="testform">
                    <p className="conTitle" style={{ textAlign : "center" }}>
                        <span>{props.id === "" ? "시험문제 등록" : "시험문제 확인"}</span>
                    </p>
                    <table>
                        <thead>
                            <tr style={{padding : "0 15px", height: "37px", fontWeight: "bold", border: "1px solid #e5e5e5", backgroundColor: "#f4f4f4"}}>
                                <th style={{width:"10%", backgroundColor : "#475470", color : "#fff", textAlign : "center"}}>강의명</th>
                                <td style={{width:"60%", textAlign : "center", height: "27px", padding:"5px 10px", border: "1px solid #e5e5e5", color:"#868686" }}>{lecName}</td>
                                <th style={{width:"10%", backgroundColor : "#475470", color : "#fff", textAlign : "center"}}>시험명</th>
                                <td style={{width:"20%", textAlign : "center", height: "27px", padding:"5px 10px", border: "1px solid #e5e5e5", color:"#868686" }}>{testName}</td>
                            </tr>                            
	                        <tr style={{padding : "0 15px", height: "37px", fontWeight: "bold", border: "1px solid #e5e5e5", backgroundColor: "#f4f4f4"}}>
	                        	<th colspan="4" style={{width:"10%", backgroundColor : "#475470", color : "#fff", textAlign : "center"}}>시험문제</th>
	                        </tr>
                        </thead>                        
                        <tbody>                 
                        {testDetailList.map((list, index) => {
                            return (
                                <>
                                    <tr key={list.que_id} style={{textAlign : "center", height: "27px", padding:"5px 10px", border: "1px solid #e5e5e5", color:"#868686", backgroundColor: "#f4f4f4", height: "37px"}}>
                                        <td colspan="4">
                                            <span>
                                                {list.test_num}번. {list.test_que}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4" style={{height: "27px", padding:"5px 10px", border: "1px solid #e5e5e5", color:"#868686"}}>
                                            1. {list.que_ex1}<br/>
                                            2. {list.que_ex2}<br/>
                                            3. {list.que_ex3}<br/>
                                            4. {list.que_ex4}<br/>
                                            <span className="font_red">정답: {list.que_ans}번</span>
                                        </td>
                                    </tr> 
                                </>
                            )
                            
                        })}
                        </tbody>    
                        
                    </table>
                    
                    <button className="btn btn-primary" onClick={close} style={{justifyContent : "right"}}>
                        {" "}
                        닫기
                        {" "}
                    </button>
                </div>
                                           
            </Modal>
        </div>
    )
}

export default TestPaperModal;