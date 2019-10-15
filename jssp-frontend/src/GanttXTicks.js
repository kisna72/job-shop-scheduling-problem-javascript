import React from 'react';

class GanttXTicks extends React.Component {
    render(){
        const parentStyle = {
            position:'relative',
            // display:'flex',
            top:`${(this.props.index) * 25}px`,
            // width: '100%'
        }
        const ticks = []
        const maxTimePlus = ((this.props.maxTime/10)+1 )*10
        for(let i = 0; i<maxTimePlus; i++){
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
        return (
            <div style={parentStyle}>
                {ticks}
            </div>
        )
    }
}

export default GanttXTicks