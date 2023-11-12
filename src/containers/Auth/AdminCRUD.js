import React, { Component } from 'react';
import { connect } from 'react-redux';
import './AdminCRUD.scss';
import ManageSpecialty from '../../containers/Patient/Specialty/ManageSpecialty'
import ManageClinic from '../System/Clinic/ManageClinic'
import ManageClinic_2 from '../System/Clinic/ManageClinic_2'
import AddClinic from '../System/Clinic/AddClinic';
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from "react-router-dom";
import ListDoctor from '../Auth/Doctor/ListDoctor'
import AddDoctor from '../Auth/Doctor/AddDoctor';
import AddMediPackage from '../Auth/Doctor/AddMediPackage'
import EditDoctor from '../Auth/Doctor/EditDoctor'

class AdminCRUD extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <Router>

                <Switch>
                    <Route path="/adLogin/admin/specialty" component={ManageSpecialty} />
                    <Route path="/adLogin/admin/clinicEditDelete" component={ManageClinic} />
                    <Route path="/adLogin/admin/clinicAdd" component={AddClinic} />
                    <Route path="/adLogin/admin/listClinic" component={ManageClinic_2} />
                    <Route path="/adLogin/admin/listDoctor/:clinicID&:clinicName" component={ListDoctor} />
                    <Route path="/adLogin/admin/addDoctor/:clinicID&:clinicName" component={AddDoctor} />
                    <Route path="/adLogin/admin/addMediPackage/:clinicID&:clinicName" component={AddMediPackage} />
                    <Route path="/adLogin/admin/editDoctor/:clinicID&:clinicName" component={EditDoctor} />
                </Switch>

            </Router>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminCRUD);
