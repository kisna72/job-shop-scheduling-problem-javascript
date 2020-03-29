import React, { useState } from "react";
import { TextInput } from '../sharedComponents/react/Input';

/**
 * Display a Job Operation
 * @param {{operationName:string, machineAndTimes:[[id:number,time:number]]}} props 
 */
function JobOperation(props) {
  return (
    <div className="kr-card">
      <h5>{props.operationName}</h5>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Machine Id</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {props.machineAndTimes.map( (mt, idx) => {
            return <tr key={idx}>
              <td>{mt[0]}</td>
              <td>{mt[1]}</td>
              <td></td>
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
function Job({name,operations,machineMap}) {
  const [newOperationName, setNewOperationName] = useState('');
  const [addingNew, setAddingNew] = useState(false)
  const handleChange = () => {}
  const handleSubmit = () => {}
  return (
    <div className="kr-card mb-3">
      <h3>{name}</h3>
      <div className="d-flex align-items-center align-self-center">
      {operations.map(js => 
        <>
          <JobOperation
            key={js.operationName} 
            operationName={js.operationName} 
            machineAndTimes={js.machineAndTimes} 
          />
          <div className="p-3"> -> </div>
        </>
      )}
        { addingNew ? 
        <form className="kr-card" onSubmit={handleSubmit}>
          <TextInput
            id="job-new-input"
            value={newOperationName}
            onChange={handleChange}
            label="Enter new Job (new SKU)"
            smallLabel="You will be able to add operations for each job after creating it"
            />
          <button type="submit" className="btn btn-primary" disabled={newOperationName === ""}>Add new Job</button>
          <button className="btn btn-warning ml-1" onClick={() => setAddingNew(false)}>Cancel</button>
        </form>
        : <button className="btn btn-primary" onClick={() => setAddingNew(true)}>Add Operation </button>
        }
      </div>
    </div>)
}

/**
 * @param {{machines:[], jobs:[{jobSequence:[]] }} props 
 */
function JobEditor(props) {
  const [newJobName, setNewJobName ] = useState('')

  const handleChange = (event) => {
    setNewJobName(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // call props.addJob 
    props.createJob({
      name:newJobName,
      operations:[]
    })

    setNewJobName('');
  }

  return (
    <div className="m-5">
      <h3>See SKUs below</h3>
      { props.jobs.map(jobDef => <Job key={jobDef.name} name={jobDef.name} operations={jobDef.operations} />) }
      <form className="kr-card" onSubmit={handleSubmit}>
          <TextInput
            id="job-new-input"
            value={newJobName}
            onChange={handleChange}
            label="Enter new Job (new SKU)"
            smallLabel="You will be able to add operations for each job after creating it"
            />
          <button type="submit" className="btn btn-primary" disabled={newJobName === ""}>Add new Job</button>
        </form>
    </div>
  )
}

export default JobEditor