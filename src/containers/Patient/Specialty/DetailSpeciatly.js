import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './DetailSpeciatly.scss';
import HomeHeader from "../../HomePage/HomeHeader"
import { getSpecDr, getDetailSpecialtyById } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import HomeFooter from '../../HomePage/Section/HomeFooter';
import BacSi_TaiSuDung from '../Doctor/BacSi_TaiSuDung';
import GoiDichVu_TaiSuDung from '../Doctor/GoiDichVu_TaiSuDung';


class DetailSpeciatly extends Component {

    constructor(props) {
        super(props)
        this.state = {
            thisSpeciatly: {},
            listDr: [],
            showAll: false
        }
    }

    async componentDidMount() {
        let res = await getDetailSpecialtyById(this.props.match.params.id)
        if (res && res.errCode === 0) {
            this.setState({ thisSpeciatly: res.data })
        }

        let res2 = await getSpecDr({
            specialtyID: this.props.match.params.id,
            dr_or_pk_ID: ''
        })
        if (res2 && res2.errCode === 0) {
            this.setState({ listDr: res2.data })
        }
    }

    render() {
        console.log('this.state', this.state)
        let batdongbo = ''
        if (this.state.thisSpeciatly.image) batdongbo = new Buffer(this.state.thisSpeciatly.image, 'base64').toString('binary')
        return (<><HomeHeader />
            <div className='detail-speciatly-container'>
                <div className='detail-speciatly-head'>
                    <div className='speciatly-img'
                        style={{ backgroundImage: `url(${batdongbo})` }}></div>
                    <div className='speciatly-info'>
                        <h1>{this.state.thisSpeciatly.name}</h1>
                        <div style={{ display: 'flex' }}>
                            <div><label className='more'
                                onClick={() => { this.setState({ showAll: !this.state.showAll }) }}
                                dangerouslySetInnerHTML={{ __html: this.state.showAll === false ? 'Xem<br/>thêm' : 'Ẩn<br/>bớt' }}>
                            </label></div>
                            <div className='descriptionHTML' style={{
                                height: `${this.state.showAll === false ? '100px' : 'auto'}`,
                                color: `${this.state.showAll === false ? 'gainsboro' : 'black'}`
                            }}
                                dangerouslySetInnerHTML={{ __html: this.state.thisSpeciatly.descriptionHTML }}></div>
                        </div>
                    </div>
                </div>
                <div className='detail-speciatly-boby'>
                    <div className='list'>
                        <div className='titlelistdoctor'>
                            <div className='h1'>
                                <h1>Danh sách bác sĩ&nbsp;<i className="fas fa-level-down-alt"></i></h1>
                            </div>

                        </div>
                        {this.state.listDr.length === 0 ?
                            <label className='label'>Danh sách trống</label> : <></>}
                        {this.state.listDr && this.state.listDr.filter(bs => bs.doctorData2.dr_or_pk === 1).map((item, index) => {
                            return (<BacSi_TaiSuDung
                                // thử truyền cả cục data xem:
                                doctorInfo={item.doctorData2}
                                clinicInfo={item.doctorData2.clinicData}
                            />)
                        })}
                    </div>
                    <div className='list'>
                        <div className='titlelistdoctor'>
                            <div className='h1'>
                                <h1>Các gói dịch vụ&nbsp;<i className="fas fa-level-down-alt"></i></h1>
                            </div>
                        </div>
                        {this.state.listDr.length === 0 ?
                            <label className='label'>Danh sách trống</label> : <></>}
                        {this.state.listDr && this.state.listDr.filter(bs => bs.doctorData2.dr_or_pk !== 1).map((item, index) => {
                            return (<GoiDichVu_TaiSuDung
                                // thử truyền cả cục data xem:
                                medipackageInfo={item.doctorData2}
                                clinicInfo={item.doctorData2.clinicData}
                            />)
                        })}
                    </div>
                </div>
            </div>
            <HomeFooter /></>
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