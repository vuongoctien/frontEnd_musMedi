import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';
import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';
import { path } from '../utils'
import Home from '../routes/Home';
import Login from './Auth/Login';
import AdLogin from './Auth/AdLogin';
import System from '../routes/System';
import { CustomToastCloseButton } from '../components/CustomToast';
import HomePage from './HomePage/HomePage.js'
import CustomScrollbars from '../components/CustomScrollbars';
import DetailDoctor from './Patient/Doctor/DetailDoctor';
import DetailMediPackage from './Patient/Doctor/DetailMediPackage';
import Doctor from '../routes/Doctor'
import VerifiEmail from './Patient/VerifiEmail' // và nhớ import vào
import DetailSpeciatly from './Patient/Specialty/DetailSpeciatly';
import DetailClinic from './System/Clinic/DetailClinic';
import SearchClinic from './Search/SearchClinic.js';
import ListChuyenKhoa from './Search/ListChuyenKhoa.js';
import SearchPackage from './Search/SearchPackage.js';
import SearchDoctor from './Search/SearchDoctor.js';

class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <div className="content-container">
                            <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                                <Switch>
                                    <Route path={path.HOME} exact component={(Home)} />
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                                    <Route path={'/doctor/'} component={userIsAuthenticated(Doctor)} />

                                    <Route path={path.HOMEPAGE} component={HomePage} />
                                    <Route path={`/detail-doctor/:clinicID&:doctorID`} component={DetailDoctor} />
                                    <Route path={`/detail-medipackage/:clinicID&:medipackageID`} component={DetailMediPackage} />
                                    <Route path={path.VERIFY_EMAIL_BOOKING} component={VerifiEmail} />
                                    <Route path={path.DETAIL_SPECIATLY} component={DetailSpeciatly} />
                                    <Route path={path.DETAIL_CLINIC} component={DetailClinic} />

                                    <Route path={'/search-clinic'} component={SearchClinic} />
                                    <Route path={'/list-specialty'} component={ListChuyenKhoa} />
                                    <Route path={'/search-package'} component={SearchPackage} />
                                    <Route path={'/search-doctor'} component={SearchDoctor} />

                                    <Route path={'/adLogin'} component={AdLogin} />
                                    {/* Đây là component tổ tiên*/}
                                </Switch>
                            </CustomScrollbars>
                        </div>

                        {/* <ToastContainer
                            className="toast-container" toastClassName="toast-item" bodyClassName="toast-item-body"
                            autoClose={false} hideProgressBar={true} pauseOnHover={false}
                            pauseOnFocusLoss={true} closeOnClick={false} draggable={false}
                            closeButton={<CustomToastCloseButton />}
                        /> */}

                        <ToastContainer
                            position="bottom-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);