import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DoctorExtrainfor.scss';
import { LANGUAGES } from '../../../utils/constant';
import { FormattedMessage } from 'react-intl';
import { getExtraInfoDoctorById } from '../../../services/userService';
import NumberFormat from 'react-number-format';

class DoctorExtrainfor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isShowDetailDoctor: false,
            extraInfo: {}
        }
    }

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInfoDoctorById(this.props.doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {  // à prevProps trức là props trước đó
        if (prevProps.language !== this.props.language) {

        }

        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) { // khi doctor Id truyền từ component cha xuống thay đổi
            let res = await getExtraInfoDoctorById(this.props.doctorIdFromParent) // res là ExtraInfo mới
            if (res && res.errCode === 0) { // nếu get API thành công
                this.setState({
                    extraInfo: res.data //cập nhật State, extraInfo mới
                })
            }
        }
    }

    showHideDetailInfo = (status) => {
        this.setState({
            isShowDetailDoctor: status
        })
    }

    render() {
        let { isShowDetailDoctor, extraInfo } = this.state
        let { language } = this.props
        // console.log("state", this.state)
        return (
            <div className='doctor-extra-info-container'>
                <div className='content-up'>
                    <div className='text-address'><FormattedMessage id="patient.extra-info-doctor.text-address" /></div>
                    <div className='name-clinic'>{extraInfo && extraInfo.nameClinic ? extraInfo.nameClinic : ''}</div>
                    <div className='detail-address'>{extraInfo && extraInfo.addressClinic ? extraInfo.addressClinic : ''}</div>
                </div>

                <div className='content-down'>
                    {isShowDetailDoctor === false &&
                        <div className='short-info'>
                            <FormattedMessage id="patient.extra-info-doctor.price" />
                            {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.VI &&
                                <NumberFormat
                                    className='currency'
                                    value={extraInfo.priceTypeData.valueVi}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'VND'}
                                />}

                            {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.EN &&
                                <NumberFormat
                                    className='currency'
                                    value={extraInfo.priceTypeData.valueEn}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'USD'}
                                />}
                            <span className='detail' onClick={() => this.showHideDetailInfo(true)}><FormattedMessage id="patient.extra-info-doctor.detail" /></span>
                        </div>
                    }

                    {isShowDetailDoctor === true &&
                        <>
                            <div className='title-price'><FormattedMessage id="patient.extra-info-doctor.price" /></div>
                            <div className='detail-info'>
                                <div className='price'>
                                    <div className='left'><FormattedMessage id="patient.extra-info-doctor.price" /></div>
                                    <div className='right'>
                                        {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.VI &&
                                            <NumberFormat
                                                className='currency'
                                                value={extraInfo.priceTypeData.valueVi}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'VND'}
                                            />}
                                        {extraInfo && extraInfo.priceTypeData && language === LANGUAGES.EN &&
                                            <NumberFormat
                                                className='currency'
                                                value={extraInfo.priceTypeData.valueEn}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'USD'}
                                            />}
                                    </div>
                                </div>
                                <div className='note'>{extraInfo && extraInfo.note ? extraInfo.note : ''}</div>
                            </div>
                            <div className='payment'>
                                <FormattedMessage id="patient.extra-info-doctor.payment" />
                                {extraInfo && extraInfo.paymentTypeData && language === LANGUAGES.EN
                                    ? extraInfo.paymentTypeData.valueVi : ''}
                                {extraInfo && extraInfo.paymentTypeData && language === LANGUAGES.VI
                                    ? extraInfo.paymentTypeData.valueEn : ''}
                            </div>
                            <div className='hide-price'>
                                <span onClick={() => this.showHideDetailInfo(false)}><FormattedMessage id="patient.extra-info-doctor.hide-price" /></span>
                            </div>
                        </>
                    }

                </div>
            </div>


        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtrainfor);