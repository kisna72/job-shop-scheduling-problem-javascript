import React from 'react';
import GanttMachineSchedule from './GanttMachineSchedule';
import GanttXTicks from './GanttXTicks';

const WATER_BOTTLING_WATER_MACHINES = [
    "Bottle Expansion Mold",
    "Water Cleaning/ Purifying",
    "Water Filling",
    "Bottle Capping",
    "Bottle Labeling",
    "Bottle Expansion Mold 2"
]
class GanttChart extends React.Component {
    render(){
        console.log(this.props)
        const allEnds = this.props.schedule.map(schArr => schArr[schArr.length-1])
        console.log(allEnds)
        const maxTime = Math.max(...allEnds)
        return (
        
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
            
        )
    }
}
export default GanttChart
