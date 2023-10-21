import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import './UserManage.scss';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash'

class UserManage extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }




    componentDidMount() {
        document.title = `đơn đặt lịch | ${this.props.userInfo.name}`
        document.getElementsByClassName('fa-list-alt')[0].setAttribute("style", "color:orange;")
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        console.log('this.props UserManage', this.props)

        return (
            <div className='text-center'>
                <br />
                <h1>Chào mừng {this.props.userInfo.name} đến với trang quản trị</h1>
                <hr />
                <h4>Này ông cháu Vương Ngọc Tiến, ở trang này ta đã lấy được thông tin CSYT đăng nhập từ props</h4>
                <br />
                <br />
                <h4>Component này sẽ hiện đơn đặt lịch </h4>

            </div>

        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);

