import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import Navigator from '../../../components/Navigator';
// import './LichBacSi.scss';
import { LANGUAGES, USER_ROLE } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash'

class LichBacSi extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }




    componentDidMount() {
        document.title = `đơn đặt lịch | ${this.props.userInfo.name}`
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        console.log('this.props LichBacSi', this.props)

        return (
            <div className='text-center'>
                Ok component này là code lịch bác sĩ thật

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

export default connect(mapStateToProps, mapDispatchToProps)(LichBacSi);

