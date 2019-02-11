import React, { Component } from 'react';
import { Upload, Icon, message, Modal } from 'antd';
import { userActions } from '../redux/actions/user';

function beforeUpload(file) {
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    message.error('You can only upload JPG/JPEG/PNG file!');
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
    return false
  }
  return true;
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class PhotoUploader extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: []
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
	}
	
  customRequest = ({ onSuccess, onError, file }) => {
      setTimeout(() => {
          onSuccess(null, file);
      }, 100);
    };

  handleChange = async (info) => {
		if (info.file.status === 'uploading')
			this.setState({ fileList: info.fileList })
		else if (info.file.status === 'done') {
			await getBase64(info.file.originFileObj, async imageUrl => {
        await this.setState({
          imageUrl,
          fileList: info.fileList,
          loading: false,
        })
        this.props.dispatch(userActions.signupPhoto(this.state.imageUrl))
      });
		}
		else if (info.file.status === 'removed')
			this.setState({ fileList: info.fileList })
  }
  
  handleRemove = async () => {
    this.props.dispatch(userActions.deletePhoto())
  }

  render() {
		const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          accept=".jpg,.jpeg,.png"
					customRequest={this.customRequest}
					beforeUpload={beforeUpload}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
export default PhotoUploader;