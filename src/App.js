import React from "react";
import BasicMergeTable from "./component/BasicMergeTable";
import "./App.scss";

function createRow(id, name, text, chkB) {
  return id, name, text, chkB;
}
const column1 = [
  {id: "ppc",  text: "PPC제어", type: "value", width: "10%", rowSpan: { r: 0, c: 0, count: 2 }},
  {id: "state",text: "상태", type: "value", width: "24%", rowSpan: { r: 0, c: 1, count: 2 }, colSpan: { r: 0, c: 1, count: 2 }},
  {id: "aring",text: "A링", type: "value", width: "36%", colSpan: { r: 0, c: 3, count: 3 }},
  {id: "bring",text: "B링", type: "value", width: "150px",colSpan: { r: 0, c: 6, count: 3 }},
  {id: "chk",text: "chk", type: "checkbox", width: "50px",}
];
const column2 = [
  { id: "ppc", text: "1", type: "text", width: "10%" },

  { id: "state1", text: "2", type: "text", width: "12%" },
  { id: "state2", text: "3", type: "text", width: "12%" },

  { id: "aHold", text: "A-Hold", type: "text", width: "12%" },
  { id: "aOff", text: "A-Off", type: "text", width: "12%" },
  { id: "aJmp", text: "A-Jmp", type: "text", width: "12%" },

  { id: "bHold", text: "B-Hold", type: "text", width: "50px" },
  { id: "bOff", text: "B-Off", type: "text", width: "50px" },
  { id: "bJmp", text: "B-Jmp", type: "sg3", width: "50px" },
  {id: "chk",text: "chk", type: "checkbox", width: "50px",}
];

const rows = [
  { ppc: "불가능1", state1: "Standby", state2: "긴급", aHold: "Hold", aOff: "Off", aJmp: "jmp", bHold: "Hold", bOff: "Off", bJmp: 1, chk: 1 },
  { ppc: "불가능1", state1: "Standby", state2: "긴급", aHold: "Hold", aOff: "Off", aJmp: "jmp", bHold: "Hold", bOff: "Off", bJmp: 1, chk: 0 },
  { ppc: "불가능1", state1: "Standby", state2: "긴급", aHold: "Hold", aOff: "Off", aJmp: "jmp", bHold: "Hold", bOff: "Off", bJmp: 1, chk: 0 },
  { ppc: "불가능1", state1: "Standby", state2: "긴급", aHold: "Hold", aOff: "Off", aJmp: "jmp", bHold: "Hold", bOff: "Off", bJmp: 1, chk: 1 },
  { ppc: "불가능1", state1: "Standby", state2: "긴급", aHold: "Hold", aOff: "Off", aJmp: "jmp", bHold: "Hold", bOff: "Off", bJmp: 0, chk: 1 },
  { ppc: "불가능1", state1: "Standby", state2: "긴급", aHold: "Hold", aOff: "Off", aJmp: "jmp", bHold: "Hold", bOff: "Off", bJmp: 4, chk: 0 },
  { ppc: "불가능1", state1: "Standby", state2: "긴급", aHold: "Hold", aOff: "Off", aJmp: "jmp", bHold: "Hold", bOff: "Off", bJmp: 2, chk: 0 },
  { ppc: "불가능1", state1: "Standby", state2: "긴급", aHold: "Hold", aOff: "Off", aJmp: "jmp", bHold: "Hold", bOff: "Off", bJmp: 5, chk: 1 },
  { ppc: "불가능1", state1: "Standby", state2: "긴급", aHold: "Hold", aOff: "Off", aJmp: "jmp", bHold: "Hold", bOff: "Off", bJmp: 8, chk: 0 },
 
];

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    selectedIdx: 0,
    rows: rows,
    getTableData: 1,    //1 ready, 2: get
  };

  onRowClickHandler = (e, row) => {
    this.setState({
      selectedIdx: row,      
    });
  };

  onChangeTableData = (row, colKey, value, cellType) => {
    console.log(
      "onChangeTableData(locallist) => ",
      row,
      colKey,
      value,
      cellType
    );
  };

  ButtonEvent = (e) => {
    this.setState({
      rows: this.state.rows.filter((item, index) => index > 5)
    })

  }

  ButtonEvent2 = (e) => {
    console.log("button2");
    this.setState({
      getTableData: 2,  // get data
    })

  }

  onGetTableData = (info) => {
    console.log("onGetTableData : ", info);
    this.setState({
      getTableData:1,
    })
  }

  render() {
    let column12 = [];
    column12[0] = column1;
    column12[1] = column2;

    return (
      <div>
        <button onClick={this.ButtonEvent}>
          test
        </button>
        <button onClick={this.ButtonEvent2}>
          get
        </button>
        <div style={{ height: "150px" }}>
          <BasicMergeTable
            columns={column12}
            refColumns={column2}
            rows={this.state.rows}
            headerVisible={true}
            containerHeight="100%"
            tableMinWidth="600px"
            selectedIdx={this.state.selectedIdx}
            onRowClickHandler={this.onRowClickHandler}
            onChangeTableData={this.onChangeTableData}
            onGetTableData={this.onGetTableData}
            getTableData={this.state.getTableData}
          />
        </div>
      </div>
    );
  }
}

export default App;
