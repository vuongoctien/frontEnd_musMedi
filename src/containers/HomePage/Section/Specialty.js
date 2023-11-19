import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Specialty.scss'
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick"
import { getAllSpecialty } from '../../../services/userService';
import { withRouter } from 'react-router';
import { tronmangngaunhien } from '../../Search/bodauTiengViet';

class Specialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSpecialty: []
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty()
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            })
        }
    }

    // handleViewDetailSpeciatly = (item) => {
    //     if (this.props.history) {
    //         this.props.history.push(`/detail-speciatly/${item.id} `)
    //     }
    // }

    render() {
        let { dataSpecialty } = this.state

        return (
            <div className='section-share section-specialty' >
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Chuyên khoa</span>
                        <button className='btn-section'>XEM THÊM</button>
                    </div>


                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataSpecialty && dataSpecialty.length > 0
                                && tronmangngaunhien(dataSpecialty).map((item, index) => {
                                    return (
                                        <div className='section-customize section-child' key={index}>
                                            <a href={`/detail-speciatly/${item.id}`}>
                                                <div className='bg-image section-specialty' style={{ backgroundImage: `url(${item.image})` }}></div>
                                            </a>
                                            {/* // chỉ nhét ảnh vào thẻ a thôi, nếu cho cả text vào sẽ bị chuyển màu */}
                                            <div className='specialty-name'>{item.name}</div>
                                        </div>
                                    )
                                })}
                        </Slider>
                    </div>


                </div >
            </div >
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
// lại còn phải thêm withRouter vào mới được
