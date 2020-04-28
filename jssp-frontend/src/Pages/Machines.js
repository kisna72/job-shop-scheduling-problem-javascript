import React, { useState } from 'react';
import '../styles/machines.scss';
import { randomID } from '../helpers';
import { TextInput, InlineMultiSelect } from '../sharedComponents/react/Input';
import { FaRegTrashAlt, FaEdit  } from 'react-icons/fa';

/**
 * 
 * @param {{machine:{},categoryOptions:[] }} props 
 */
function MachineRow(props){
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(props.machine.name);
  const [categories, setCategories] = useState(props.machine.categories)

  const handleEditIconClick = function(){
    setEditing(true);
  }

  const handleCancel = function(){
    setEditing(false)
  }
  const handleSave = function(){
    const updatedMachineRow = {id:props.machine.id, name:name, categories:categories}
    console.log("updated machines ",  updatedMachineRow)
    props.updateMachine({id:props.machine.id, name:name, categories:categories})
    setEditing(false)
  }

  const handleCategoryChange = function(categories) {
    console.log("updating categories", categories)
    setCategories(categories);
  }

  if(editing){
    return (
      <tr key={props.machine.id}>
        <td>{props.machine.id}</td>
        <td><input value={name} onChange={(event) => setName(event.target.value)}  /></td>
        <td>
          <InlineMultiSelect 
            onChange={handleCategoryChange}
            allOptions={props.categoryOptions}
            selectedValues={categories} 
            name={`category-select-edit-${props.machine.id}`}
          />
        </td>
        <td>
          <div className="d-flex justify-content-around">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </td>
    </tr>
    )
  }
  const categoryOptionsMap = new Map()
  props.categoryOptions.forEach(catOpt => {
    categoryOptionsMap.set(catOpt.id, catOpt);
  })

  return (
    <tr key={props.machine.id}>
      <td>{props.machine.id}</td>
      <td>{props.machine.name}</td>
      <td>{props.machine.categories.reduce( (prev, cur, idx) => `${prev} ${idx === 0 ? '': ','} ${ categoryOptionsMap.has(cur) ? categoryOptionsMap.get(cur).name : '' }`,'')}</td>
      <td>
          <div className="d-flex justify-content-around">
            <FaEdit onClick={handleEditIconClick}/>
            <FaRegTrashAlt onClick={() => props.deleteCategory(props.category)}/>
          </div>
        </td>
    </tr>
  )
}

class Machines extends React.Component {
  constructor(props){
    super(props) //props gets the machines object.
    this.state = {
      name:'',
      categories:[]
    }
  }
  handleNameChange = (event) => {
    this.setState({name:event.target.value})
  }
  handleCategoryChange = (categoriesSelected) => {
    this.setState({
      categories: categoriesSelected
    })
  }
  addMachine = (event) => {
    event.preventDefault();
    // CODE to call the API. 
    this.props.createMachine({
      name:this.state.name,
      categories:this.state.categories,
      id: randomID()
    });
    
    // Clear the Name and categories
    this.setState({
      name:'',
      categories: []
    })
  }
  render(){
    return (
    <div className="kr-card1">
        <h3>Machines</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <td>Categories</td>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.props.machines.map(machine => <MachineRow machine={machine} updateMachine={this.props.updateMachine} categoryOptions={this.props.categories} />)}
          </tbody>
        </table>
        <div className="kr-card">

          <h3> Add a new machine </h3>
          <form className="" onSubmit={this.addMachine}>
            <TextInput
              id="machine-name" 
              label="Name for your machine"
              smallLabel="Give your machine a recognizable name"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
            <InlineMultiSelect 
              onChange={this.handleCategoryChange} 
              allOptions={this.props.categories}
              selectedValues={this.state.categories}
              name="category-select-new"
            />
            <button type="submit" className="btn btn-primary mb-2" disabled={this.state.name === "" }>Add Machine</button>
          </form>
        </div>
      
    </div>)
  }
}

export default Machines 
