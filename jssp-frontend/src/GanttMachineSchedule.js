import React from 'react';

/**
 * Idea here is to take an array
 */
class GanttMachineSchedule extends React.Component {
    constructor(props){
        super(props)
        // this.state = {
        //     schedule : this.props.schedule,// [ 0, 1, 10, 1, 21, 30, 2, 131, 140, 3, 146, 165 ],
        //     maxTime: this.props.maxTime,//165
        //     index: this.props.index
        // }
    }
    randColor(){
        return Math.floor(Math.random() * 180) //use 180 instead of 255 to avoid colors too light
    }

    // Modified from https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
    jobIdToColour(jobid) {
        const str = `${jobid}color`
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
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
                    backgroundColor:`${this.jobIdToColour(jobid)}`,
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