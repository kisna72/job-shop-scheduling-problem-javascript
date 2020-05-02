import React from 'react';
import './App.css';
import GanttChart from './GattChart';
import jobIdToColour from './jobIdToColor';
import WebWorkerScript from './worker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { JSSPProblemInstance } from './JSSP';
import { NavBar } from './components/navbar';
import TwoDPlot from './TwoDPlot';
import  { jobObjectToArrayOfArray, generateProblemInstance } from './JSSP';
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";


// Create a new instance of JSSPProblemInstance and assign jobs for water bottle plant.

const problemStatic = new JSSPProblemInstance(5,6) // Instantiate with no data. j jobs and m machines.
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
//  */
problemStatic.jobs = [
  // Read it as follows:
  // first job -> first step can run on 2 machines. Machine 0 for time 10 OR Machine 5 for time 20, next it runs on 1 machine - machine 1 for time 10 etc.
  [2, 0, 10, 5, 20, 1, 1, 10, 1, 2, 10, 1, 3, 10, 1, 4, 8, 1, 4, 10, 1, 4, 10],
  // second Job -> first step can run on 2 machines. Machine 0 for time 50 OR machine 5 for time 30, second step on 1 machine - machine 1 for 15 times
  [2, 0, 50, 5, 30, 1, 1, 15, 1, 2, 10, 1, 3, 10,],// 1, 4, 16], // Very Very Flexible...
  [2, 0, 30, 5, 50, 1, 1, 12, 1, 2, 20, 1, 3, 10, 1, 4, 16],
  [2, 0, 15, 5, 20, 1, 1, 30, 1, 2, 20, 1, 3, 10, 1, 4, 10],
  [1, 2, 120]
]

// Infer number of machines the job needs to run based on job definition.
problemStatic.numMachineByJobs = []
problemStatic.jobs.forEach(jobDefArr => {
  let numMachines = 0
  let nextIndexToCheck = 0;
  for(let i = 0; i < jobDefArr.length; i++ ){
    if(i === nextIndexToCheck){
      numMachines += 1
      nextIndexToCheck = i + jobDefArr[i]*2 + 1
    }
  }
  problemStatic.numMachineByJobs.push(numMachines)
})
// Example Problem Statement
// problem.jobs = [ 
//   [ 0, 10, 1, 20, 2, 20, 3, 40, 4, 10 ],
//   [ 1, 20, 0, 10, 3, 30, 2, 50, 4, 30 ],
//   [ 2, 30, 1, 20, 4, 12, 3, 40, 0, 10 ],
//   [ 4, 50, 3, 30, 2, 15, 0, 20, 1, 15 ] ]

// Complicated Problem Statement -> Uncomment below..
// problem.numJobs = 10
// problem.numMachines = 10
// problem.jobs = [
// [ 4, 88, 8, 68, 6, 94, 5, 99, 1, 67, 2, 89, 9, 77, 7, 99, 0, 86, 3, 92 ],
// [ 5, 72, 3, 50, 6, 69, 4, 75, 2, 94, 8, 66, 0, 92, 1, 82, 7, 94, 9, 63 ],
// [ 9, 83, 8, 61, 0, 83, 1, 65, 6, 64, 5, 85, 7, 78, 4, 85, 2, 55, 3, 77 ],
// [ 7, 94, 2, 68, 1, 61, 4, 99, 3, 54, 6, 75, 5, 66, 0, 76, 9, 63, 8, 67 ],
// [ 3, 69, 4, 88, 9, 82, 8, 95, 0, 99, 2, 67, 6, 95, 5, 68, 7, 67, 1, 86 ],
// [ 1, 99, 4, 81, 5, 64, 6, 66, 8, 80, 2, 80, 7, 69, 9, 62, 3, 79, 0, 88 ],
// [ 7, 50, 1, 86, 4, 97, 3, 96, 0, 95, 8, 97, 2, 66, 5, 99, 6, 52, 9, 71 ],
// [ 4, 98, 6, 73, 3, 82, 2, 51, 1, 71, 5, 94, 7, 85, 0, 62, 8, 95, 9, 79 ],
// [ 0, 94, 6, 71, 3, 81, 7, 85, 1, 66, 2, 90, 4, 76, 5, 58, 8, 93, 9, 97 ],
// [ 3, 50, 0, 59, 1, 82, 8, 67, 7, 56, 9, 96, 6, 58, 4, 81, 5, 59, 2, 96 ]
// ]

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      schedule:[[],[]],
      makeSpan:Infinity,
      minMakeSpanDetectedIteration:0,
      iterations:0,
      workerInstance : new Worker(WebWorkerScript),
      makeSpanHistory:[],
      maxAlgorithmRepetition:100,
      algorithmMaxTimeSecs:30,
      algorithmType: 'hillClimbingRestarts', // random || hillClimbing || hillClimbingRestarts
      uPlotRef: null,
      simulationStartTime: Math.round((new Date()).getTime() / 1000)
    }
  }
  startJobShopWorker = () => {
    this.setState({
      simulationStartTime: Math.round((new Date()).getTime() / 1000)
    })
    console.log("started worker")
    const workerInstance = new Worker(WebWorkerScript);
    
    workerInstance.addEventListener("message", e => {
      // We can have 2 different data types or a generic message stored in e.data
      // {"type":"iterationCount","value":200}
      // {"type":"newSchedule","value":[[],...]}
      if(e.data && e.data.type === "iterationCount"){
        const newYData = [...this.state.uPlotRef.data[1], ...e.data.newMakeSpan]
        const newXData = new Array(newYData.length).fill(0).map( (v,i) => i )
        // this.state.uPlotRef.delSeries(0);
        this.state.uPlotRef.setData([newXData, newYData], true)
      }
      else if(e.data && e.data.type === "newSchedule"){
        const schedule = []
        e.data.schedule.forEach((value, key) => {
          // console.log(value)
          schedule.push(value)
        })
        this.setState({
          schedule : schedule, 
          makeSpan:e.data.makeSpan,
          minMakeSpanDetectedIteration: e.data.minMakeSpanDetectedIteration
        });
      } else {
        //console.log("generic Message ", e.data);
      } 
    }, false);
    
    const problem = generateProblemInstance(this.props.jobs, this.props.machines);
    // const problem = problemStatic // OLD 
    workerInstance.postMessage({
      algorithmRepetition:this.state.maxAlgorithmRepetition,
      problem:problem,
      algorithmMaxTimeSecs:this.state.algorithmMaxTimeSecs,
      algorithmType: this.state.algorithmType,
      machines: this.props.machines, 
      jobs: this.props.jobs
    })

    this.setState({
      workerInstance: workerInstance,
    })
  }
  createChart(){
    const opts = {
      title: "Best MakeSpan over Time/Simulations",
      width: window.innerWidth - 40,
      height: 300,
      series: [
        {
          label:"Makespan"
        },
        {
          stroke:"rgb(18, 147, 154)",
          label: "Nth simulation",
          width:2
        }
      ],
      axes:[
        {
          label:"Nth Simulation"
        },
        {
          label:"Makespan"
        }
      ],
      scales: {
        x: {
          time: false
        }
      }
    }
    const uPlotRef = new uPlot(opts, [[null],[null]], document.getElementById("uplotChart"));
    this.setState({
      uPlotRef
    })
  }

  componentDidMount(){
    this.createChart()
    this.startJobShopWorker()
  }
  componentDidUpdate(prevProps, prevState, snapshot){
    if( (prevProps.jobs !== this.props.jobs) || (prevProps.machines !== this.props.machines) ){
      console.log("props changed, so restarting the simulation")
      this.state.workerInstance.terminate();
      this.startJobShopWorker()
    }
  }
  componentWillUnmount(){
    this.state.workerInstance.terminate();
  }
  handleChange = (event)=>{
    this.setState({[event.target.name]: event.target.value});
  }

  handleRestartJobShopWorkerButton = (e)=>{
    e.preventDefault();
    this.state.workerInstance.terminate();
    this.state.uPlotRef.setData([[null],[null]])
    this.setState({
      schedule:[[],[]],
      makeSpan:Infinity,
      minMakeSpanDetectedIteration:0,
      iterations:0,
      makeSpanHistory:[],
    },this.startJobShopWorker() )
    
  }
  handleStopWorker = (e) => {
    this.state.workerInstance.terminate();
  }
  render(){
    const screenWidth = (window.innerWidth - 60)
    return (
      <div className="App">
        <nav className="d-flex factory-navbar bg-color-app-secondary">
          <li className="nav-item no-list-style">
            <select className="form-control ml-2" name="algorithmType" onChange={this.handleChange} value={this.state.algorithmType}>
              <option value="random">Random Search</option>
              <option value="hillClimbing">Hill Climbing Search</option>
              <option value="hillClimbingRestarts">Hill Climbing With Restarts</option>
            </select>
          </li> 

          <li className="nav-item ml-2 no-list-style">
            <button className="btn btn-outline-danger ml-2" onClick={this.handleStopWorker}> Stop </button>
          </li>
          
          <li className="nav-item ml-2 no-list-style">
            <button className="btn btn-outline-success" onClick={this.handleRestartJobShopWorkerButton}>  Restart with new settings </button>
          </li>
        </nav>
        

        <div className="container">
          <div className="row">
            <div className="col">
              <table className=" table table-sm mt-2">
                <thead>
                  <tr>
                    <th colSpan={2}>Simulation Parameters </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Number of Simulations</td>
                    <td>{this.state.iterations} </td>
                  </tr>
                  <tr>
                    <td>Minimal Makespan Detected</td>
                    <td>{this.state.makeSpan}</td>
                  </tr>
                  <tr>
                    <td>Min detected after iteration</td>
                    <td>{this.state.minMakeSpanDetectedIteration}</td>
                  </tr>
                </tbody>
              </table>

            </div>
            <div className="col">
              <table className="table table-sm mt-2">
                <thead>
                  <tr>
                    <th colSpan={2}>Termination Criteria</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Number of Simuations</td>
                    <td>
                      <input type="number" style={{width:'4em'}} name="maxAlgorithmRepetition" onChange={this.handleChange} value={this.state.maxAlgorithmRepetition}/>
                    </td>
                  </tr>
                  <tr>
                    <td>Maximum Time in seconds</td>
                    <td>
                      <input type="number" style={{width:'4em'}} name="algorithmMaxTimeSecs" onChange={this.handleChange} value={this.state.algorithmMaxTimeSecs} className="form-controll" placeholder="Max number of iterations"/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{marginTop:'10px'}}>
          <div id="uplotChart"></div>
        </div>
        <hr></hr>
        <h6>Schedule with the least makespan</h6>
        <GanttChart schedule={this.state.schedule}/>
        

        <div className="explanation">

        <p>
        The Chart above shows the order in which each operation in a water bottling plant must run on each machine to complete all bottling activities in the most efficient manner. 
        Watch the chart change as the algorithm finds more and more efficient way to run the factory over time. Simulation is slowed down for demonstration purpose.
        Run the simulations with different settings below: 
        </p>
                
        <hr></hr>
        <h3>Explanation</h3>

          In this demo, we are trying to optimize how to run a water bottling plant. 
          <ul>
            <li>The machines and the operations required for each job is listed in the machines tab. Feel free to click there to take a peek.</li>
            <li>The operation sequence for each job is listed under Jobs menu</li>
          </ul>
          We have {this.props.machines.length} machines for different operations, and various different types of products we need to produce.


        <ol>
          {this.props.machines.map( (m, idx )=> {
            return <li key={m.id}>
              Machine Id {m.id} - {m.name}
            </li>
          })}
        </ol>

        This factory produces {this.props.jobs.length} different types of water bottles, and each water bottling operation must be run in the following order:
        <ol>
          {this.props.jobs.map((j,idx)=>{
            return <li key={j.id}>
              <span style={{backgroundColor:`${jobIdToColour(idx)}`}}>Job id {j.id} - {j.name} </span>
              <ol>
                {j.operations.map((o, idx) => {
                  const allMachineTimes = o.machineAndTimes.map(mt => {
                    return `| ${mt[1]} Seconds if run on Machine ${mt[0]} |`
                  })
                  return <li key={idx}>{o.operationName}
                    - {allMachineTimes}
                  </li>
                })}
              </ol>
            </li>
          })}
          
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
