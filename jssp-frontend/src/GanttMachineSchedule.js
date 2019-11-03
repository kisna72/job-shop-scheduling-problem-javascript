import React from 'react';
import jobIdToColour from './jobIdToColor';

/**
 * Idea here is to take an array
 */
class GanttMachineSchedule extends React.Component {
    constructor(props){
        super(props)
    }
    randColor(){
        return Math.floor(Math.random() * 180) //use 180 instead of 255 to avoid colors too light
    }

    render(){
        let a = [] 
        for(let i = 0; i< this.props.schedule.length; i++){
            if(i%3 === 0){
                const jobid = this.props.schedule[i];
                const start = this.props.schedule[i + 1];
                const end = this.props.schedule[i + 2];
                const _width = 100* (end - start)/this.props.maxTime
                const _startpx = 100* start / this.props.maxTime
                const style = {
                    width:`${_width}%`,
                    height: '20px',
                    // border:'black',
                    backgroundColor:`${jobIdToColour(jobid)}`,
                    position:'absolute',
                    left:`${_startpx}%`,
                    transition: 'all 1s linear'
                }

                const width = <div id={`key-${this.props.index}-${jobid}`} className={`job-${jobid}`}  style={style} data-start={start} data-end={end} data-jobid={jobid}>Job-{jobid}</div>
                a.push(width)
            }
            continue
        }
        const parentStyle = {
            position:'relative',
            display:'flex',
            top:`${this.props.index * 25}px`
        }
        return (
            <div style={parentStyle}>
                {a}
            </div>
        )
    }
}

export default GanttMachineSchedule