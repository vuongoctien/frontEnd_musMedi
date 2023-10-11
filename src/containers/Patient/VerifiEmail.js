import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './VerifiEmail.scss';
import { postVerifyBookAppointment } from '../../services/userService';
import HomeHeader from '../HomePage/HomeHeader';

class VerifiEmail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            statusVerify: false,
            errCode: 0
        }
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search)
            let token = urlParams.get('token')
            let doctorId = urlParams.get('doctorId')
            let res = await postVerifyBookAppointment({
                token: token,
                doctorId: doctorId
            })

            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })
            }
            else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {  // à prevProps trức là props trước đó
        if (prevProps.language !== this.props.language) {

        }
        if (prevProps.doctorId !== this.props.doctorId) {

        }
    }

    render() {
        let { statusVerify, errCode } = this.state
        console.log('this.state', this.state)
        return (
            <>
                <HomeHeader />
                <div className='verify-email-container'>
                    {statusVerify === false ?
                        <div className=''>
                            lịch hẹn không tồn tại hoặc đã được xác nhận trước đó
                        </div>
                        :
                        <div>
                            {+errCode === 0 ?
                                <div className='info-booking'>xác nhận lịch hẹn thành công</div>
                                :
                                <div className='info-booking'>lịch hẹn đã được xác nhận trước đó</div>
                            }
                        </div>
                        // chỗ này đang chưa chuẩn lắm đâu, nhớ sửa sau
                    }
                </div>
            </>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifiEmail);