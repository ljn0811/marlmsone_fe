import axios from "axios";
import { useEffect, useState } from "react";
import { useQueryParam } from "../../../hook/useQueryParam";
import Pagination from "../../../components/common/Pagination";
import ModalEquipment from "./ModalEquipment";




const Equipment = () => {
    const [equipCurrentPage, setEquipCurrentPage] = useState(1);
    const [equipList, setEquipList] = useState([]);
    const [equipTotalcnt, setEquipTotalcnt] = useState(0);

    const [equipDisplay, setEquipDisplay] = useState(false);
    const [equipModalOn, setEquipModalOn] = useState(false);
    const [equipId, setEquipId] = useState();


    // const [searchroomid, setSearchroomid] = useState();

    // const { search } = useLocation();
    // const id = useMemo(() => new URLSearchParams(search), [search]);

    const queryParam = useQueryParam();
    const searchLecrmId = queryParam.get('id');


    useEffect(() => {
        if (searchLecrmId !== null) {
            searchEquipList();
        }
    }, [searchLecrmId, equipModalOn]);

    // 장비 목록 조회
    const searchEquipList = async (cpage) => {

        if (typeof cpage === 'number') {
            cpage = cpage || 1;
        } else {
            cpage = 1;
        }

        setEquipCurrentPage(cpage);
        setEquipDisplay(true);

        let params = new URLSearchParams();
        params.append("cpage", cpage);
        params.append("pagesize", 5);
        params.append("lecrm_id", searchLecrmId);

        await axios
            .post("/adm/equListjson.do", params)
            .then((res) => {
                setEquipTotalcnt(res.data.listcnt);
                setEquipList(res.data.listdata);
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    const equipNew = () => {
        setEquipId("");
        setEquipModalOn(true);
    }

    const equipModify = (id) => {
        setEquipId(id);
        setEquipModalOn(true);        
    }

    return (
        <div>
            {equipDisplay && (
                <div>
                    <p className="conTitle">
                        <span>장비 목록</span>{" "}
                        <span className="fr">
                            <button
                                className="btn btn-primary"
                                name="newRegEqu"
                                id="newRegEqu"
                                onClick={equipNew}
                            >
                                <span>장비 신규등록</span>
                            </button>
                        </span>
                    </p>
                    {/* 장비 목록 display */}
                    <div>
                        <b>
                            총건수 : {equipTotalcnt} 현재 페이지 번호 : {equipCurrentPage}
                        </b>
                        <table className="col">
                            <colgroup>
                                <col width="20%" />
                                <col width="15%" />
                                <col width="15%" />
                                <col width="40%" />
                                <col width="15%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>강의실 명</th>
                                    <th>장비 명</th>
                                    <th>장비수</th>
                                    <th>비고</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                equipTotalcnt === 0 && (
                                    <tr>
                                        <td colSpan="5">데이터가 없습니다.</td>
                                    </tr>
                                )
                            }
                            {
                                equipTotalcnt > 0 && equipList.map((item) => {
                                    return (
                                        <tr key={item.equ_id}>
                                            <td>{item.lecrm_name}</td>
                                            <td>{item.equ_name}</td>
                                            <td>{item.equ_num}</td>
                                            <td>{item.equ_note}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        equipModify(item.equ_id);
                                                    }}
                                                >
                                                    수정
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                        <Pagination currentPage={equipCurrentPage}
                                    totalPage={equipTotalcnt}
                                    pageSize={5}
                                    blockSize={5}
                                    onClick={searchEquipList}
                        />
                    </div>{/* End 장비 목록 display */}
                    {equipModalOn ? <ModalEquipment modalAction={equipModalOn} 
                                                  setCurrentPage={setEquipCurrentPage} 
                                                  setModalAction={setEquipModalOn} 
                                                  lecrmId={searchLecrmId}
                                                  equipId={equipId}></ModalEquipment> : null}
                </div>
            )}
        </div>
    )
}

export default Equipment;