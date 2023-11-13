import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Setting.scss'
import * as actions from "../../store/actions";
import { getAllDetailClinicById, editClinic } from '../../services/userService';
import { toast } from 'react-toastify';

class Setting extends Component {

    constructor(props) {
        super(props)
        this.state = {
            quantity_date: undefined,
            show_order: undefined
        }
    }

    async componentDidMount() {
        document.getElementsByClassName('fa-cog')[0].setAttribute("style", "color:brown;")
        let res = await getAllDetailClinicById(this.props.userInfo.id) ////////////////api
        if (res && res.errCode === 0) {
            this.setState({
                quantity_date: res.data.quantity_date,
                show_order: res.data.show_order
            })
        }
    }

    handleSave = async () => {
        console.log('cucDatâIP', {
            id: this.props.userInfo.id,
            quantity_date: this.state.quantity_date,
            show_order: this.state.show_order
        })
        let res = await editClinic({
            id: this.props.userInfo.id,
            quantity_date: this.state.quantity_date,
            show_order: this.state.show_order
        })
        if (res && res.errCode === 0) {
            alert('Chỉnh sửa thành công')
            toast.success('Chỉnh sửa thành công')
        } else { toast.error('Lỗi') }
    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state }
        // console.log('stateCopy: ', stateCopy)
        stateCopy[id] = event.target.value
        // console.log('event.target.value', event.target.value)
        // console.log('stateCopy lan 2: ', stateCopy)
        this.setState({
            ...stateCopy
        })
    }


    render() {
        console.log('this.state', this.state)
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-8 mx-auto">
                        <h2 className="h3 mb-4 page-title">&nbsp;</h2>
                        <div className="my-4">
                            <ul className="nav nav-tabs mb-4" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Cài đặt</a>
                                </li>
                            </ul>

                            <hr className="my-4" />
                            <strong className="mb-0">Trang chủ</strong>
                            <p>Cài đặt thông tin hiển thị với bệnh nhân trên trang chính</p>
                            <div className="list-group mb-5 shadow">
                                <div className="list-group-item">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <strong className="mb-0">Số ngày đặt lịch tiếp theo</strong>
                                            <p className="text-muted mb-0">Ví dụ chọn 7 ngày, bệnh nhân có thể đặt lịch khám trong 7 ngày tiếp theo</p>
                                        </div>
                                        <div className="col-auto">
                                            <div className="custom-control custom-switch">
                                                <input type="number" min='1' max='30' value={this.state.quantity_date}
                                                    onChange={(event) => this.handleOnChangeInput(event, 'quantity_date')} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-group-item">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <strong className="mb-0">Hiển thị trạng thái </strong>
                                            <p className="text-muted mb-0">Fusce lacinia elementum eros, sed vulputate urna eleifend nec.</p>
                                        </div>
                                        <div className="col-auto">
                                            <div className="custom-control custom-switch">
                                                {this.state.show_order === 1 ?
                                                    <button type="button" class="btn btn-success"
                                                        onClick={() => { this.setState({ show_order: '0' }) }}>Hiện</button>
                                                    :
                                                    <button type="button" class="btn btn-danger"
                                                        onClick={() => { this.setState({ show_order: 1 }) }}>Ẩn</button>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4" />
                            <strong className="mb-0">Đổi mật khẩu</strong>
                            <p>Trong trường hợp quên mật khẩu, hãy liên hệ với quản trị viên để được cấp lại</p>
                            <div className="list-group mb-5 shadow">
                                <div className="list-group-item">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <strong className="mb-0">Nhập mật khẩu cũ</strong>
                                            <p className="text-muted mb-0">Nhập mật khẩu cũ</p>
                                        </div>
                                        <div className="col-auto">
                                            <div className="custom-control custom-switch">
                                                <input type="password" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-group-item">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <strong className="mb-0">Nhập mật khẩu mới</strong>
                                            <p className="text-muted mb-0">Nhập mật khẩu mới</p>
                                        </div>
                                        <div className="col-auto">
                                            <div className="custom-control custom-switch">
                                                <input type="password" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-group-item">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <strong className="mb-0">Nhập lại mật khẩu mới</strong>
                                            <p className="text-muted mb-0">Nhập lại mật khẩu mới</p>
                                        </div>
                                        <div className="col-auto">
                                            <div className="custom-control custom-switch">
                                                <input type="password" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div><button type="button" className="btn btn-primary" onClick={this.handleSave}>Lưu thay đổi</button></div>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
