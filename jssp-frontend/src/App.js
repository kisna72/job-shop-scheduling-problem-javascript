import React from 'react';
import './App.css';
import GanttChart from './GattChart';
import jobIdToColour from './jobIdToColor';
import WebWorkerScript from './worker';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  JSSPProblemInstance,
  JSSPGanttChartSolution,
  JSSP1DEncoding,
  FishesYatesShuffle,
  generateRandom1D
} from './JSSP';
import { NavBar , SubNavBar } from './components/navbar';
import TwoDPlot from './TwoDPlot';


// Parameters for algorithm. Problem is defined in a problem definition file.
const PROBLEM_INSTANCE_FILE = "demo.txt"
const ALGORITHM_REPETITION = 10000
const ALGORITHM_MAX_TIME_SECONDS = 1  //Max time we want the algo to run. TODO use timelimit


// Step 1: Create a new instance of JSSPProblemInstance from file.
const problem = new JSSPProblemInstance(4,5) // Instantiate with no data. 
// problem.jobs = [ 
//   [ 0, 10, 1, 20, 2, 20, 3, 40, 4, 10 ],
//   [ 1, 20, 0, 10, 3, 30, 2, 50, 4, 30 ],
//   [ 2, 30, 1, 20, 4, 12, 3, 40, 0, 10 ],
//   [ 4, 50, 3, 30, 2, 15, 0, 20, 1, 15 ] ]

/**
 * Water Bottoling Plant that does 4 different types of water bottles. 
 * Job 0 - Spring Water 16oz
 * Job 1 - Distilled Water 16 oz
 * Job 2 - Distilled Water 32 oz
 * Job 4 - Bottoled Water 32 oz
 * 
 * We have 5 machines for different operations
 * Machine 0 - Bottle Expansion Molding
 * Machine 1 - Water Cleaning or purifying Machine 
 * Machine 2 - Pouring water / Filling Process 
 * Machine 3 - Capping
 * Machine 4 - Labelling
 * 
 * Jobs must be run in the following order
 */
problem.jobs = [
  [0, 10, 1, 10, 2, 10, 3, 10, 4, 8],
  [0, 50, 1, 15, 2, 10, 3, 10, 4, 16],
  [0, 30, 1, 12, 2, 20, 3, 10, 4, 16],
  [0, 15, 1, 30, 2, 20, 3, 10, 4, 10],
]

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      schedule:[[],[]],
      makeSpan:Infinity,
      minMakeSpanDetectedIteration:0,
      iterations:0,
      workerInstance : new Worker(WebWorkerScript),
      makeSpanHistory:[]
    }
    //this.runOptimizationAlgo(problem, 10, 1)
    // setTimeout( () => {this.runOptimizationAlgo(problem, 1, 1)},1000)
  }
  componentDidMount(){

    //var myWorker = new Worker('worker.js');
    this.state.workerInstance.addEventListener("message", e => {
        console.log("Received response:");
        console.log(e.data);
        // We can have 2 different data types.
        // {"type":"iterationCount","value":200}
        // {"type":"newSchedule","value":[[],...]}
        if(e.data && e.data.type === "iterationCount"){
          //console.log(`New Iteration Count ${e.data.value}`)
          console.log("About to concate makeSpan history array")
          this.setState({
            iterations:e.data.iteration,
            makeSpanHistory:[...this.state.makeSpanHistory,...e.data.newMakeSpan]
          })
        }
        else if(e.data && e.data.type === "newSchedule"){
          console.log(`New Schedule ${e.data.schedule}`)
          this.setState({
            schedule : e.data.schedule, makeSpan:e.data.makeSpan,
            minMakeSpanDetectedIteration: e.data.minMakeSpanDetectedIteration
          });
        } else {
          console.log("generic Message ", e.data);
        }
        
    }, false);
    this.state.workerInstance.postMessage({algorithmRepetition:50,problem:problem,algorithmMaxTimeSecs:30})
  }

  // runOptimizationAlgo(problem, algorithmRepetition, algorithmMaxTimeSecs ){
  //   // let gantt = []
  //   let { makeSpan } = this.state
  //   // const times = 100
  //   const algoStartTime = (new Date).getTime();
  //   const algoMaxEndTime = algoStartTime + (algorithmMaxTimeSecs * 1000)
  //   for(let i = 0; i < algorithmRepetition; i ++){
  //     console.log("running algo")
  //       if( (i%100==0) && (new Date).getTime() > algoMaxEndTime){ //Run time check every 100th run.
  //           console.log("Ending because of time limit")
  //           console.log("Ran times : " , i)
  //           break;
  //       }
  //       const randomizedInput = generateRandom1D(problem.numMachines, problem.numJobs)
  //       const problemCopy = Object.assign({}, problem)
  //       problemCopy.jobs = JSON.parse(JSON.stringify(problem.jobs))

  //       const ganttFromRandInput = randomizedInput.JSSP1dToGantt(problemCopy)
  //       const newMakeSpan = ganttFromRandInput.getMakeSpan();
        
  //       // console.log(ganttFromRandInput.schedule[0])
  //       if(newMakeSpan < makeSpan){
  //           makeSpan = newMakeSpan
  //           // gantt = ganttFromRandInput
  //           console.log("Found Better", ganttFromRandInput)
  //           console.log("New Make Span at index ", i, newMakeSpan)
  //           this.setState({
  //             schedule:ganttFromRandInput.schedule,
  //             makeSpan:makeSpan
  //           })
  //       }
  //   }
    
  //   // console.log("Shortest MakeSpan", makeSpan)
  //   setTimeout( () => {this.runOptimizationAlgo(problem, 1, 1)},1000)
  //   //return gantt
  // }
  render(){
    console.log("Render function re-running", this.state.schedule)
    const screenWidth = window.innerWidth * 0.9
    return (
      <div className="App">
        <NavBar/>
        <SubNavBar/>
        <h3>Water Bottling Plant - MakeSpan Optimization</h3>
        <p>
          <strong>Number of Simulations Performed:</strong> {this.state.iterations}  | 
          <strong>Minimum MakeSpan detected:</strong> {this.state.makeSpan} | <strong>Min detected after iteration :</strong> {this.state.minMakeSpanDetectedIteration}
        </p>
        <h6>Plot of makespan for each different simulation when using random Algorithm</h6>
        <TwoDPlot data={this.state.makeSpanHistory} width={screenWidth} />
        <hr></hr>
        <h6>Schedule with the least makespan</h6>
        <GanttChart schedule={this.state.schedule}/>
        
        <div className="explanation">
        <p>
The Chart above shows the order in which each operation in a water bottling plant must run on each machine to complete all bottling activities in the most efficient manner. 
Watch the chart change as the algorithm finds more and more efficient way to run the factory over time. Simulation is slowed down for demonstration purpose.</p>
          <hr></hr>
          <h3>Explanation</h3>

In this demo, we are trying to optimize how to run a water bottling plant. We have 5 machines for different operations, and various different types of products we need to produce.


<ol>
  <li>Machine 0 - Bottle Expansion Molding</li>
  <li>Machine 1 - Water Cleaning or purifying Machine </li>
  <li>Machine 2 - Pouring water / Filling Process </li>
  <li>Machine 3 - Capping</li>
  <li>Machine 4 - Labelling</li>
</ol>

This factory produces 4 different types of water bottles, and each water bottling operation must be run in the following order:
<ol>
  <li><span style={{backgroundColor:`${jobIdToColour(0)}`}}>Job 0 - Spring Water 16oz </span>
      <ol>
        <li>Bottle Expansion - 10 seconds</li>
        <li>Water Purifying - 30 seconds</li>
        <li>Water Filling - 10 seconds</li>
        <li>Bottle Capping - 10 seconds</li>
        <li>Bottle Labeling - 8 seconds</li>
      </ol>
  </li>
  <li><span style={{backgroundColor:`${jobIdToColour(1)}`}}>Job 1 - Distilled Water 16 oz</span>
      <ol>
        <li>Bottle Expansion - 50 seconds</li>
        <li>Water Purifying - 60 seconds</li>
        <li>Water Filling - 10 seconds</li>
        <li>Bottle Capping - 10 seconds</li>
        <li>Bottle Labeling - 16 seconds</li>
      </ol>
  </li>
  <li><span style={{backgroundColor:`${jobIdToColour(2)}`}}>Job 2 - Distilled Water 32 oz</span>
      <ol>
        <li>Bottle Expansion - 30 seconds</li>
        <li>Water Purifying - 90 seconds</li>
        <li>Water Filling - 20 seconds</li>
        <li>Bottle Capping - 10 seconds</li>
        <li>Bottle Labeling - 16 seconds</li>
      </ol>
  </li>
  <li><span style={{backgroundColor:`${jobIdToColour(3)}`}}>Job 3 - Bottoled Water 32 oz</span>
      <ol>
        <li>Bottle Expansion - 15 seconds</li>
        <li>Water Purifying - 90 seconds</li>
        <li>Water Filling - 20 seconds</li>
        <li>Bottle Capping - 10 seconds</li>
        <li>Bottle Labeling - 10 seconds</li>
      </ol>
  </li>
</ol>

Algorithm that runs in the background finds the most optimal way of running all the jobs in the given order. 

The Chart shows the order in which each job must run on each machine to complete all bottling activities in the most efficient manner. 
Watch the chart change as the algorithm finds more and more efficient way to run the factory. 

        </div>
      </div>
    );
  }
}

export default App;
