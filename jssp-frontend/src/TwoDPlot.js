import React, { Component } from 'react';
import './App.css';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries, HorizontalGridLines, VerticalGridLines, XAxis, YAxis} from 'react-vis';

class TwoDPlot extends Component {
  render() {
    console.log(this.props);
    // Get props.data = [123,345,345,999 ...] from parent. 
    const data = this.props.data.map((val,idx)=>{
      return {
        x: idx,
        y: val
      }
    })
    // const data = [
    //   {x: 0, y: 8},
    //   {x: 1, y: 5},
    //   {x: 2, y: 4},
    //   {x: 3, y: 9},
    //   {x: 4, y: 1},
    //   {x: 5, y: 7},
    //   {x: 6, y: 6},
    //   {x: 7, y: 3},
    //   {x: 8, y: 2},
    //   {x: 9, y: 0}
    // ];
    return (
      <div className="App">
        <div>
          <XYPlot height={this.props.height || 300} width={this.props.width || 300}>
            <LineSeries data={data} />
            <XAxis title="Number of Iterations" />
            <YAxis title="MakeSpan" />
            <VerticalGridLines />
            <HorizontalGridLines />
          </XYPlot>
        </div>
      </div>
    );
  }
}

export default TwoDPlot