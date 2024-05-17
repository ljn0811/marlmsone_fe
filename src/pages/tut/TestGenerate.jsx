import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TestGenerateModal from "./TestGenerate/TestGenerateModal";
import TestPaperModal from "./TestGenerate/TestPaperModal";
import Pagination from '../../components/common/Pagination'

const TestGenerate = ()=>{
  //advList
  const [searchKey, setSearchKey] = useState('')
  const blockSize = 5
  const pageSize = 10
  const [currentPage, setCurrentPage] = useState(1)
  const [setTotalPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [testList, setTestList] = useState([])

  //Modal
  const [testModal, setTestModal] = useState(false);
  const [testDetailModal, setTestDetailModal] = useState(false);
  const [testId, setTestId] = useState();

  useEffect(() => {  
    searchList();
  }, [searchKey])

  const searchList = (cpage, e) => {

    cpage = cpage || 1
    setCurrentPage(cpage)

    console.log(searchKey)

    let params = new URLSearchParams()
    params.append('searchKey', searchKey)
    params.append('currentPage', cpage)
    params.append('pageSize', pageSize)

     axios
      .post('/tut/tutTestListjson.do', params)
      .then((res) => {
        setTestList(res.data.listData)
        setTotalCount(res.data.listCnt)
        setTotalPage(Math.ceil(res.data.listCnt / pageSize))
      })
      .catch((err) => {
        console.log(err)
      })
  } 

  const testInsertModal = (id) => {
    setTestId(id);
    setTestModal(true);
  }

  const testPaperModal = (id) => {
    setTestId(id);
    setTestDetailModal(true);
  }

  return(
    <div id="testGenerate">
    <p className="Location">
      <a href="/dashboard" className="btn_set home">home</a>
      <span className="btn_nav bold">학습 관리</span>
      <span className="btn_nav bold">시험출제</span>
      <a href="../tut/TestGenerate" className="btn_set refresh">새로고침</a>
    </p>
    <p className="conTitle">
      <span>시험출제 목록</span>
      <span class="fr">
        <select 
          id="searchKey" 
          className="form-control" 
          style={{width: '150px', height: '35px', marginRight: '5px'}}
          onChange={(e) => setSearchKey(e.target.value)}
        >
          <option value="all">전체</option>
          <option value="ProceedingTest">진행중 강의</option>
          <option value="LastTest">종료된 강의</option>
        </select>
      </span>
    </p>    
    <div style={{ marginTop: '50px' }}>
      <span>
        {totalCount !== 0 && '총 게시글: ' + totalCount}
        {currentPage !== 0 && ' / 현재 페이지 번호 : ' + currentPage}
      </span>
      <table className='col'>
        <thead>
          <tr>
            <th scope='col'> 강의번호 </th>
            <th scope='col'> 강의명 </th>
            <th scope='col'> 강의분류 </th>
            <th scope='col'> 강의기간 </th>
            <th scope='col'> 시험문제 </th>
          </tr>
        </thead>
        <tbody>
          {testList.map((list, index) => {
            return (
              <tr key={list.lec_id}>
                <td> {list.lec_id} </td>
                <td> {list.lec_name}</td>
                <td> {list.lec_type_name} </td>
                <td> {list.start_date} ~ {list.end_date} </td>                 
                <td className="pointer-cursor" >  
                  {list.test_id === 0 
                    ? <button onClick={() => testInsertModal(list.test_id)}>시험문제 출제</button> 
                    : <button onClick={() => testPaperModal(list.test_id)}>시험문제 보기</button>
                  }
                </td>                
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* 페이징 처리 */}
      <Pagination currentPage = {currentPage} totalPage = {totalCount} blockSize = {blockSize} onClick = {searchList} pageSize = {pageSize}/>
    </div>
    {testModal ? <TestGenerateModal modalAction={testModal} setCurrentPage={setCurrentPage} setModalAction={setTestModal} id={testId}></TestGenerateModal> : null}
    {testDetailModal ? <TestPaperModal modalAction={testDetailModal} setCurrentPage={setCurrentPage} setModalAction={setTestDetailModal} id={testId}></TestPaperModal> : null}
  </div>  
  )
}

export default TestGenerate;