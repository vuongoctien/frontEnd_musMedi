import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import Navigator from '../../../components/Navigator';
// import './LichBacSi.scss';
import { LANGUAGES, USER_ROLE } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash'
import DatePicker from '../../../components/Input/DatePicker';

class LichBacSi extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: new Date(new Date().setDate(new Date().getDate())),
            rangeTime: []
        }
    }

    componentDidMount() {
        document.title = `lịch biểu | ${this.props.userInfo.name}`
        document.getElementsByClassName('fa-calendar-alt')[0].setAttribute("style", "color:orange;")
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({ currentDate: date[0] })
    }

    render() {
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1))



        var date = this.state.currentDate.getFullYear() + '-' + (this.state.currentDate.getMonth() + 1) + '-' + this.state.currentDate.getDate();
        console.log('ngày mình chọn trong lịch là ', this.state.currentDate)
        console.log('ngày mình chọn trong lịch đã được định dạng thủ công và sẵn sàng quăng lên DB', date)


        return (
            <div className='text-center'>
                Ok component này là code lịch bác sĩ thật
                <DatePicker
                    onChange={this.handleOnChangeDatePicker}
                    className='form-control'
                    value={this.state.currentDate}
                    minDate={yesterday}
                />
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

