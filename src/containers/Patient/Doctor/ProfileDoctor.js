import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ProfileDoctor.scss';
import { getProfileDocTorById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils'
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';

class ProfileDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataProfile: {}
        }
    }

    async componentDidMount() { //async để đây tức hàm Mount này phải đợi
        let data = await this.getInfoDoctor(this.props.doctorId) // đợi đến khi lấy được data
        // console.log(data)
        this.setState({
            dataProfile: data
        })
    }

    getInfoDoctor = async (id) => {
        let result = {}
        if (id) {
            let res = await getProfileDocTorById(id)
            if (res && res.errCode === 0) {
                result = res.data
            }
        }
        return result
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {  // à prevProps trức là props trước đó
        if (prevProps.language !== this.props.language) {

        }
        if (prevProps.doctorId !== this.props.doctorId) {

        }
    }

    renderTimeBooking = (dataTime) => {
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn
            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('dddd - DD/MM/YYYY')
            return (
                <>
                    <div>{time} - {date}</div>
                    <div><FormattedMessage id="patient.booking-modal.priceBooking" /></div>
                </>
            )
        }
        return <></>
    }


    render() {
        let { dataProfile } = this.state
        let { language, isShowDescriptionDoctor, dataTime, isShowPrice, isShowLinkDetail, doctorId } = this.props //truyền từ cha là BookingModal xuống
        // console.log("language, isShowDescriptionDoctor, dataTime", language, isShowDescriptionDoctor, dataTime)

        let nameVi = '', nameEn = ''
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div
                        className='content-left'
                        style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}
                    >

                    </div>
                    <div className='content-right'>
                        <div className='up'>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                        <div className='down'>
                            {isShowDescriptionDoctor === true ? // video84 chưa có nút onclick nào chỉnh cái này 
                                <>
                                    {dataProfile && dataProfile.Markdown
                                        && dataProfile && dataProfile.Markdown.description
                                        &&
                                        <span>
                                            {dataProfile.Markdown.description}
                                        </span>
                                    }
                                </>
                                :
                                <>
                                    {this.renderTimeBooking(dataTime)}
                                </>}
                        </div>
                    </div>
                </div>
                {isShowLinkDetail === true
                    &&
                    <div className='view-detail-dcotor'>
                        <Link to={`/detail-doctor/${doctorId}`}>Xem theem</Link>
                    </div>}
                {isShowPrice === true
                    &&
                    <div className='price'>
                        <FormattedMessage id="patient.booking-modal.price" />
                        {
                            dataProfile && dataProfile.priceTypeData && language === LANGUAGES.VI &&
                            <NumberFormat
                                className='currency'
                                value={dataProfile.priceTypeData.valueVi}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'VND'}
                            />
                        }

                        {
                            dataProfile && dataProfile.priceTypeData && language === LANGUAGES.EN &&
                            <NumberFormat
                                className='currency'
                                value={dataProfile.priceTypeData.valueEn}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'USD'}
                            />
                        }
                    </div>}

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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);