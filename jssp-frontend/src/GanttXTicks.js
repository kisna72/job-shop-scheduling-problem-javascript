import React from 'react';

class GanttXTicks extends React.Component {
    render(){
        const parentStyle = {
            position:'relative',
            top:`${(this.props.index) * 25}px`,
        }
        const ticks = []
        const startTickStyle = {
            left:0,
            transition: 'all 1s linear',
            position:'absolute'
        }
        const startTick = <span style={startTickStyle}>
            <div>|</div>
            <div>0</div>
        </span>
        ticks.push(startTick)
        for(let i = 1; i<this.props.maxTime; i++){
            const _startpx = 100* i / this.props.maxTime
            const style = {
                left:`${_startpx}%`,
                transition: 'all 1s linear',
                position:'absolute'
            }
            if(i%10 === 0){
                const tick = <span style={style}>
                    <div>|</div>
                    <div>{i}</div>
                    </span>
                ticks.push(tick);
            }
        }
        const endTickStyle = {
            left:'100%',
            transition: 'all 1s linear',
            position:'absolute'
        }
        const endTick = <span style={endTickStyle}>
            <div>|</div>
            <div>{this.props.maxTime}</div>
        </span>
        ticks.push(endTick)
        return (
            <div style={parentStyle}>
                {ticks}
            </div>
        )
    }
}

export default GanttXTicks