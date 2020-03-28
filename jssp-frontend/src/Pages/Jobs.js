import React from "react";

/**
 * Display a Job Operation
 * @param {{operationName:string, machineAndTimes:[[id:number,time:number]]}} props 
 */
function JobOperation(props) {
  return(
    <div className="kr-card">
      <h5>{props.operationName}</h5>
      <p>
        <table>
          <thead>
            <tr>
              <th>Machine Id</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {props.machineAndTimes.map(mt => {
              return <tr>
                <td>{mt[0]}</td>
                <td>{mt[1]}</td>
              </tr>
            })}
          </tbody>
        </table>
      </p>
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
      {props.operations.map(js => 
        <JobOperation 
          operationName={js.operationName} 
          machineAndTimes={js.machineAndTimes} 
        />
      )}
    </div>
  )
}

/**
 * 
 * @param {{machines:[], jobs:{jobSequence:[],  }[] }} props 
 */
function JobEditor(props) {
  return (
    <div>
      <h3>All your SKUs are below</h3>
      {
        props.jobs.map(jobDef => <Job name={jobDef.name} operations={jobDef.operations} />)
      }

    </div>
  )
}

export default JobEditor