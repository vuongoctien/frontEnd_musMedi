import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './MedicalFacility.scss'
import { getAllClinic } from '../../../services/userService'
import { withRouter } from 'react-router';
import Slider from "react-slick"

class MedicalFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataClinics: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinic()
        if (res && res.errCode === 0) {
            this.setState({ dataClinics: res.data ? res.data : [] })
        }

    }

    // `detail-clinic/${clinic.id}`

    render() {
        let { dataClinics } = this.state
        return (
            <div>
                <div className='section-share section-medical-facility' >
                    <div className='section-container'>
                        <div className='section-header'>
                            <span className='title-section'>Cơ sở y tế</span>
                            <a href='/search-clinic' className='btn-section'>XEM THÊM</a>
                        </div>


                        <div className='section-body'>
                            <Slider {...this.props.settings}>
                                {dataClinics && dataClinics.length > 0
                                    && dataClinics.map((item, index) => {
                                        return (
                                            <div className='section-customize clinic-child' key={index} >
                                                <a href={`detail-clinic/${item.id}`}>
                                                    <div className='bg-image section-medical-facility' style={{ backgroundImage: `url(${item.image})` }}></div>
                                                    <div className='clinic-name'>{item.name}</div>
                                                </a>
                                            </div>
                                        )
                                    })}



                            </Slider>
                        </div>


                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
