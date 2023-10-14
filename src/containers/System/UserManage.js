import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UserManage.scss'


class UserManage extends Component {

    render() {
        return (
            <div className='text-center mt-5'>
                <h1>Chào mừng đến với trang quản trị của hệ thống musMedi</h1>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
