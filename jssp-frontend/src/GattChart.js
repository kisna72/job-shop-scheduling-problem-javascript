import React from 'react';
import GanttMachineSchedule from './GanttMachineSchedule';
import GanttXTicks from './GanttXTicks';

function GanttChart(props) {
    const allEnds = props.schedule
                        .filter(schArr => schArr.length > 0)
                        .map(schArr => schArr[schArr.length-1])
    const maxTime = Math.max(...allEnds)
    return (
    
        <div className="ganttChartWithY">
            <div className="ganttChartYAxis">

                {props.machines.map( (machine,idx)=>{
                    return <span className="yAxisTick">{`${machine.name} Machine`}</span>
                })}

            </div>
            <div className="ganttChartData">
                {props.schedule.map( (sch,idx) => 
                    <GanttMachineSchedule schedule={sch} maxTime={maxTime} index={idx}/>)}
                <GanttXTicks index={props.schedule.length} maxTime={maxTime} />
            </div>
        </div>
        
    )
    
}
export default GanttChart
