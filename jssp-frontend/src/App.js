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
      schedule:[[],[]],
      makeSpan:Infinity
    }
    this.runOptimizationAlgo(problem, 10, 1)
  }

  runOptimizationAlgo(problem, algorithmRepetition, algorithmMaxTimeSecs ){
    // let gantt = []
    let { makeSpan } = this.state
    // const times = 100
    const algoStartTime = (new Date).getTime();
    const algoMaxEndTime = algoStartTime + (algorithmMaxTimeSecs * 1000)
    for(let i = 0; i < algorithmRepetition; i ++){
      console.log("running algo")
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
        
        // console.log(ganttFromRandInput.schedule[0])
        if(newMakeSpan < makeSpan){
            makeSpan = newMakeSpan
            // gantt = ganttFromRandInput
            console.log("Found Better", ganttFromRandInput)
            console.log("New Make Span at index ", i, newMakeSpan)
            this.setState({
              schedule:ganttFromRandInput.schedule,
              makeSpan:makeSpan
            })
        }
    }
    
    // console.log("Shortest MakeSpan", makeSpan)
    setTimeout( () => {this.runOptimizationAlgo(problem, 1, 1)},1000)
    //return gantt
  }
  render(){
    console.log("Render function re-running", this.state.schedule)
    return (
      <div className="App">
        <main>
          <nav class="header">
            <nav class="nav-brand">Job Shop Optimization Algorithm</nav>
            <div class="nav-link">
              <nav class="nav-link__link">Simple Problem (jobs=4, machines=5)</nav>
              <nav class="nav-link__link">Medium (jobs=5, machines=6)</nav>
            </div>
          </nav>
          <nav class="sub-header">
            <nav class="nav-link__link">Random Algorithm</nav>
          </nav>
        </main>
        <h1>Simple Job Shop Optimization</h1>
        <GanttChart schedule={this.state.schedule}/>
        <div className="explanation">
          <hr></hr>
          <div>How to read the chart?</div>
          <p>Job Shop Problem is a class of problems that help you find the most efficient way of running certain number of jobs on 
            a given set of machines. These types of problems regularly arise in manufacturing floors.
          </p>
          <p>The problem solved here has the following problem signature:
            
<div>+++++++++++++++++++++++</div>
<div>A simple Demo</div>
<div>4 5</div>
<div>0 10 1 20 2 20 3 40 4 10</div>
<div>1 20 0 10 3 30 2 50 4 30</div>
<div>2 30 1 20 4 12 3 40 0 10</div>
<div>4 50 3 30 2 15 0 20 1 15</div>
<div>++++++++++++++++++++++++</div>
First line with numbers 4 and 5 indicates number of job and number of machine respectively. 

Each line after that indicates a job. First job needs to run on machine 0 for 10 units of time, then on machine 1 for 20 units of time
then on machine 3 for 40 units of time and so on. 

Each job needs to run in the specific order described in the line. 


Algorithm that runs in the background finds the most optimal way of running all the jobs in the given order. 

The Chart shows the order in which each job must run on each machine. 
 </p>
        </div>
      </div>
    );
  }
}

export default App;
