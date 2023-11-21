import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu, ClinicMenu } from './menuApp';
import './Header.scss';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash'
import { getAllDetailClinicById } from '../../services/userService';

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            menuApp: []
        }
    }


    handleChangLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)

    }

    async componentDidMount() { //mỗi lần mount
        // ta sẽ liên tục check DB xem Clinic này có còn ở trạng thái hoạt động không?
        // hơi ngốn hiệu năng nhưng cứ tạm thế đã

        let res = await getAllDetailClinicById(this.props.userInfo.id) // check lại CSYT này từ DB
        if (res && res.errCode === 0) { // nếu check được
            // console.log('res', res)
            if (res.data.status != 1) { // nếu status không phải 1 (= 0)
                alert('Tài khoản của bạn đang tạm ngừng hoạt động')
                this.props.processLogout() // đăng xuất
            }
        } else {
            alert('Tài khoản của bạn đang tạm ngừng hoạt động')
            this.props.processLogout() // đăng xuất
        }

        let { userInfo } = this.props //learn_login_prop4: phải có câu này
        // console.log('userInfo', userInfo)
        let menu = []
        /*learn_login_prop5: đến đây là ổn rồi, chỗ này đơn giản chỉ là check Role trong bảng Account
        Tùy role thì thanh menu sẽ hiện ra các mục thôi, nhưng đấy đơn giản chỉ là ẩn/hiện
         nếu nhập đúng link, thì role nào cũng truy cập được như nhau
         Đây chính là lỗi bảo mật, không được
        */
        if (userInfo && !_.isEmpty(userInfo)) {
            // let role = userInfo.role
            // if (role === USER_ROLE.ADMIN) {
            //     menu = musMediAdminMenu
            // }
            // if (role === USER_ROLE.DOCTOR) {
            //     menu = doctorMenu
            // }
            menu = ClinicMenu
        }

        this.setState({
            menuApp: menu
        })
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        // console.log('this.props header', this.props)

        return (
            <div className="header-container">
                <div className='rowLoz'>
                    <div className='logo-clinic-management-system'>

                    </div>
                    {/* thanh navigator */}
                    {/* <div className="header-tabs-container">
                        <Navigator menus={this.state.menuApp} />
                    </div> */}
                    <a href='/system/user-manage' title='Đơn đặt lịch'><i className="fas fa-tasks"></i></a>

                    {/* <a href=''><h1></h1></a> */}
                    {/* <a href='/system/listDoctor' title='Bác sĩ & gói dịch vụ'><i className="fas fa-stethoscope"></i></a> */}
                    <a
                        href={`/system/LichBieu/${new Date().getDate() + 1}&${new Date().getMonth() + 1}&${new Date().getFullYear()}`}
                        title='Lịch biểu'
                    >
                        <i className="fas fa-calendar-alt"></i>
                    </a>
                    <a href='/system/setting' title='Cài đặt'><i className="fas fa-cog"></i></a>
                    <a href='' title='Số liệu'><i className="fas fa-database"></i></a>
                </div>

                <div className='rowLoz'>
                    <div className='welcome'>{userInfo.name}</div>
                    <div className='avatar-clinic' style={{ backgroundImage: `url(${new Buffer(this.props.userInfo.image, 'base64').toString('binary')})` }}>

                    </div>

                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={() => {
                        if (window.confirm('Bạn muốn đăng xuất?') === true) processLogout()
                    }} title='Đăng xuất'>
                        <i className="fas fa-sign-out-alt"></i>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>

            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo, //learn_login_prop3: đây, nhớ khai báo để dùng
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
