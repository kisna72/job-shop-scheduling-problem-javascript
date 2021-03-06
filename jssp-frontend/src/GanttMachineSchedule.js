import React from 'react';
import jobIdToColour from './jobIdToColor';

/**
 * Idea here is to take an array
 */
function GanttMachineSchedule(props) {

    let a = [] 
    for(let i = 0; i< props.schedule.length; i++){
        if(i%3 === 0){
            const jobid = props.schedule[i];
            const start = props.schedule[i + 1];
            const end = props.schedule[i + 2];
            const _width = 100* (end - start)/props.maxTime
            const _startpx = 100* start / props.maxTime
            const style = {
                width:`${_width}%`,
                height: '20px',
                // border:'black',
                backgroundColor:`${jobIdToColour(jobid)}`,
                position:'absolute',
                left:`${_startpx}%`,
                transition: 'all 1s linear'
            }

            const width = <div key={`key-${props.index}-${jobid}-${i}`} id={`key-${props.index}-${jobid}`} className={`job-${jobid}`}  style={style} data-start={start} data-end={end} data-jobid={jobid}>Job-{jobid}</div>
            a.push(width)
        }
        continue
    }
    const parentStyle = {
        position:'relative',
        display:'flex',
        top:`${props.index * 25}px`
    }
    return (
        <div style={parentStyle}>
            {a}
        </div>
    )
    
}

export default GanttMachineSchedule