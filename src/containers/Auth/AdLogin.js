import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { Redirect, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import './AdLogin.scss'
import logo from '../../assets/musMedi.png'
import { handleLoginApi } from "../../services/userService";
import AdminCRUD from "./AdminCRUD";

export default function AdLogin() {
    /** Đã hiểu. Bên file App, mình đặt đường dẫn (bên file App) để nó mở component AdLogin này
     * Nói chung đây là điều hướng trang, thứ mình chưa học trước đây
     * Chỉ băn khoăn là, nếu kẻ gian trực tiếp sửa LocalStorage...
     * mà thôi, trước mắt cứ chạy được là được, bảo mật có mức độ thôi, đồ án thôi mà
    */



    return (
        <Router>

            <Switch>

                <Route path="/adLogin/admin" render={() => {
                    return localStorage.getItem("Day_la_string_luu_trong_LocalStorage_khi_dang_nhap_RuiRoBaoMat") ? <Admin /> : <Redirect to="/adLogin" />
                }}>
                </Route>

                <Route path="/adLogin" render={() => {
                    return localStorage.getItem("Day_la_string_luu_trong_LocalStorage_khi_dang_nhap_RuiRoBaoMat") ? <Redirect to="/adLogin/admin" /> : <Login />
                }}>
                </Route>

            </Switch>

        </Router>
    )
}

function Admin() {
    // document.title = 'Đã đăng nhập'
    let history = useHistory()
    let logOUT = () => {
        localStorage.removeItem("Day_la_string_luu_trong_LocalStorage_khi_dang_nhap_RuiRoBaoMat")
        history.replace("/adLogin")
    }

    return <>
        <div className="header-logout row">
            <div className="col-4">
                <img src={logo}></img>
            </div>
            <div className="col-6"></div>
            <div className="col-2">
                <br />
                <div>Xin chào {localStorage.getItem("Day_la_string_luu_trong_LocalStorage_khi_dang_nhap_RuiRoBaoMat")}</div>
                <br />
                <button type="button" class="btn btn-info" onClick={logOUT}>Đăng xuất</button>
            </div>
        </div>

        <div className='body'>

            <div className="menu">
                <ul>
                    <li>
                        <a>Cơ sở Y tế ▾</a>
                        <ul class="dropdown">
                            <li><a href="/adLogin/admin/listClinic">Danh sách</a></li>
                            <li><a href="/adLogin/admin/clinicAdd">Thêm</a></li>
                            <li><a href="/adLogin/admin/clinicEditDelete">Chỉnh sửa</a></li>
                        </ul>
                    </li>
                    <li>
                        <a>Chuyên khoa ▾</a>
                        <ul class="dropdown">
                            <li><a href="/adLogin/admin/specialty">Quản lý chuyên khoa</a></li>
                        </ul>
                    </li>
                    <li><a>Số liệu ▾</a></li>
                </ul>
            </div>
            <div>
                <AdminCRUD />
            </div>
        </div>
    </>
}

function Login() {
    document.title = 'Quản trị viên'
    let history = useHistory()
    let logIN = async () => {
        let nickName = document.getElementById('musMediNickName').value
        let passWord = document.getElementById('musMediPassWord').value
        let errMessage = ''
        try {
            let data = await handleLoginApi(nickName, passWord)
            console.log('data', data)
            if (data && data.errCode !== 0) {
                errMessage = data.message
                document.getElementById('thong_bao').innerHTML = errMessage
                document.getElementById('thong_bao').style = 'color:red'
            }
            if (data && data.errCode === 0) {
                console.log('Đăng nhập thành công, có hàm gì thì quăng vào đây')
                errMessage = data.message
                document.getElementById('thong_bao').innerHTML = errMessage
                document.getElementById('thong_bao').style = 'color:green'
                let nameAd = data.user.nickName
                localStorage.setItem("Day_la_string_luu_trong_LocalStorage_khi_dang_nhap_RuiRoBaoMat", nameAd)
                localStorage.setItem("componentOpen", 1)
                history.replace("/adLogin/admin")
            }

        } catch (error) {
            if (error.response.data) {
                errMessage = error.response.data.message
                document.getElementById('thong_bao').innerHTML = errMessage
            }
        }


    }

    return <div>
        <div id="container">
            <div className="col-6">
                <img src={logo} />
            </div>
            <div className="col-12">
                <h5>Đăng nhập dành cho Quản trị viên</h5>
            </div>
            <hr />

            <label id="label" for="email"><b>Tên đăng nhập</b></label>

            <input id="musMediNickName" type="text" placeholder="Nhập Email" name="email" required />



            <label id="label" for="psw"><b>Mật khẩu</b></label>

            <input id="musMediPassWord" type="password" placeholder="Nhập Mật Khẩu" name="psw" required />

            <h6 id="thong_bao"><br /></h6>
            <hr />

            <div id="clearfix">
                <button id="button" onClick={logIN}>Đăng nhập</button>
            </div>
        </div>
    </div>
}
