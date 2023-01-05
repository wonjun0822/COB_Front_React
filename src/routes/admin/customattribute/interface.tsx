import React, { useEffect, useState, useRef } from "react";

import api from "@/service/api";

import { DataGrid, Column, Selection, Lookup, HeaderFilter, Export } from 'devextreme-react/data-grid'
import { CheckBox } from 'devextreme-react/check-box';
import { SelectBox } from 'devextreme-react/select-box';
import { TextBox } from 'devextreme-react/text-box';

import { ICodeProps } from '../CustomAttribute';
import { CellPreparedEvent, ExportingEvent, FocusedRowChangedEvent, ToolbarPreparingEvent } from "devextreme/ui/data_grid";

import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';

import FileUpload from "@/components/FileUpload";

const Interface = (props: { dbType: ICodeProps[], usage: ICodeProps[], category: ICodeProps[] }) => {
    const [tableList, setTableList] = useState([]);
    const [tableColumnList, setTableColumnList] = useState([]);

    const [tableType, setTableType] = useState('DB');

    const [usage, setUsage] = useState();
    const [category, setCategory] = useState();
    const [tableName, setTableName] = useState('');

    const [disabled, setDisabled] = useState(false);

    const fileUpload = useRef<any>({});

    const gridInterface = useRef<DataGrid>(null);
    const gridInterfaceColumn = useRef<DataGrid>(null);

    useEffect(() => {
        selectInterfaceTable();
    }, [])

    function onCellPrepared(e: CellPreparedEvent) {
        if (e.rowType === "header") {
            e.cellElement.style.backgroundColor = '#B4D8E7';
            e.cellElement.style.textAlign = 'center';
            e.cellElement.style.verticalAlign = 'middle';
        }
    }

    function onFocusedRowChanged(e: FocusedRowChangedEvent) {
        if (e.row != undefined) {
            const data = e.row?.data;

            setUsage(data.Usage);
            setCategory(data.Category);
            setTableName(data.TableNm);

            selectInterfaceTableColumn(data.TableID);

            setTableType(data.Usage === 4701 ? 'DB' : 'Excel');

            setDisabled(true);
        }
    }

    function selectInterfaceTable() {
        api({
            method: 'post',
            url: '/admin/InterfaceTable',
        }).then((response) => {
            setTableList(JSON.parse(response.data.list));
        });
    }

    function selectInterfaceTableColumn(id: number) {
        api({
            method: 'post',
            url: '/admin/InterfaceTableColumn',
            params: {
                'tableID': id
            }
        }).then((response) => {
            setTableColumnList(JSON.parse(response.data.list));
        });
    }

    function onToolbarPreparing(e: ToolbarPreparingEvent) {
        e.toolbarOptions.visible = false;
    }

    function newInterfaceTable() {
        gridInterface.current?.instance.option('focusedRowIndex', -1);

        setUsage(undefined);
        setCategory(undefined);
        setTableName('');

        setDisabled(false);

        setTableColumnList([]);

        fileUpload.current?.resetFile();
    }

    function saveInterfaceTableColumn() {
        const files = fileUpload.current?.uploadFileList();

        if (usage === undefined) {
            alert('Usage를 선택해주세요.');
    
            return;
        }
    
        else if (category === undefined) {
            alert('Category를 선택해주세요.');
    
            return;
        }
    
        else if (tableName.trim().length === 0) {
            alert('Table Name을 입력해주세요.');
    
            return;
        }

        else if (fileUpload.current?.uploadFileList().length === 0) {
            alert('Upload 하실 Excel File 을 선택해주세요.');

            return;
        }

        else {
            const formData = new FormData();

            formData.append("Usage", usage);
            formData.append("Category", category);
            formData.append("TableName", tableName);
            formData.append("file", fileUpload.current?.uploadFileList()[0]);

            api({
                method: 'post',
                url: '/admin/createInterfaceTable',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            }).then((response) => {
                console.log(response);
            });
        }
    }

    function exportInterfaceTableColumn() {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('sheet1');

        exportDataGrid({
            component: gridInterfaceColumn.current?.instance,
            worksheet,
            customizeCell: ({ gridCell, excelCell }) => {
                if (gridCell?.rowType == 'header') {
                    excelCell.alignment = { horizontal: 'center', vertical: 'middle' };
                    excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FCE4D6' } };
                }

                else if (gridCell?.rowType == 'data') {
                    excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E4E7EA' } };
                }

                excelCell.font = { size: 10 };
                excelCell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }
        }).then(() => {
            let fileName = '';

            if (tableType === 'Excel') {
                worksheet.columns = [
                    { width: 26 },
                    { width: 28 },
                    { width: 16 },
                    { width: 25 }
                ];

                fileName = 'Custom_Attribute_Excel_Table.xlsx';
            }

            else {
                worksheet.columns = [
                    { width: 26 },
                    { width: 28 },
                    { width: 11 },
                    { width: 16 },
                    { width: 28 },
                    { width: 10 },
                ];

                fileName = 'Custom_Attribute_Table.xlsx';
            }

            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName);
            });
        });
    }

    return (
        <>
            <div style={{ float: "left", width: "44%" }}>
                <div className="panel-heading">
                    <h3 className="panel-title">Table List</h3>
                </div>

                <div className="panel-body">
                    <div style={{ height: "40px" }}>
                        <div className="left">
                            <p style={{ fontWeight: '700', fontSize: '12px', margin: '7px 0px 0px 0px', display: 'inline-block' }}>* Custom Attribute 사용</p>
                            <CheckBox id="selectOption" style={{ marginLeft: '5px', top: '-1px', position: 'relative', display: 'inline-block' }}></CheckBox>
                        </div>

                        <div className="right">
                            <div className="btn btn-primary btn-sm" onClick={newInterfaceTable}>New</div>
                            <div className="btn btn-primary btn-sm">Delete</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '7px' }}>
                        <DataGrid 
                            ref={gridInterface}
                            id="gridInterface" 
                            style={{ height: '67vh' }} 
                            dataSource={tableList} 
                            keyExpr='TableID' 
                            focusedRowEnabled={true} 
                            showBorders={true} 
                            showColumnLines={true}
                            allowColumnResizing={true}
                            columnResizingMode='widget'
                            scrolling={{
                                mode: "virtual",
                                columnRenderingMode: 'standard',
                                rowRenderingMode: 'virtual',
                                showScrollbar: 'always'
                            }}
                            onCellPrepared={onCellPrepared}
                            onFocusedRowChanged={onFocusedRowChanged}
                        >
                            <HeaderFilter visible={true} />
                            <Selection mode="multiple" selectAllMode={'page'} showCheckBoxesMode={'always'}></Selection>
                            <Column dataField="TableID" visible={false}></Column>
                            <Column dataField="Usage" caption="Usage" width={100}>
                                <Lookup dataSource={props.usage} displayExpr='Name' valueExpr='ID'></Lookup>
                            </Column>
                            <Column dataField="Category" caption="Category" width={140}>
                                <Lookup dataSource={props.category} displayExpr='Name' valueExpr='ID'></Lookup>
                            </Column>
                            <Column dataField="TableNm" caption="Table Name"></Column>
                            <Column dataField="UpdateId" caption="Update By" width={100}></Column>
                            <Column dataField="UpdateDt" caption="Update Date" width={120}></Column>
                        </DataGrid>
                    </div>
                </div>
            </div>

            <div style={{ float: 'right', width: '55%' }}>
                <div className="panel-heading">
                    <h3 className="panel-title">Table Management</h3>
                </div>

                <div className="panel-body">
                    <div style={{ height: '40px' }}>
                        <div className="left">
                            <div className="btn btn-primary btn-sm">DB Interface Form Download</div>
                            <div className="btn btn-primary btn-sm">Excel Upload Form Download</div>
                        </div>

                        <div className="right">
                            <div className="btn btn-primary btn-sm" onClick={saveInterfaceTableColumn}>Save</div>
                            <div className="btn btn-primary btn-sm" onClick={exportInterfaceTableColumn}>Export</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '7px' }}>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr style={{ height: '40px' }}>
                                    <td style={{ width: '12%', fontWeight: '700' }}>Usage
                                    </td>
                                    <td style={{ width: '35%' }}>
                                        <SelectBox dataSource={props.usage} displayExpr="Name" valueExpr="ID" value={usage} disabled={disabled} onValueChanged={(e) => { setUsage(e.value) }} />
                                    </td>

                                    <td style={{ width: '12%', fontWeight: '700', paddingLeft: '7px' }}>Category
                                    </td>
                                    <td style={{ width: '35%' }}>
                                        <SelectBox dataSource={props.category} displayExpr="Name" valueExpr="ID" value={category} disabled={disabled} onValueChanged={(e) => { setCategory(e.value) }} />
                                    </td>
                                </tr>

                                <tr style={{ height: '40px' }}>
                                    <td style={{ width: '15%', fontWeight: '700' }}>Table Name
                                    </td>
                                    <td colSpan={3}>
                                        <TextBox value={tableName} disabled={disabled} onValueChanged={(e) => { setTableName(e.value) }}/>
                                    </td>
                                </tr>

                                <tr style={{ height: '40px' }}>
                                    <td colSpan={4}>
                                        <FileUpload ref={fileUpload} multiple={true} acceptList={['.xlsx']} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '7px' }}>
                        <DataGrid 
                            ref={gridInterfaceColumn}
                            id="gridInterfaceColumn" 
                            style={{ height: '52vh' }} 
                            dataSource={tableColumnList} 
                            keyExpr='Seq' 
                            focusedRowEnabled={true} 
                            showBorders={true} 
                            showColumnLines={true}
                            allowColumnResizing={true}
                            columnResizingMode='widget'
                            scrolling={{
                                mode: "virtual",
                                columnRenderingMode: 'standard',
                                rowRenderingMode: 'virtual',
                                showScrollbar: 'always'
                            }}
                            onToolbarPreparing={onToolbarPreparing}
                            onCellPrepared={onCellPrepared}
                        >
                            <Selection mode="single"></Selection>
                            <Column dataField="TableID" visible={false}></Column>
                            <Column dataField="Seq" visible={false}></Column>
                            <Column dataField="TableNm" caption="Table" width={'30%'}></Column>
                            <Column dataField="ColNm" caption="Column" width={'30%'}></Column>
                            <Column dataField="PK" caption="PK" visible={tableType === 'DB' ? true : false} width={60} alignment='center'></Column>
                            <Column dataField="DataType" caption="Type & Size" width={'20%'}></Column>
                            <Column dataField="ExcelColumn" caption="Excel Column" visible={tableType === 'DB' ? false : true} width={250}></Column>
                            <Column dataField="CalcColumn" caption="Calculation Column" visible={tableType === 'DB' ? true : false} width={250}></Column>
                            <Column dataField="ConChar" caption="연결문자" visible={tableType === 'DB' ? true : false} width={70}></Column>
                            <Export enabled={true}></Export>
                        </DataGrid>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Interface
