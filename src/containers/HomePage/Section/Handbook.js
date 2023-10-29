import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getTopMediPackageHomeServices } from '../../../services/userService';
import Slider from "react-slick"



class Handbook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allMediPackage: []
        }
    }
    async componentDidMount() {
        let res = await getTopMediPackageHomeServices(100)
        if (res && res.errCode === 0) {
            this.setState({ allMediPackage: res.data ? res.data : [] })
        }
    }

    render() {

        return (
            <div className='section-share section-handbook' >
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Dịch vụ hàng đầu</span>
                        <button className='btn-section'>XEM THÊM</button>
                    </div>


                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {this.state.allMediPackage && this.state.allMediPackage.length > 0
                                && this.state.allMediPackage.map((item, index) => {
                                    return (
                                        <div className='section-customize clinic-child' key={index} >
                                            <a href={`detail-medipackage/${item.clinicID}&${item.id}`}>
                                                <div className='bg-image' style={{ backgroundImage: `url(${new Buffer(item.image, 'base64').toString('binary')})` }}></div>
                                                <div className='clinic-name'>{item.name}</div>
                                            </a>
                                        </div>
                                    )
                                })}
                        </Slider>
                    </div>


                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Handbook);
