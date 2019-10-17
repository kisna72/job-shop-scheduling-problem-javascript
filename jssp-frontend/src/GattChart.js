import React from 'react';
import GanttMachineSchedule from './GanttMachineSchedule';
import GanttXTicks from './GanttXTicks';

// this.state =  {
//     schedule:this.props.schedule
//     // ? this.props.schedule :  [ [ 0, 1, 10, 1, 21, 30, 2, 131, 140, 3, 146, 165 ],
//     // [ 1, 1, 20, 0, 21, 40, 2, 41, 60, 3, 166, 180 ],
//     // [ 2, 1, 30, 1, 61, 110, 0, 111, 130, 3, 131, 145 ],
//     // [ 1, 31, 60, 3, 61, 90, 2, 91, 130, 0, 131, 170 ],
//     // [ 3, 1, 50, 2, 61, 72, 1, 111, 140, 0, 171, 180 ] ]
// }
const WATER_BOTTLING_WATER_MACHINES = [
    "Bottle Expansion Mold",
    "Water Cleaning/ Purifying",
    "Water Filling",
    "Bottle Capping",
    "Bottle Labeling"
]
class GanttChart extends React.Component {
    render(){
        console.log(this.props)
        const allEnds = this.props.schedule.map(schArr => schArr[schArr.length-1])
        console.log(allEnds)
        const maxTime = Math.max(...allEnds)
        return (
            <>
            <div className="ganttChartWithY">
                <div className="ganttChartYAxis">
                    {this.props.schedule.map( (sch,idx)=>{
                        const machineName = WATER_BOTTLING_WATER_MACHINES[idx]
                        return <span className="yAxisTick">{`${machineName} Machine`}</span>
                    })}

                </div>
                <div className="ganttChartData">
                    {this.props.schedule.map( (sch,idx) => 
                        <GanttMachineSchedule schedule={sch} maxTime={maxTime} index={idx}/>)}
                    <GanttXTicks index={this.props.schedule.length} maxTime={maxTime} />
                </div>
            </div>
            </>
        )
    }
}
export default GanttChart