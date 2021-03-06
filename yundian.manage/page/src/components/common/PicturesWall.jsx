import React from "react";
import {Upload, Icon, Modal, message} from "antd";

/**
 * 组件输入参数：
 * 1.length 支持上传图片数，例如：1，2，3等
 * 2.maxFileSize 最大上传文件大小，单位：m
 * 3.value (upload组件的fileList数组)
 * [{
 *     uid: -1,
 *     name: 'xxx.png',
 *     status: 'done',
 *     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
 *}]
 * 4.onChange:组件上传状态变更的事件，参数是fileList({name, url: response.data, uid, status})
 */

class PicturesWall extends React.Component {

    state = {
        previewVisible: false,
        previewImage: '',
        length: this.props.length,
        maxFileSize: this.props.maxFileSize ? this.props.maxFileSize : 2,
        fileList: this.props.value instanceof Array ? this.props.value : [],

        action: "//jsonplaceholder.typicode.com/posts/",
        imageHead: "http://",
    };

    /**
     * 关闭预览
     */

    handleCancel = () => {
        this.setState({previewVisible: false});
    };

    /**
     * 查看预览
     * @param file
     */

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    /**
     * 处理图片更新
     * @param e
     */

    handleChange = (e) => {
        let fileList = this.handleUpload(e);
        this.props.onChange(fileList);
    };

    /**
     * 处理更新
     * @param e
     * @returns {*}
     */

    handleUpload = (e) => {
        //再进行实际筛选，其实上面那一行没有用
        let fileList = e.fileList.map(file => {
            if (file.response) {
                //这个地方是上传结束之后会调用的方法，这边是判断success!!!
                if (file.response.success) {
                    return this.filter(file);
                }
            }
            return file;
        });
        this.setState({fileList: fileList});
        return fileList;
    };

    /**
     * 过滤服务器返回的数据
     * @param file
     */

    filter = (file) => {
        const {name, response, uid, status} = file;
        return {name, url: response.data, uid, status};
    };

    /**
     * 上传之前的验证
     */

    beforeUpload = (file) => {
        const maxFileSize = this.state.maxFileSize;
        if (maxFileSize) {
            const isLtMax = file.size / 1024 / 1024 < maxFileSize;
            if (!isLtMax) {
                message.error(`文件大小超过${maxFileSize}M限制`);
            }
            return isLtMax;
        }
    };

    render() {
        const {previewVisible, previewImage} = this.state;
        let fileList = this.state.fileList;
        // if (fileList.length > 0) {
        //     fileList.map((file, i) => {
        //
        //         if (!common.startsWith(file.url, 'http://')) {
        //             file.url = `${this.state.imageHead}${file.url}`;
        //         }
        //     });
        // }

        //一共有多少个图片
        const uploadButton = fileList.length >= this.props.length ? null : (
            <div>
                <Icon type="plus"/>
            </div>
        );

      console.log("获取：this.props.value:"+this.props.value);
      console.log("获取：this.props.length:"+this.props.length);
      console.log("获取：this.props.maxFileSize:"+this.props.maxFileSize);
        // showUploadList={false} 加了就显示不了
        const props = {
            action: this.state.action,
            fileList: fileList,
            // data: {
            // },
            headers: {'X-Requested-With': null},
            // accept: "image/*",
            accept: "image/jpg,image/jpeg,image/png,image/bmp",
            onChange: this.handleChange,
            beforeUpload: this.beforeUpload,
            onPreview: this.handlePreview,
            listType: "picture-card",
        };

        return (
            <div className="clearfix">
                <Upload {...props}>
                    {fileList.length >= this.state.length ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );

    }
}

export default PicturesWall;
