import React from "react";

/**
 * Display a Job Operation
 * @param {{operationName:string, machineAndTimes:[[id:number,time:number]]}} props 
 */
function JobOperation(props) {
  return (
    <div className="kr-card">
      <h5>{props.operationName}</h5>
      <table>
        <thead>
          <tr>
            <th>Machine Id</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {props.machineAndTimes.map( (mt, idx) => {
            return <tr key={idx}>
              <td>{mt[0]}</td>
              <td>{mt[1]}</td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Display a Job.
 * @param {{name:string, operations:[ [machineid:number,time:string] ] , machineMap }} props 
 */
function Job(props) {
  return (
    <div className="kr-card mb-3">
      <h3>{props.name}</h3>
      <div className="d-flex align-items-center align-self-center">
      {props.operations.map(js => 
        <div key={js.operationName}>
          <JobOperation
            key={js.operationName} 
            operationName={js.operationName} 
            machineAndTimes={js.machineAndTimes} 
          />
          <div> -> </div>
        </div>
      )}
      </div>
    </div>)
}

/**
 * 
 * @param {{machines:[], jobs:{jobSequence:[],  }[] }} props 
 */
function JobEditor(props) {
  return (
    <div>
      <h3>All your SKUs are below</h3>
      { props.jobs.map(jobDef => <Job key={jobDef.name} name={jobDef.name} operations={jobDef.operations} />) }
    </div>
  )
}

export default JobEditor