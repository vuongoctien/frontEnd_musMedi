import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';



class About extends Component {

    render() {


        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>
                    Truyền thông nói gì về musMedi
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="100%" height="400px" src="https://www.youtube.com/embed/FyDQljKtWnI" title="CÀ PHÊ KHỞI NGHIỆP VTV1 - BOOKINGCARE - HỆ THỐNG ĐẶT LỊCH KHÁM TRỰC TUYẾN" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                    <div className='content-right'>
                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis exercitationem atque veritatis qui neque earum minus dolorem obcaecati, nostrum ratione, eaque architecto reiciendis corrupti odit illum, ullam nam officiis quia ea sed. Iure beatae, quae et officia rerum natus dolorum consequuntur, dicta quaerat animi doloremque vero repudiandae. Autem, hic praesentium?
                        </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
