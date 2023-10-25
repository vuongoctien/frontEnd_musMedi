import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss'
import { getDetailInfoDoctor, getDoctorByIdClinicAndIdDoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtrainfor from './DoctorExtrainfor';

class DetailDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            doctorData: {},
            currentDoctorId: -1
        }
    }

    async componentDidMount() {
        let res = await getDoctorByIdClinicAndIdDoctor({
            doctorID: this.props.match.params.doctorID,
            clinicID: this.props.match.params.clinicID
        })
        this.setState({ doctorData: res.doctorData })
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {

        return (
            <>
                <HomeHeader isShowBaner={false} />
                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div className='content-left' style={{ backgroundImage: `url(${this.state.doctorData.image})` }}>

                        </div>
                        <div className='content-right'>
                            <div className='up'>
                                <h5>{this.state.doctorData.position}</h5>
                                <h3>{this.state.doctorData.name}</h3>

                            </div>
                            <div className='down'>
                                <textarea
                                    rows='6'
                                    cols='120'
                                    value={this.state.doctorData.intro}
                                    disabled
                                ></textarea>

                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'></div>
                        <div className='content-right'></div>
                    </div>
                    <div className='detail-info-doctor'>
                        <div dangerouslySetInnerHTML={{ __html: this.state.doctorData.descriptionHTML }} />

                    </div>
                    <div className='comment-doctor'>

                    </div>
                </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    // return {

    // };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
