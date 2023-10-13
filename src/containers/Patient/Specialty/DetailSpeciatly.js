import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './DetailSpeciatly.scss';
import HomeHeader from "../../HomePage/HomeHeader"
import DoctorExtrainfor from "../Doctor/DoctorExtrainfor"
import ProfileDoctor from "../Doctor/ProfileDoctor"
import DoctorSchedule from '../Doctor/DoctorSchedule';
import { getDetailSpecialtyById, getAllcodeService } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';


class DetailSpeciatly extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrDoctorId: [],
            dataDetailSpeciatly: {},
            listProvince: []
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            let res = await getDetailSpecialtyById({
                id: id,
                location: 'ALL'
            })

            let resProvince = await getAllcodeService('PROVINCE')

            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data
                let arrDoctorId = []
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorSpeciatly
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                // let dataProvince = resProvince.data
                // if (dataProvince & dataProvince.length > 0) {
                //     dataProvince.unshift({
                //         createAt: null,
                //         keyMap: 'ALL',
                //         type: 'PROVINCE',
                //         valueEn: 'ALL',
                //         valueVi: 'Toan quoc'
                //     })
                // } // 

                this.setState({
                    dataDetailSpeciatly: res.data,
                    arrDoctorId: arrDoctorId,
                    listProvince: resProvince.data
                    // listProvince: dataProvince ? dataProvince : []
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {  // à prevProps trức là props trước đó

    }

    handleOnChangeSelect = async (event) => { // thôi khỏi, thích thì mình tự làm sau
        // if (this.props.match && this.props.match.params && this.props.match.params.id) {
        //     let id = this.props.match.params.id
        //     let location = event.target.value
        //     let res = await getDetailSpecialtyById({
        //         id: id,
        //         location: location
        //     })

        //     if (res && res.errCode === 0) {
        //         let data = res.data
        //         let arrDoctorId = []
        //         if (data && !_.isEmpty(data)) {
        //             let arr = data.doctorSpeciatly
        //             if (arr && arr.length > 0) {
        //                 arr.map(item => {
        //                     arrDoctorId.push(item.doctorId)
        //                 })
        //             }
        //         }

        //         this.setState({
        //             dataDetailSpeciatly: res.data,
        //             arrDoctorId: arrDoctorId
        //         })
        //     }
        // }
    }

    render() {
        let { arrDoctorId, dataDetailSpeciatly, listProvince } = this.state
        let { language } = this.props
        console.log('this.state', this.state)
        return (
            <div className='detail-speciatly-container'>
                <HomeHeader />
                <div className='detail-speciatly-body'>
                    <div className='description-speciatly'>
                        {dataDetailSpeciatly && !_.isEmpty(dataDetailSpeciatly)
                            && <div dangerouslySetInnerHTML={{ __html: dataDetailSpeciatly.descriptionHTML }}></div>}
                    </div>
                    <div className='search-sp-doctor'>
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {listProvince && listProvince.length > 0
                                && listProvince.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </option>
                                    )
                                })}
                        </select>
                    </div>
                    {arrDoctorId && arrDoctorId.length > 0 && arrDoctorId.map((item, index) => {
                        return (
                            <div className='each-doctor'>
                                <div className='dt-content-left'>
                                    <div className='profile-doctor'>
                                        <ProfileDoctor
                                            doctorId={item}
                                            isShowDescriptionDoctor={true}
                                            isShowLinkDetail={true}
                                            isShowPrice={false}
                                        />
                                    </div>
                                </div>
                                <div className='dt-content-right'>
                                    <div className='doctor-schedule'>
                                        <DoctorSchedule
                                            doctorIdFromParent={item}
                                        />
                                    </div>
                                    <div className='doctor-extra-info'>
                                        <DoctorExtrainfor
                                            doctorIdFromParent={item}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpeciatly);