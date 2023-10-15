import React, { Component } from 'react';
import { connect } from 'react-redux';
import ManageSpecialty from '../../containers/Patient/Specialty/ManageSpecialty'
import ManageClinic from '../../containers/System/Clinic/ManageClinic'
import ManageClinic_2 from '../../containers/System/Clinic/ManageClinic_2'
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';

class Draft extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }



    render() {



        return (
            <>DDaya laf component nhaps</>
        )


    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Draft);
