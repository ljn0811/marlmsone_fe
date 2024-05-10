import axios from "axios";
import { useEffect,  useState } from "react";
import { useQueryParam } from "../../../hook/useQueryParam";
import Pagination from "../../../components/common/Pagination";

const CehckStdList = () => {
    const [checkStdList, setCheckStdList] = useState([]);
    const [checkStdCount, setCheckStdCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const queryParam = useQueryParam();
    const searchTestId = queryParam.get('id');

    useEffect(() => {
        searchStdList(currentPage);
    }, [currentPage, searchTestId]);

    const searchStdList = async (cpage) => {
        if (typeof cpage === 'number') {
            cpage = cpage || 1;
        } else {
            cpage = 1;
        }
        let params = new URLSearchParams();
        params.append("cpage", cpage);
        params.append("pagesize", 5);
        params.append("checkStdList", checkStdList);
        params.append("totalGradeCnt", checkStdCount);
        params.append("lec_id", searchTestId);

        await axios
            .post("/tut/checkStdList.do", params)
            .then((res) => {
                setCheckStdList(res.data.checkStdList);
                setCheckStdCount(res.data.checkStdCount);
                setCurrentPage(cpage);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    return (
        <div>
            <table className="col">
                <caption>caption</caption>
                <colgroup>
                    <col width="20%" />
                    <col width="20%" />
                    <col width="20%" />
                    <col width="20%" />
                    <col width="20%" />
                </colgroup>

                <thead>
                    <tr>
                        <th scope="col">아이디</th>
                        <th scope="col">학생명</th>
                        <th scope="col">점수</th>
                        <th scope="col">통과/과락</th>
                        <th scope="col">응시상태</th>
                    </tr>
                </thead>
                <tbody>
                    {checkStdCount === 0 ? (
                        <tr>
                            <td colSpan="5">해당되는 데이터가 없습니다.</td>
                        </tr>
                    ) : (
                        checkStdList.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.loginID}</td>
                                    <td>{item.name}</td>
                                    <td>{item.test_score}</td>
                                    <td>{item.pass}</td>
                                    <td>{item.test_yn}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            <Pagination 
                currentPage={currentPage}
                totalPage={checkStdCount}
                pageSize={5}
                blockSize={5}
                onClick={searchStdList}
            />
        </div>
    )
}
export default CehckStdList;