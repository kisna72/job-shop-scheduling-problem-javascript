import React, { useState } from "react";
import { TextInput } from '../sharedComponents/react/Input';
import { FaRegTrashAlt, FaEdit  } from 'react-icons/fa';

/**
 * Display a Job Operation
 * @param {{id:number, operationName:string, machineAndTimes:[[id:number,time:number]], machines:[], addMachineTime:function }} props 
 */
function JobOperation(props) {
  const [addingMachine, setAddingMachine]= useState(false);
  const [selectedMachine, setSelectedMachine] = useState(undefined);
  const [machineTime, setMachineTime] = useState(0);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const newMachineTime = [selectedMachine, machineTime]

    props.addMachineTime(props.id, newMachineTime)
  }
  const handleEditIconClick = () => {}
  const handleDeleteIconClick = () => {}

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
              <td>
                <div className="d-flex justify-content-around">
                  <FaEdit onClick={handleEditIconClick}/>
                  <FaRegTrashAlt onClick={handleDeleteIconClick}/>
                </div>
              </td>
            </tr>
          })}
        </tbody>
      </table>
      {addingMachine ? 
        <form onSubmit={handleSubmit}>
          <select className="form-control" onChange={(event) => setSelectedMachine(event.target.value)} value={selectedMachine}>
            {props.machines.map( m => <option value={m.id}>{m.name}</option> )}
          </select>
          <input className="form-control" placeholder="enter time" value={machineTime} onChange={(event)=>setMachineTime(event.target.value)}></input>
          <button>Submit</button>
          <button onClick={() => setAddingMachine(false)} className="button btn-primary mt-1">Cancel</button>
        </form>
      
      : <button onClick={() => setAddingMachine(true)} className="button btn-primary mt-1">Add New Machine Option</button>
      }
    </div>
  )
}

/**
 * Display a Job.
 * @param {{id:number, name:string, operations:[ [machineid:number,time:string] ] , updateJob:function, machines }} props 
 */
function Job({id, name,operations,updateJob, machines}) {
  const [newOperationName, setNewOperationName] = useState('');
  const [addingNew, setAddingNew] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    // Add Operation to the Job, and send a update
    const jobWithNewOperations = {
      id: id,
      name: name,
      operations: [...operations, {
        id: operations.reduce( (prev, cur) => cur.id <= prev ? prev : cur.id+1 , 1),
        operationName:newOperationName,
        machineAndTimes:[]
      }]
    }
    updateJob(jobWithNewOperations);
    setNewOperationName('');
    setAddingNew(false);  
  }

  const addMachineTime = (operationId, newMachineTime) => {
    const updatedOperations = operations.map(op => op.id === operationId ? {
      ...op,
      machineAndTimes: op.machineAndTimes.push(newMachineTime)
    } : op)
    const jobWithNewMachineTime = {
      id: operationId,
      name: name,
      operations: updatedOperations
    }
    updateJob(jobWithNewMachineTime);
  }
  return (
    <div className="kr-card mb-3">
      <h3>{name}</h3>
      <div className="d-flex flex-wrap align-items-center align-self-center">
      {operations.map(js => 
        <>
          <JobOperation
            id={js.id}
            key={js.operationName} 
            operationName={js.operationName} 
            machineAndTimes={js.machineAndTimes}
            machines={machines}
            addMachineTime={addMachineTime}
          />
          <div className="p-3"> -> </div>
        </>
      )}
        { addingNew ? 
        <form className="kr-card" onSubmit={handleSubmit}>
          <TextInput
            id="job-new-input"
            value={newOperationName}
            onChange={(event) => setNewOperationName(event.target.value)}
            label="Enter new Operation"
            smallLabel="You will be able to add possible machines after adding an operation"
            />
          <button type="submit" className="btn btn-primary" disabled={newOperationName === ""}>Add new Operation</button>
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
      { props.jobs.map(jobDef => <Job key={jobDef.name} id={jobDef.id} name={jobDef.name} operations={jobDef.operations} updateJob={props.updateJob} machines={props.machines} />) }
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