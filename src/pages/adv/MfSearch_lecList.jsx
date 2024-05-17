import axios from 'axios';
import {useState, useEffect} from 'react'



/*강의 목록 조회*/
export default function MfSearch_lecList(props){ 
        const [lecList,setLecList] = useState([]); 
        const [lectId, setLectId] = useState('');

        useEffect(()=>{
                     
                allLec();
        },[]);

        //강의 목록 조회
        const allLec = () => {
                axios.get('/adv/mlecList.do').then((r)=>{
                        setLecList(r.data.listData);
                        setLectId(props.lecId);
                });
        }

        //강의 선택 onchage
        const selectLec=(e) => {
                setLectId(e.target.value);
                props.id(lectId);
        }
        return(
                
                <select onChange={selectLec} value={props.lecId} defaultValue={''}>
                    <option name="lec_name" value="">전체</option>
                 {
                       lecList.map((a, i)=>{
                        return ( 
                                
                                 <option name="lec_name" key={i} value={a.lec_id}>{a.lec_name}</option>
                                )
                          }) 
                 }   
                </select>)
}


