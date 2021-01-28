import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import "./BasicTable.scss";

class TextField extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            row: props.row,
            colIdx: props.colIdx,
            value: props.value,
            cellType: props.cellType,
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        // value가 다를경우만 render!
        if(nextState.value === this.state.value) {
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState){
        //props이 바뀌면 state update        

        if(prevProps.value != this.props.value) {
             this.setState({
                 value: this.props.value,
             })
         } 
    }

    onChange = (e) => {
        this.setState({
            value: e.target.value,
        })

        const {row, colIdx, value} = this.state;
        // update props data (row, col)
        if(typeof this.props.updateTableData!="undefined") {
            //console.log("field : ", row, colIdx, value);
            this.props.updateTableData(row, colIdx, e.target.value);
        }
    }

    render() {
        if(this.state.row === 0 && this.state.colIdx==='state1') {
            console.log("state : ", this.state.value);
        }
        return(
            <input type="text" className="tTxt2" value={this.state.value} onChange={this.onChange} />
        )
    }
}

class BasicMergeTable extends React.Component {
  constructor(props) {
    super(props);

    this.passRowColIdx = [];
    this.propsRows = []; // shouldComponentUpdate 비교용도
    this.tableData = [];

    this.state = {
      selectedIdx: 0,
      selectedCol: "",      
    };
  }

  componentDidMount() {

    this.tableData=[];
    this.props.rows.map((row, rowIdx) => {
        let rowData = {};
        this.props.refColumns.map((col, colIdx) => {                
            rowData[col.id] = row[col.id]
        })
        this.tableData.push(rowData);
    })

  }

  componentDidUpdate(prevProps, prevState){
      // rows props이 update 돼었을 경우 this.tableData 'update'
      if(JSON.stringify(prevProps.rows) != JSON.stringify(this.props.rows)) {        
        this.tableData=[];
        this.props.rows.map((row, rowIdx) => {
            let rowData = {};
            this.props.refColumns.map((col, colIdx) => {                
                rowData[col.id] = row[col.id]
            })
            this.tableData.push(rowData);
        })

      }

      // table data 요청이 있을경우 props에 데이터 전달
      if(this.props.getTableData===2) {
        if(typeof this.props.onGetTableData !="undefined") {
            this.props.onGetTableData(this.tableData);
        }
    }

  }

  componentWillUnmount() {
    console.log("basicmerge table unmount...");
  }

  updateTableData = (row, col, value) => {
    this.tableData[row][col] = value;
  }

  onRowClickHandler = (e, row) => {
    this.setState({
      selectedIdx: row
    });
    if (typeof this.props.onRowClickHandler == "undefined") return;

    this.props.onRowClickHandler(e, row);
  };

  onChangeTableData = (row, colKey, value, cellType) => {
    console.log("onChangeTableData : ", row, colKey, value, cellType);

    this.props.onChangeTableData(row, colKey, value, cellType);
  };

  getTableCellFormat = (cellType, value, rowIdx, colKey) => {
    // 지원포맷, text, checkbox
    // rowIdx, colIdx => event에 사용될 예정.

    const key = String(rowIdx) + String(colKey);
    if (cellType === "text") {
     

      return (
        <TextField 
            row={rowIdx}
            colIdx={colKey}
            value={value}
            cellType={cellType}
            updateTableData={this.updateTableData}
        />
      );
    } 
  };

  onTDClick = (e, row, colKey) => {
    this.setState({
      selectedCol: colKey
    });

    if (typeof this.props.onTDClickHandler != "undefined") {
      this.props.onTDClickHandler(row, colKey);
    }
  };  

  onMoveRow = (val, col) => {
    if (typeof this.props.onMoveRow != "undefined") {
      this.props.onMoveRow(val, col);
    }
  };

  onMoveCol = (val, col) => {
    if (typeof this.props.onMoveCol != "undefined") {
      this.props.onMoveCol(val, col);
    }
  };

  checkPassIndex = (r, c) => {
    let isPass = false;
    for (let data of this.passRowColIdx) {
      if (data.row === r && data.col === c) {
        isPass = true;
        break;
      }
    }

    return isPass;
  };

  render() {
    this.propsRows = JSON.parse(JSON.stringify(this.props.rows));

    let containerH = this.props.containerHeight;
    let containerSy = {};
    if (containerH === "auto") {
      //containerSy.maxHeight = "1350px";
      containerSy.height = "auto%";
    } else {
      containerSy.height = containerH;
    }

    this.passRowColIdx = [];

    for (let cols of this.props.columns) {
      for (let col of cols) {
        if (typeof col.rowSpan != "undefined") {
          let start, end;
          start = col.rowSpan.r + 1; // 자기자신은 제외
          end = col.rowSpan.r + col.rowSpan.count;

          for (start; start < end; start++) {
            let data = { row: start, col: col.rowSpan.c };
            this.passRowColIdx.push(data);

            // rowSpan, colSpan같이 있을경우
            if (typeof col.colSpan != "undefined") {
              let cStart, cEnd;
              cStart = col.colSpan.c + 1; // 자기자신은 제외
              cEnd = col.colSpan.c + col.rowSpan.count;
              for (cStart; cStart < cEnd; cStart++) {
                let data2 = { row: start, col: cStart };
                this.passRowColIdx.push(data2);
              }
            }
          }
        }
      }
    }

    let tableMinWidth = "100%";
    if (typeof this.props.tableMinWidth != "undefined") {
      tableMinWidth = this.props.tableMinWidth;
    }

    return (
      <div style={{ height: "100%" }}>
        <div className="tcontainer" style={containerSy}>
          <table
            className="tMergeTable tFixedHeader"
            style={{ minWidth: tableMinWidth }}
          >
            <thead
              className={clsx(
                this.props.headerVisible === true ? "theader" : "disnone"
              )}
            >
              {this.props.columns.map((cols, rowIdx) => {
                let colTRstyle = "ttr";
                if (
                  typeof this.props.colVisible != "undefined" &&
                  this.props.colVisible.length > 0
                ) {
                  if (this.props.colVisible[rowIdx] === 0) {
                    colTRstyle = "disnone";
                  }
                }

                return (
                  <tr className={colTRstyle} key={rowIdx}>
                    {cols.map((col, colIdx) => {
                      let colStyle = col.width;
                      if (col.width === "auto") {
                        colStyle = "";
                      }

                      let rSpan = 1;
                      let cSpan = 1;
                      if (typeof col.rowSpan != "undefined") {
                        rSpan = col.rowSpan.count;
                      }
                      if (typeof col.colSpan != "undefined") {
                        cSpan = col.colSpan.count;
                      }

                      const key = String(col.id) + String(rowIdx);

                      if (!this.checkPassIndex(rowIdx, colIdx)) {
                        return (
                          <th
                            className={clsx(
                              this.props.cellSmall === true
                                ? "cellNormalSize"
                                : "",
                              "theader tth"
                            )}
                            style={{ width: colStyle }}
                            key={key}
                            rowSpan={rSpan}
                            colSpan={cSpan}
                          >
                            <span key={key}>{col.text} </span>
                          </th>
                        );
                      }
                    })}
                  </tr>
                );
              })}
            </thead>
          </table>
          <table className="tMergeTable" style={{ minWidth: tableMinWidth }}>
            <tbody className="ttbody">
              {this.props.rows.map((row, rowIdx) => {
                //if(this.props.colorFocusRows[])

                return (
                  <tr
                    id={rowIdx}
                    className={clsx(
                      "ttr",
                      this.props.selectedIdx === rowIdx ? "ttr-selected" : "",
                      this.props.colorFocusRows[rowIdx] === 1 ? "eopColor" : ""
                    )}
                    style={{
                      background:
                        this.props.colorFocusRows2[rowIdx] === 1
                          ? this.props.highlightBgColor
                          : ""
                    }}
                    onClick={(e) => this.onRowClickHandler(e, rowIdx)}
                    key={rowIdx}
                  >
                    {this.props.refColumns.map((col, colIdx) => {
                      const value = row[col.id];
                      const colType = col.type;
                      const key = String(col.id) + String(rowIdx);
                      let colStyle = col.width;
                      if (col.width === "auto") {
                        colStyle = "";
                      }

                      //-----------------------------------------------------
                      //Check Row Span
                      //-----------------------------------------------------
                      let rSpan = 1;
                      let isTDrender = true;
                      let lastRspanIdx = 0;

                      if (typeof col.rowMerge != "undefined") {
                        for (let idxData of col.rowMergeIndex) {
                          lastRspanIdx = idxData[1];
                          if (idxData[0] === rowIdx) {
                            rSpan = idxData[1] - idxData[0] + 1;
                            isTDrender = true; // rowspan 처음 인덱스 render
                            break;
                          } else {
                            isTDrender = false;
                          }
                        }
                      }

                      // 마지막 merge row가 td rowindex보다 작을경우는 td render
                      if (lastRspanIdx < rowIdx) {
                        isTDrender = true;
                      }

                      if (isTDrender) {
                        return (
                          <td
                            className={clsx(
                              this.props.cellSmall === true
                                ? "cellSmall"
                                : "cellNormalSize",
                              "ttd ttdBorder",
                              this.props.selectedCol === col.id
                                ? "td-selected"
                                : "",
                              col.type === "col" ? "colBgColor" : ""
                            )}
                            style={{ width: colStyle }}
                            key={key}
                            rowSpan={rSpan}
                            onClick={(e) => this.onTDClick(e, rowIdx, col.id)}                            
                          >
                            <span
                              className="spanCenter"
                              style={{ width: "100%" }}
                              key={key}
                            >
                              {this.getTableCellFormat(
                                colType,
                                value,
                                rowIdx,
                                col.id
                              )}
                            </span>
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

BasicMergeTable.propTypes = {
  columns: PropTypes.array.isRequired,
  refColumns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  colorFocusRows: PropTypes.array, // data record background color array
  colorFocusRows2: PropTypes.array, // data record background color array
  highlightBgColor: PropTypes.string, // highlight background color

  headerVisible: PropTypes.bool,
  containerHeight: PropTypes.string.isRequired,
  tableMinWidth: PropTypes.string.isRequired, // table min-width (min-width 이하로 줄어들경우 스크롤)
  selectedIdx: PropTypes.number,
  cellSmall: PropTypes.bool,

  onChangeTableData: PropTypes.func,
  onRowClickHandler: PropTypes.func,
  onTDClick: PropTypes.func
};

BasicMergeTable.defaultProps = {
  columns: [],
  refColumns: [], // row data reference column
  rows: [],
  colorFocusRows: [],
  colorFocusRows2: [],
  highlightBgColor: "#b36d6d", // default highlight bg color
  headerVisible: true,
  containerHeight: "500px",
  tableMinWidth: "100%",
  selectedIdx: 0, // selected row index, default : 0
  cellSmall: false
  // onChangeTableData: PropTypes.func.isRequired, // parameter : => (row, colKey, value, cellType)
  // onRowClickHandler: PropTypes.func.isRequired, // parameter : => (e, row)
  // onTDClick: PropTypes.func.isRequired, // parameter : => (row, col)
};
export default BasicMergeTable;
