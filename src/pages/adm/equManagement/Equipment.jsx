import axios from "axios";
import { useEffect, useState } from "react";
import { useQueryParam } from "../../../hook/useQueryParam";
import ModalEqu from "./ModalEqu";
import Pagination from "../../../components/common/Pagination";

const Equipment = () => {
    const [equdis, setEqudis] = useState(false);
    const [equcurrentPage, setEqucurrentPage] = useState(1);
    const [equitemlist, setEquitemlist] = useState([]);
    const [equtotalcnt, setEqutotalcnt] = useState(0);
    // const [searchroomid, setSearchroomid] = useState();

    const [equModal, setEquModal] = useState(false);
    const [equId, setEquId] = useState();

    const [pageSize, setPageSize] = useState(5);

    // const { search } = useLocation();
    // const id = useMemo(() => new URLSearchParams(search), [search]);

    const queryParam = useQueryParam();
    const searchroomid = queryParam.get("id");

    const openEqu = (id) => {
        setEquId(id);
        setEquModal(true);
    };

    const newEqu = () => {
        setEquId("");
        setEquModal(true);
    };

    useEffect(() => {
        equlist(equcurrentPage);
    }, [searchroomid, equModal, equcurrentPage]);

    const equlist = (cpage) => {
        if (typeof cpage === "number") {
            cpage = cpage || 1;
        } else {
            cpage = 1;
        }
        setEqucurrentPage(cpage);
        setEqudis(true);

        let params = new URLSearchParams();
        params.append("cpage", cpage);
        params.append("pagesize", 5);
        params.append("lecrm_id", searchroomid);

        axios
            .post("/adm/equListjson.do", params)
            .then((res) => {
                setEqutotalcnt(res.data.listcnt);
                setEquitemlist(res.data.listdata);
                setEqucurrentPage(cpage);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    return (
        <div>
            {equdis && (
                <div>
                    <p className="conTitle">
                        <span>장비 목록</span>
                        <span className="fr">
                            <button
                                className="btn btn-primary"
                                name="newRegEqu"
                                id="newRegEqu"
                                onClick={() => newEqu()}
                            >
                                <span>장비 신규등록</span>
                            </button>
                        </span>
                    </p>
                    <div>
                        <b>
                            총건수 : {equtotalcnt} 현재 페이지 번호 :
                            {equcurrentPage}
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
                                {equitemlist.map((item) => {
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
                                                        openEqu(item.equ_id);
                                                    }}
                                                >
                                                    수정
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={equcurrentPage}
                            totalPage={equtotalcnt}
                            pageSize={pageSize}
                            blockSize={5}
                            onClick={equlist}
                        />
                    </div>
                </div>
            )}
            {equModal ? (
                <ModalEqu
                    modalAction={equModal}
                    setModalAction={setEquModal}
                    id={equId}
                    lecrmId={searchroomid}
                ></ModalEqu>
            ) : null}
        </div>
    );
};

export default Equipment;
