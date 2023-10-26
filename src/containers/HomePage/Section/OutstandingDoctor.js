import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick"
import * as actions from "../../../store/actions"
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';

class OutstandingDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrDoctors: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors()
    }

    // handleViewDetailDoctor = (doctor) => {
    //     if (this.props.history) {
    //         this.props.history.push(`detail-doctor/${doctor.id}`)
    //     }
    //     // console.log('handleViewDetailDoctor doctor.id', doctor.id)
    //     // console.log('this.prop', this.props)
    // }

    render() {
        let arrDoctors = this.state.arrDoctors
        let { language } = this.props
        // arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors) // à để x3 ra thôi, mình k cần
        // console.log('arrDoctors', arrDoctors)

        return (
            <div>
                <div className='section-share section-outstanding-doctor' >
                    <div className='section-container'>
                        <div className='section-header'>
                            <span className='title-section'><FormattedMessage id="homepage.outstanding-doctor" /></span>
                            <button className='btn-section'><FormattedMessage id="homepage.more-info" /></button>
                        </div>


                        <div className='section-body'>
                            <Slider {...this.props.settings}>

                                {arrDoctors && arrDoctors.length > 0
                                    && arrDoctors.map((item, index) => {
                                        let imageBase64 = ''
                                        if (item.image) {
                                            imageBase64 = new Buffer(item.image, 'base64').toString('binary')
                                        }
                                        return (


                                            < div className='section-customize' key={index} >
                                                <div className='customize-border'>
                                                    <a href={`detail-doctor/${item.clinicID}&${item.id}`}>
                                                        <div className='outer-bg'>
                                                            <div className='bg-image section-outstanding-doctor' style={{ backgroundImage: `url(${imageBase64})` }}></div>
                                                        </div>
                                                    </a>
                                                    <div className='position text-center'>
                                                        <h6>{item.position}</h6>
                                                        <h5>{item.name}</h5>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}



                            </Slider>
                        </div>


                    </div>
                </div >
            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor)) 