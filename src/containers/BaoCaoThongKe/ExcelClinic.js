import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions'

class ExcelClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    async componentDidMount() {
        document.title = 'Dữ liệu'
        document.getElementsByClassName('fas fa-database')[0].setAttribute("style", "color:brown;")
    }

    render() {
        console.log(this.props)
        return (
            <></>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExcelClinic);

