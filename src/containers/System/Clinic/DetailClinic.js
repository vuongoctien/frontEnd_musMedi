import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './DetailClinic.scss';
import HomeHeader from "../../HomePage/HomeHeader"
import DoctorExtrainfor from "../../../containers/Patient/Doctor/DoctorExtrainfor"
import ProfileDoctor from "../../../containers/Patient/Doctor/ProfileDoctor"
import DoctorSchedule from '../../../containers/Patient/Doctor/DoctorSchedule';
import { getAllDetailClinicById, getAllDoctorByClinicId } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import BacSi_TaiSuDung from '../../Patient/Doctor/BacSi_TaiSuDung';


class DetailClinic extends Component {

    constructor(props) {
        super(props)
        this.state = {
            clinic: {},
            all_doctor_of_clinic: []
        }
    }

    async componentDidMount() {
        let res = await getAllDetailClinicById(this.props.match.params.id)
        if (res && res.errCode === 0) {
            this.setState({ clinic: res.data })
            document.title = `${this.state.clinic.name} | musMedi`
        }

        let res2 = await getAllDoctorByClinicId(this.props.match.params.id)
        if (res2 && res2.errCode === 0) {
            this.setState({ all_doctor_of_clinic: res2.all_doctor_of_clinic })
        }
    }


    render() {
        /**Một bài học lớn
         * Hàm render đếch đợi hàm Mount, bởi vậy hiện tượng bất đồng bộ xảy ra
         * khi render chưa kịp load ảnh => Buffer lỗi => toang
         * Chưa kịp có ảnh đã toang, mà toang là die luôn không chờ ảnh
         * Bởi vậy mới thấy, anh HoiDanIt quá kinh nghiệm rồi
         */
        let img = ''
        if (this.state.clinic.image) img = new Buffer(this.state.clinic.image, 'base64').toString('binary')

        return (
            <div className='detail-clinic-container'>
                <HomeHeader />
                <div className='detail-clinic-body'>
                    <div className='description-clinic'>
                        <div className='anh' style={{ backgroundImage: `url(${img})` }}>

                        </div>
                        <div className='ten-diachi'>
                            <h2>&nbsp;&nbsp;{this.state.clinic.name}</h2>
                            <h5>
                                &nbsp;&nbsp;<i className="fas fa-map-marker-alt"></i>&nbsp;
                                {this.state.clinic.address}
                            </h5>
                            <h5>
                                &nbsp;&nbsp;<i className="fas fa-location-arrow"></i>&nbsp;
                                {this.state.clinic.province}
                            </h5>
                        </div>
                        <div className='datlich'>
                            <p>ĐẶT LỊCH</p>
                            <i className="far fa-paper-plane"></i>
                        </div>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: this.state.clinic.descriptionHTML }} className='gioithieu'>

                    </div>
                </div>
                <div className='list'>
                    {this.state.all_doctor_of_clinic && this.state.all_doctor_of_clinic.map((item, index) => {
                        return (<BacSi_TaiSuDung
                            // thử truyền cả cục data xem:
                            doctorInfo={item}
                            clinicInfo={this.state.clinic}
                        />)
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);