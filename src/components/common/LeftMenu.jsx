import React, { useState, useLayoutEffect } from "react";
import logo_img from "../../assets/images/admin/login/logo_img.png";
import { useNavigate, Link } from "react-router-dom";

const LeftMenu = () => {
  const [loginId, setLoginId] = useState("");
  const [loginNm, setLoginNm] = useState("");
  const [menuList, setMenuList] = useState([]);
  const navigate = useNavigate();

  const menuClick = (e) => {
    console.log("menuClick start : " + e.target.name);
    if ("a0" === e.target.name) {
      if (document.getElementsByName("dd0")[0].style.display === "none")
        document.getElementsByName("dd0")[0].style.display = "";
      else document.getElementsByName("dd0")[0].style.display = "none";
    } else if ("a1" === e.target.name) {
      if (document.getElementsByName("dd1")[0].style.display === "none")
        document.getElementsByName("dd1")[0].style.display = "";
      else document.getElementsByName("dd1")[0].style.display = "none";
    } else if ("a2" === e.target.name) {
      if (document.getElementsByName("dd2")[0].style.display === "none")
        document.getElementsByName("dd2")[0].style.display = "";
      else document.getElementsByName("dd2")[0].style.display = "none";
    } else if ("a3" === e.target.name) {
      if (document.getElementsByName("dd3")[0].style.display === "none")
        document.getElementsByName("dd3")[0].style.display = "";
      else document.getElementsByName("dd3")[0].style.display = "none";
    } else if ("a4" === e.target.name) {
      if (document.getElementsByName("dd4")[0].style.display === "none")
        document.getElementsByName("dd4")[0].style.display = "";
      else document.getElementsByName("dd4")[0].style.display = "none";
    } else if ("a5" === e.target.name) {
      if (document.getElementsByName("dd5")[0].style.display === "none")
        document.getElementsByName("dd5")[0].style.display = "";
      else document.getElementsByName("dd5")[0].style.display = "none";
    }
    /*
    document.getElementsByName('dd0')[0].style.display='none';
    document.getElementsByName('dd1')[0].style.display='none';
    document.getElementsByName('dd2')[0].style.display='none';

    */
  };

  useLayoutEffect(() => {
    console.log("leftmenu useEffect start");
    //loginProc()
    const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    const usrMnuAtrt2 = JSON.parse(sessionStorage.getItem("usrMnuAtrt2"));
    setLoginId(loginInfo.userId);
    setLoginNm(loginInfo.userNm);
    setMenuList(usrMnuAtrt2);
  }, []);

  let i = -1;
  const nodeList = () => {
    console.log("nodeList start");
    i++;
    let nodeList = [];
    let length = menuList[i].nodeList.length;
    for (let j = 0; j < length; j++) {
      let url = "/dashboard" + menuList[i].nodeList[j].mnu_url;
      if (!(url.indexOf(".do") === -1)) {
        url = url.slice(0, url.length - 3);
      }
      nodeList.push(
        <li key={j}>
          {<Link to={url}>- {menuList[i].nodeList[j].mnu_nm}</Link>}
          {
            // <a href={url}>
            //   - {menuList[i].nodeList[j].mnu_nm}
            // </a>
          }
        </li>
      );
    }
    //MNU_URL
    //mnu_nm
    return nodeList;
  };

  const logoutproc = () => {
    console.log(sessionStorage.getItem("loginInfo2"));
    if (window.confirm("로그아웃?")) {
      sessionStorage.setItem("loginInfo2", "");
      navigate("/login");
    }
  };

  return (
    <>
      <h3 className="hidden">lnb 영역</h3>
      <div id="lnb_area">
        <div id="header">
          <a href="#!" className="logo">
            <img alt="logo" src={logo_img} />
          </a>
        </div>
      </div>
      <div className="login">
        <span className="LoginName">
          {loginId} {loginNm}
        </span>
        <div className="btn_loginArea">
          <a href="#!" className="logout" onClick={logoutproc} name="modal">
            <span style={{ cursor: "pointer" }}>LOGOUT</span>
          </a>
        </div>
      </div>
      <ul className="lnbMenu">
        {menuList.map((list, index) => {
          let menuName = "a" + index;
          let subMenuName = "dd" + index;
          return (
            <li key={index}>
              <dl key={index}>
                <dt>
                  <a
                    onClick={menuClick}
                    name={menuName}
                    href="#!"
                    className="lnbBtn menu005"
                  >
                    {list.mnu_nm}
                  </a>
                </dt>
                <dd style={{ display: "none" }} name={subMenuName}>
                  {nodeList()}
                </dd>
              </dl>
            </li>
          );
        })}
      </ul>
    </>
  );
};
export default LeftMenu;
