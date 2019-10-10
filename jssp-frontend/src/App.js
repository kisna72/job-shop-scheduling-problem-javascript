import React from 'react';
import logo from './logo.svg';
import './App.css';
import GanttChart from './GattChart';
import GanttMachineSchedule from './GanttMachineSchedule';
import {
  JSSPProblemInstance,
  JSSPGanttChartSolution,
  JSSP1DEncoding,
  FishesYatesShuffle,
  generateRandom1D
} from './JSSP';


// Parameters for algorithm. Problem is defined in a problem definition file.
const PROBLEM_INSTANCE_FILE = "demo.txt"
const ALGORITHM_REPETITION = 10000
const ALGORITHM_MAX_TIME_SECONDS = 1  //Max time we want the algo to run. TODO use timelimit

// Step 1: Create a new instance of JSSPProblemInstance from file.
const problem = new JSSPProblemInstance(4,5) // Instantiate with no data. 
problem.jobs = [ 
  [ 0, 10, 1, 20, 2, 20, 3, 40, 4, 10 ],
  [ 1, 20, 0, 10, 3, 30, 2, 50, 4, 30 ],
  [ 2, 30, 1, 20, 4, 12, 3, 40, 0, 10 ],
  [ 4, 50, 3, 30, 2, 15, 0, 20, 1, 15 ] ]

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      schedule:[[],[]]
    }
    this.runOptimizationAlgo(problem, 10, 1)
  }

  runOptimizationAlgo(problem, algorithmRepetition, algorithmMaxTimeSecs ){
    let gantt = []
    let makeSpan = Infinity
    // const times = 100
    const algoStartTime = (new Date).getTime();
    const algoMaxEndTime = algoStartTime + (algorithmMaxTimeSecs * 1000)
    for(let i = 0; i < algorithmRepetition; i ++){
        if( (i%100==0) && (new Date).getTime() > algoMaxEndTime){ //Run time check every 100th run.
            console.log("Ending because of time limit")
            console.log("Ran times : " , i)
            break;
        }
        const randomizedInput = generateRandom1D(problem.numMachines, problem.numJobs)
        const problemCopy = Object.assign({}, problem)
        problemCopy.jobs = JSON.parse(JSON.stringify(problem.jobs))

        const ganttFromRandInput = randomizedInput.JSSP1dToGantt(problemCopy)
        const newMakeSpan = ganttFromRandInput.getMakeSpan();
        
        this.state = {
          schedule:ganttFromRandInput.schedule
        }
        console.log(ganttFromRandInput.schedule[0])
        if(newMakeSpan < makeSpan){
            makeSpan = newMakeSpan
            gantt = ganttFromRandInput
            // console.log("Found Better")
            console.log("New Make Span at index ", i, newMakeSpan)
            // this.state = {
            //   gantt
            // }
            // console.log(gantt)
            // console.log("============")
        }
    }
    
    console.log("Shortest MakeSpan", makeSpan)
    setTimeout( () => {this.runOptimizationAlgo(problem, 1, 1)},2000)
    //return gantt
  }
  render(){
    return (
      <div className="App">
        <h1>Gantt Chart</h1>
        <GanttChart schedule={this.state.schedule}/>
      </div>
    );
  }
}

export default App;
