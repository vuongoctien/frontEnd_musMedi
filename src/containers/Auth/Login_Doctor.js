import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { Redirect, useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Login_Doctor() {
    /** Đã hiểu. Bên file App, mình đặt đường dẫn (bên file App) để nó mở component Login_Doctor này
     * Nói chung đây là điều hướng trang, thứ mình chưa học trước đây
     * Chỉ băn khoăn là, nếu kẻ gian trực tiếp sửa LocalStorage...
     * mà thôi, trước mắt cứ chạy được là được, bảo mật có mức độ thôi, đồ án thôi mà
    */

    return (
        <Router>

            <Switch>
                {/* Nếu cố tình không đăng nhập mà vẫn truy cập link của Admin là 
                thì ông mày check xem đã đăng nhập chưa, bằng localStorage, cái này tạm thời biết thế đã
                Nếu rồi, ông mày cho mở component Admin cho
                Nếu chưa, cụ mày bắt về lại link /loginDoctor, tức là trang đăng nhập */}
                <Route path="/loginDoctor/admin" render={() => {
                    return localStorage.getItem("day_la_sting_lu_trong_LocalStorage_khi_dang_nhap") ? <Admin /> : <Redirect to="/loginDoctor" />
                }}>
                </Route>



                {/* Nếu đường dẫn là /loginDoctor, 
                thì mở component Login ra (được viết ngay chỗ function bên dưới) 
                Nhưng nếu đã đăng nhập rồi thì vẫn vào được Login, cái này mình sẽ phải sử lý sau*/}
                <Route path="/loginDoctor">
                    <Login />
                </Route>
            </Switch>

        </Router>
    )
}

function Admin() {
    document.title = 'Đã đăng nhập'
    let history = useHistory()
    let logOUT = () => {
        localStorage.removeItem("day_la_sting_lu_trong_LocalStorage_khi_dang_nhap")
        history.replace("/loginDoctor")
    }
    return <div>
        <h2>Đã đăng nhập</h2>
        <button onClick={logOUT}>Đăng xuất</button>
    </div>
}

function Login() {
    document.title = 'Chưa đăng nhập'
    let history = useHistory()
    let logIN = () => {
        localStorage.setItem("day_la_sting_lu_trong_LocalStorage_khi_dang_nhap", true)
        history.replace("/loginDoctor/admin")
    }
    return <div>
        <h2>Chưa đăng nhập</h2>
        <button onClick={logIN}>Đăng nhập</button>
    </div>
}