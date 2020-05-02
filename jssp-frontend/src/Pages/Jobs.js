import React, { useState, useEffect } from "react";
import { TextInput } from '../sharedComponents/react/Input';
import { FaRegTrashAlt  } from 'react-icons/fa';

/**
 * Display a Job Operation
 * @param {{id:number, operationName:string, machineAndTimes:[[id:number,time:number]], machines:[], updateOperation:function }} props 
 */
function JobOperation(props) {
  const [addingMachine, setAddingMachine]= useState(false);
  const [selectedMachine, setSelectedMachine] = useState(props.machines.length > 0 ? props.machines[0].id  : undefined);
  const [machineTime, setMachineTime] = useState(0);

  useEffect(() => {
    const initialMachineSelection = props.machines.length > 0 ? props.machines[0].id  : undefined
    setSelectedMachine(initialMachineSelection)
  }, [props.machines])
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const newMachineTime = [selectedMachine, machineTime]
    const {machines, updateOperation, ...op} = props
    const updatedOperation = {
      ...op,
      machineAndTimes:[...props.machineAndTimes, newMachineTime]
    }
    updateOperation(updatedOperation);
    setMachineTime(0);
    setAddingMachine(false);
  }
  
  const handleDeleteIconClick = (idx) => {
    console.log("deleting ", idx)
    const newMachineAndTimes = props.machineAndTimes.filter( (v, i) => i !== idx)
    const {machines, updateOperation, ...op} = props
    const updatedOperation = {
      ...op,
      machineAndTimes:newMachineAndTimes
    }
    updateOperation(updatedOperation);
  }

  return (
    <div className="kr-card mb-2">
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
          {props.machineAndTimes.map( (mt, idx, arr) => {
            return <tr key={idx}>
              <td>{mt[0]}</td>
              <td>{mt[1]}</td>
              <td>
                <div className="d-flex justify-content-around">
                  {/* <FaEdit onClick={handleEditIconClick}/> */}
                  <FaRegTrashAlt onClick={() => handleDeleteIconClick(idx) }/>
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
function Job(props) {
  const {id, name,operations,updateJob,machines} = props;

  const [newOperationName, setNewOperationName] = useState('');
  const [addingNew, setAddingNew] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    // Add Operation to the Job, and send a update
    const jobWithNewOperations = {
      id: id,
      name: name,
      operations: [...operations, {
        id: operations.reduce( (prev, cur) => cur.id <= prev ? prev+1 : cur.id+1 , 1),
        operationName:newOperationName,
        machineAndTimes:[]
      }]
    }
    updateJob(jobWithNewOperations);
    setNewOperationName('');
    setAddingNew(false);  
  }

  const updateOperation = (operation) => {
    // Create a new copy of operation here.
    const newOperations = operations.map( op => op.id === operation.id ? operation : op)
    const {machines, updateJob, ...oldJob} = props
    const jobWithUpdatedOperation = {
      ...oldJob,
      operations:newOperations
    }
    updateJob(jobWithUpdatedOperation);
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
            updateOperation={updateOperation}
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