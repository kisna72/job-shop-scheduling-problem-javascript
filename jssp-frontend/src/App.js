import React from 'react';
import './App.css';
import GanttChart from './GattChart';
import jobIdToColour from './jobIdToColor';
import WebWorkerScript from './worker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { JSSPProblemInstance } from './JSSP';
import { NavBar } from './components/navbar';
import TwoDPlot from './TwoDPlot';

// Create a new instance of JSSPProblemInstance and assign jobs for water bottle plant.
const problem = new JSSPProblemInstance(4,5) // Instantiate with no data. 
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
      maxAlgorithmRepetition:50,
      algorithmMaxTimeSecs:30,
      algorithmType: 'hillClimbing' // random || hillClimbing
    }
  }
  startJobShopWorker = () => {
    const workerInstance = new Worker(WebWorkerScript);
    
    workerInstance.addEventListener("message", e => {
      // We can have 2 different data types or a generic message stored in e.data
      // {"type":"iterationCount","value":200}
      // {"type":"newSchedule","value":[[],...]}
      if(e.data && e.data.type === "iterationCount"){
        this.setState({
          iterations:e.data.iteration,
          makeSpanHistory:[...this.state.makeSpanHistory,...e.data.newMakeSpan]
        })
      }
      else if(e.data && e.data.type === "newSchedule"){
        this.setState({
          schedule : e.data.schedule, makeSpan:e.data.makeSpan,
          minMakeSpanDetectedIteration: e.data.minMakeSpanDetectedIteration
        });
      } else {
        console.log("generic Message ", e.data);
      } 
    }, false);
    
    workerInstance.postMessage({
      algorithmRepetition:this.state.maxAlgorithmRepetition,
      problem:problem,
      algorithmMaxTimeSecs:this.state.algorithmMaxTimeSecs,
      algorithmType: this.state.algorithmType
    })

    this.setState({
      workerInstance: workerInstance,
    })
  }

  componentDidMount(){
    this.startJobShopWorker()
  }
  handleChange = (event)=>{
    this.setState({[event.target.name]: event.target.value});
  }

  handleRestartJobShopWorkerButton = (e)=>{
    e.preventDefault();
    this.state.workerInstance.terminate();
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
        <NavBar>
          <li class="nav-item">
            <select className="form-control ml-2" name="algorithmType" onChange={this.handleChange} value={this.state.algorithmType}>
              <option value="random">Random Search</option>
              <option value="hillClimbing">Hill Climbing Search</option>
            </select>
          </li> 

          <li class="nav-item ml-2">
            <button className="btn btn-outline-danger ml-2" onClick={this.handleStopWorker}> Stop </button>
          </li>
          
          <li class="nav-item ml-2">
            <button className="btn btn-outline-success" onClick={this.handleRestartJobShopWorkerButton}>  Restart with new settings </button>
          </li>
        </NavBar>

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
                      <input type="number" style={{width:'4em'}} name="algorithmMaxTimeSecs" onChange={this.handleChange} value={this.state.algorithmMaxTimeSecs} class="form-controll" placeholder="Max number of iterations"/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{marginTop:'10px'}}>
          <h6>Plot of makespan during each different simulation</h6>
          <TwoDPlot data={this.state.makeSpanHistory} width={screenWidth} />
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
