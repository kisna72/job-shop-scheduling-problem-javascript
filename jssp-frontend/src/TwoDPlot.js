import React, { Component } from 'react';
import './App.css';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries, HorizontalGridLines, VerticalGridLines, XAxis, YAxis} from 'react-vis';

class TwoDPlot extends Component {
  render() {
    // Get props.data = [123,345,345,999 ...] from parent. 
    const data = this.props.data.map((val,idx)=>{
      return {
        x: idx,
        y: val
      }
    })

    return (
      <div className="twodplot">
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
