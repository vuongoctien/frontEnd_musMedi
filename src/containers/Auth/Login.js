import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions"
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi, loginClinic } from '../../services/userService';
import logo from '../../assets/musMedi.png'


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: '', // dùng để đọc errMes từ backend
        }
    }

    componentDidMount() {
        document.title = 'Đăng nhập | Cơ sở y tế'
    }


    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })

    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })

    }

    handleLogin = async () => { //learn_login_prop1: khi bấm nút đăng nhập
        this.setState({
            errMessage: ''
        })

        try {
            let data = await loginClinic(this.state.username, this.state.password)
            /*
            {
                "errCode": 0,
                "message": "Đăng nhập thành công",
                "user": {
                    "nickName": "admin",
                    "role": "Quản trị viên",
                    "gmail": "@gmail.com",
                    "image": {
                        "type": "Buffer",
                        "data": []
                    }
                }
            }
            */
            console.log('data', data)
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user)
                /*learn_login_prop2: khi đăng nhập thành công, 
                 hàm userLoginSuccess bên userAction sẽ trải
                  qua 7749 bước userReducer, actionType, userAction... 
                  Mục đích cuối cùng là để lưu cục data này vào Prop:
                 {
                    "nickName": "admin",
                    "role": "Quản trị viên",
                    "gmail": "@gmail.com",
                    "image": {
                        "type": "Buffer",
                        "data": []
                    }
                }
                Giờ nhảy sang bên Header(chính là cái thanh Menu xanh dương ấy), ta có thể sử dụng
                 */


                console.log('login success')
            }

        } catch (error) {
            if (error.response.data) {
                this.setState({
                    errMessage: error.response.data.message
                })
            }


            console.log('hoidanit', error.response)

        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    render() {
        // console.log('check state', this.state)
        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12'><img src={logo} alt="some_text" /></div>

                        <div className='col-12 text-login'>Đăng nhập</div>
                        <div className='col-12 text-center'><h5>dành cho Cơ sở Y tế</h5></div>

                        <div className='col-12 form-group login-input'>
                            <label>Tài khoản</label>
                            <input type='text' className='form-control' placeholder='Tên đăng nhập của bạn'
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeUsername(event)}
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Mật khẩu</label>

                            <div className='custom-input-password'>
                                <input type={this.state.isShowPassword ? 'text' : 'password'} className='form-control' placeholder='Nhập mật khẩu'
                                    //value={this.state.password}
                                    onChange={(event) => this.handleOnChangePassword(event)}
                                />
                                <i className={this.state.isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}
                                    onClick={() => { this.handleShowHidePassword() }}></i>
                            </div>

                            <div className='col-12' style={{ color: 'red' }}>
                                {this.state.errMessage}
                            </div>
                        </div>
                        <div className='col-12'>
                            <button className='btn-login' onClick={() => { this.handleLogin() }}>Login</button>
                        </div>

                        <div className='col-12'>
                            <span className='forgot-password'>Quên mật khẩu?</span>
                        </div>
                        <div className='col-12 text-center mt-3'>
                            <span className='text-other-login'>Hoặc đăng nhập với</span>
                        </div>
                        <div className='col-12 social-login'>
                            <i className="fab fa-google-plus-g gg"></i>
                            <i className="fab fa-facebook-f fb"></i>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        //userLoginFail: () => dispatch(actions.adminLoginFail()),


        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor))
        //learn_login_prop? chỗ này hình như dùng để export
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
