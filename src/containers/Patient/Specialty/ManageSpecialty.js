import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
import './ManageSpecialty.scss';
import { CommonUtils } from '../../../utils'
import { createNewSpeciatly } from '../../../services/userService';
import { toast } from 'react-toastify';
import { template } from 'lodash';

const mdParser = new MarkdownIt()

class ManageSpecialty extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: ''
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {  // à prevProps trức là props trước đó

    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state }
        // console.log('stateCopy: ', stateCopy)
        stateCopy[id] = event.target.value
        // console.log('event.target.value', event.target.value)
        // console.log('stateCopy lan 2: ', stateCopy)
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text
        })
        // console.log('handleEditorChange', { html, text })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files
        let file = data[0]
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            this.setState({
                imageBase64: base64
            })
        }
    }

    handleSaveNewSpeciatly = async () => {
        let res = await createNewSpeciatly(this.state)
        if (res && res.errCode === 0) {
            toast.success('Create a new Speciatly succeed')
        } else {
            toast.error('Create a new Speciatly error')
        }
    }


    render() {
        return (
            <div className='manage-speciatly-container'>
                <div className='ms-title'>Quan lý chuyen khoa</div>
                <div className='add-new-speciatly row'>
                    <div className='col-6 form-group'>
                        <label>Ten chuyen khoa</label>
                        <input
                            className='form-control'
                            type="text"
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                            value={this.state.name}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Anh chuyen khoa</label>
                        <input
                            className='form-control'
                            type='file'
                            onChange={(event) => this.handleOnChangeImage(event)}
                        />
                    </div>
                    <div className='col-12'>
                        <MdEditor
                            style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className='button-save-speciatly' onClick={() => this.handleSaveNewSpeciatly()}>
                            save
                        </button>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);