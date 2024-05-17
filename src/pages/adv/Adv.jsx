import axios from 'axios';
import {useState, useEffect, useRef} from 'react'
import { BrowserRouter , Routes , Route , Link, useNavigate } from 'react-router-dom'
import Pagination from "../../components/common/Pagination";

import AdviceModal from "./AdviceModal"


export default function Adv( props ){
        //페이징처리 상태관리
        const [currentPage,setCurrentPage] = useState(1); //현재페이지
        const [totalcnt, setTotalcnt] = useState(0); // 총 상담 갯수
        const [lecList,setLecList] = useState([]); // 강의 정보
        const [lec_id,setLec_id] =useState('');
        const [advList,setAdvList] = useState([]); 
        
        //상담상세보기 상태관리
        const [advId , setAdvId] =useState(); //상담id
        const navigate = useNavigate();
        
        //등록/수정창 상태관리
        const [advModal,setAdvModal] = useState(false);

        useEffect(()=>{
            allLec();
            advs(currentPage);
        }
        ,[currentPage,lec_id,advModal])
        
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
        }


        /**상담 전체 출력*/
        const advs =(cpage)=>{
        if(typeof cpage === 'number'){
                 cpage=cpage||1;
                }else{
                        cpage=1;
                }
                setCurrentPage(cpage);
                let params = new URLSearchParams();
                params.append("cpage",currentPage);
                params.append("pagesize",5);
                params.append("lec_id",lec_id);
                axios
                        .post("/adv/advListJson.do",params)
                        .then((res)=>{
                                setAdvList(res.data.listdata);
                                setTotalcnt(res.data.listcnt);
                                setCurrentPage(cpage);
                        })
                        .catch((err)=>{
                                alert(err.message)
                        })     

        };
     
        const searchstylewidth = {
                height: "28px",
                width: "200px",
              };

        const searchstyle = {
                fontsize: "15px",
                fontweight: "bold",
                };

        // 상담 등록
        const newAdv=()=>{
            setAdvId("");
            setAdvModal(true);
        }

        //수정
        const advDetail=(advId)=>{
            setAdvId(advId)
            setAdvModal(true);
        }
  
        
        return(<>
 
         <div>
            <div>
                <p className="Location">
                <span className="btn_nav bold">학습 관리</span>
                <span className="btn_nav bold"> 수강상담관리</span>
                </p>   
                <p className="conTitle">
                <span>수강상담관리</span>
                <span className="fr">
  
                    <select onChange={selectLec}>
                        <option value="">전체</option>
                        {
                          lecList.map((i)=>{
                              return ( 
                                 <option key={i.lec_id} value={i.lec_id}>{i.lec_name}</option>
                                )
                          }) 
                        }  
                    </select>

                    <button 
                        className="btn btn-primary"
                        name="newAdv"
                        id="newAdv"
                        onClick={newAdv}
                    >
                            <span>등록</span>
                    </button>

                </span>
                </p>            
            </div>

            <div>
                <table className="col">
                <colgroup>
                    <col width="20%" />
                    <col width="40%" />
                    <col width="15%" />
                    <col width="15%" />
                    <col width="15%" />
                </colgroup>
                <thead>
                    <tr>
                    <th>과정명</th>
                    <th>상담내용</th>
                    <th>학생ID</th>
                    <th>상담일자</th>
                    <th>상담자명</th>
                    </tr>
                </thead>
           
                <tbody>
                    {
                        advList.map((item)=>{
                            return(
                                <tr key={item.adv_id}>
                                    <td>{item.lec_name}</td>
                                    <td
                                        className="pointer-cursor"
                                        onClick={()=>advDetail(item.adv_id)}
                                    >
                                            {item.adv_content}
                                    </td>
                                    <td>{item.std_id}</td>
                                    <td>{item.adv_date}</td>
                                    <td>{item.tut_name}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
          
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPage={totalcnt}
                    pageSize={5}
                    blockSize={5}
                    onClick={advs}
                  />
            </div>
           {advModal ? <AdviceModal openModal={advModal}  setCurrentPage={setCurrentPage} setAdvModal={setAdvModal} adv_id={advId}></AdviceModal> : null}
   
    </div>

        </>)
    }

