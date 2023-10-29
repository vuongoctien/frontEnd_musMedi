import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './DetailClinic.scss';
import HomeHeader from "../../HomePage/HomeHeader"
import DoctorExtrainfor from "../../../containers/Patient/Doctor/DoctorExtrainfor"
import ProfileDoctor from "../../../containers/Patient/Doctor/ProfileDoctor"
import DoctorSchedule from '../../../containers/Patient/Doctor/DoctorSchedule';
import { getAllDetailClinicById, getAllDoctorByClinicId, getAllMediPackageByClinicId } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';
import BacSi_TaiSuDung from '../../Patient/Doctor/BacSi_TaiSuDung';
import GoiDichVu_TaiSuDung from '../../Patient/Doctor/GoiDichVu_TaiSuDung';
import HomeFooter from '../../HomePage/Section/HomeFooter';


class DetailClinic extends Component {

    constructor(props) {
        super(props)
        this.state = {
            clinic: {},
            all_doctor_of_clinic: [],
            all_mediPackage_of_clinic: [],
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

        let res3 = await getAllMediPackageByClinicId(this.props.match.params.id)
        if (res3 && res3.errCode === 0) {
            this.setState({ all_mediPackage_of_clinic: res3.all_mediPackage_of_clinic })
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
                            <h2>{this.state.clinic.name}</h2>
                            <h5>
                                <i className="fas fa-map-marker-alt"></i>&nbsp;
                                {this.state.clinic.address}
                            </h5>
                            <h5>
                                <i className="fas fa-location-arrow"></i>&nbsp;
                                {this.state.clinic.province}
                            </h5>
                        </div>
                        <div className='datlich'>
                            <a href='#danhsachbacsi'><p>ĐẶT LỊCH</p></a>
                            <i className="far fa-paper-plane"></i>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='row'>
                    <div className='col-1'></div>
                    <div
                        dangerouslySetInnerHTML={{ __html: this.state.clinic.descriptionHTML }}
                        className='gioithieu col-10'></div>
                </div>

                <hr />
                <div id='danhsachbacsi' className='list'>
                    <div className='titlelistdoctor'>
                        <div className='h1'>
                            <h1>Danh sách bác sĩ&nbsp;<i className="fas fa-level-down-alt"></i></h1>
                        </div>
                        <div className='jump'>
                            <p>Bấm vào <a href='#cacgoidichvu'>đây</a> để xem những gói dịch vụ y tế như khám sức khỏe, xét nghiệm, nội soi, v.v. </p>
                        </div>
                    </div>
                    {this.state.all_doctor_of_clinic.length === 0 ?
                        <label className='label'>Danh sách trống</label> : <></>}
                    {this.state.all_doctor_of_clinic && this.state.all_doctor_of_clinic.map((item, index) => {
                        return (<BacSi_TaiSuDung
                            // thử truyền cả cục data xem:
                            doctorInfo={item}
                            clinicInfo={this.state.clinic}
                        />)
                    })}
                </div>
                <hr />
                <div id='cacgoidichvu' className='list'>
                    <div className='titlelistdoctor'>
                        <div className='h1'>
                            <h1>Các gói dịch vụ&nbsp;<i className="fas fa-level-down-alt"></i></h1>
                        </div>
                    </div>
                    {this.state.all_mediPackage_of_clinic.length === 0 ?
                        <label className='label'>Danh sách trống</label> : <></>}
                    {this.state.all_mediPackage_of_clinic && this.state.all_mediPackage_of_clinic.map((item, index) => {
                        return (<GoiDichVu_TaiSuDung
                            // thử truyền cả cục data xem:
                            medipackageInfo={item}
                            clinicInfo={this.state.clinic}
                        />)
                    })}
                </div>
                <HomeFooter />
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