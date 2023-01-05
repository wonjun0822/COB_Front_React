import { useImperativeHandle, useRef, useState, forwardRef } from "react";

const FileUpload = forwardRef((props: { multiple: boolean, acceptList: string[] }, ref) => {
    const file = useRef<HTMLInputElement>(null)

    const [uploadFiles, setUploadFiles] = useState<File[]>([]);

    useImperativeHandle(ref, () => ({
        uploadFileList,
        resetFile
    }))

    const uploadFileList = () => {
        return uploadFiles;
    }

    const resetFile = () => {
        setUploadFiles([]);
    }

    const onClick = () => {
        file.current?.click();
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files) {
            if (Array.from(e.currentTarget.files).filter((f) => !file.current?.accept.includes('.' + f.name.split('.')[1])).length > 0) {
                alert('Only ' + props.acceptList.join(' ') + ' file can be uploaded.');

                return false;
            }

            else {
                if (props.multiple) {
                    setUploadFiles([...e.currentTarget.files]);
                }

                else {
                    setUploadFiles([e.currentTarget.files[0]]);
                }

                e.currentTarget.value = '';
            }
        }
    }

    const deleteFile = (file: File) => {
        setUploadFiles([]);

        if (props.multiple) {
            const dataTranster = new DataTransfer();

            Array.from(uploadFiles ? uploadFiles : []).filter(f => f != file).forEach(f => dataTranster.items.add(f));

            setUploadFiles([...dataTranster.files]);
        }
    }

    return (
        <>
            <div className="dx-fileuploader-wrapper">
                <div className="dx-fileuploader-container">
                    <div className="dx-fileuploader-content">
                        <div className="dx-fileuploader-input-wrapper">
                            <div className="dx-fileuploader-button dx-button dx-button-normal dx-button-mode-contained dx-widget dx-button-has-text" aria-label="Select Files" role="button">
                                <div className="dx-button-content">
                                    <span className="dx-button-text" onClick={onClick}>Select Files</span>
                                </div>
                            </div>

                            <div className="dx-fileuploader-input-container">
                                <input type="file" ref={file} accept={props.acceptList.join(',')} className="dx-fileuploader-input" multiple={props.multiple} onChange={onChange} />
                            </div>
                        </div>

                        <div className="dx-fileuploader-files-container">
                            {Array.from(uploadFiles ? uploadFiles : []).map((file, index) => {
                                return (
                                    <div className="dx-fileuploader-file-container" key={index}>
                                        <div className="dx-fileuploader-button-container">
                                            <div className="dx-fileuploader-button dx-fileuploader-cancel-button dx-button dx-button-normal dx-button-mode-contained dx-widget dx-button-has-icon" style={{ border: '0px' }}>
                                                <div className="dx-button-content">
                                                    <i className="dx-icon dx-icon-close" data-key="0" data-type="select" onClick={() => deleteFile(file)}></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="dx-fileuploader-file" style={{ paddingTop: '8px' }}>
                                            <div className="dx-fileuploader-file-info">
                                                <div className="dx-fileuploader-file-name">{file.name}</div>
                                                <div className="dx-fileuploader-file-size">{file.size} kb</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})

export default FileUpload;
