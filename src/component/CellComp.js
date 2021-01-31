import React from "react";
import "./BasicTable.scss";

export class Sg3TxtField extends React.Component {
    constructor(props) {
        super(props);
        this.valueArr = ["0", "0"];
        this.state = {
            row: props.row,
            colIdx: props.colIdx,
            cellType: props.cellType,
            value: props.value,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // value가 다를경우만 render!
        if(nextState.value === this.state.value) {
            return false;
        }
        return true;
    }

    onKeyDown = (e) => {
        console.log("onKeyDown(1)");
        if (e.key >= 0 && e.key <= 9) {
            // number
            let tempHighVal = this.valueArr[1];
            let lowVal = e.key;
            this.valueArr = [tempHighVal, lowVal];
    
            const {row, colIdx} = this.state;
            let hexVal = this.valueArr[0] + this.valueArr[1];
            let decVal = parseInt(hexVal, 16); 
            
            console.log('sg3 onKeyDown:', decVal);
            this.setState({
                value: decVal,
            })

            if(typeof this.props.updateTableData!="undefined") {
                this.props.updateTableData(row, colIdx, decVal);
            }
        }
    
        if (e.key === "w" || e.key === "W") {
            // up
            if (typeof this.props.onMoveRow != "undefined") {
                this.props.onMoveRow(-1, this.props.colKey);
            }
        } else if (e.key === "s" || e.key === "S") {
        // down
            if (typeof this.props.onMoveRow != "undefined") {
                this.props.onMoveRow(1, this.props.colKey);
            }
        } else if (e.key === "a") {
          // left
            if (typeof this.props.onMoveCol != "undefined") {
                this.props.onMoveCol(-1, this.props.colKey);
             }
        } else if (e.key === "d") {
          // right
            if (typeof this.props.onMoveCol != "undefined") {
                this.props.onMoveCol(1, this.props.colKey);
            }
        }
    }

    render() {
        console.log('sg3 render', this.state.value);
        let valueHex = "00";
        
        valueHex = this.state.value.toString(16).padStart(2, "0");
        
        let firCh = valueHex.substring(0, 1);
        let secCh = valueHex.substring(1, 2);
        let firBg = "";
        let secBg = "";

        if (firCh === "1" || firCh === "5")       firBg = "green 50%";
        else if (firCh === "2" || firCh === "3")  firBg = "yellow 50%";
        else if (firCh === "8")                   firBg = "gray 50%";
        else if (firCh === "0")                   firBg = "white 50%";
        

        if (secCh === "1" || secCh === "5")       secBg = "green 50%";
        else if (secCh === "2" || secCh === "3")  secBg = "yellow 50%";
        else if (secCh === "8")                   secBg = "gray 50%";
        else if (secCh === "0")                   secBg = "white 50%";
    
        return(
            <input
                ref={this.props.refVal}
                type="text"
                className="tTxt2"
                style={{ background: `linear-gradient(90deg, ${firBg}, ${secBg})` }}
                readOnly
                value={valueHex}
                onKeyDown={this.onKeyDown}
            />
        )
    }
}

export class ChkBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked,
            row: props.row,
            colIdx: props.colIdx,
            cellType: props.cellType,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // value가 다를경우만 render!
        if(nextState.checked === this.state.checked) {
            return false;
        }
        return true;
    }

    onChange = (e) => {
        this.setState({
            checked: e.target.checked,
        })

        const {row, colIdx} = this.state;
        if(typeof this.props.updateTableData!="undefined") {
            this.props.updateTableData(row, colIdx, e.target.checked);
        }
    }

    render() {
        return (
            <input type="checkbox" checked={this.state.checked} onChange={this.onChange} />
        )        
    }
}

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

export default TextField;