import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu, ClinicMenu } from './menuApp';
import './Header.scss';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash'

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

    componentDidMount() {
        let { userInfo } = this.props //learn_login_prop4: phải có câu này
        console.log('userInfo', userInfo)
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
        console.log('this.props header', this.props)

        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>
                <div className='languages'>
                    <span className='welcome'>musMedi xin chào {userInfo.name} !        </span>


                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout} title='Log out'>
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
