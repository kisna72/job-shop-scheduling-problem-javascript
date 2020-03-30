import React, { useState } from 'react';
import { TextInput } from '../sharedComponents/react/Input';
import { FaRegTrashAlt, FaEdit  } from 'react-icons/fa';
import '../styles/kr-card.css';
import '../styles/kr-form.css';

/**
 * Handles Showing Category in a Table Row. Also Handles deleting and Editing based on user input. 
 * @param {{category:{id:string,name:string},updateCategory:function, deleteCategory: function }} props 
 */
function CategoryRow(props){
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(props.category.name); // For Managing state during editing 

  const handleEditIconClick = function(){
    setEditing(true)
  }
  const handleChangeWhenEditing = function(event){
    setName(event.target.value)
  }
  const handleSave = function(){
    props.updateCategory({
      ...props.category,
      name
    })
    setEditing(false)
  }
  const handleCancel = function () {
    setEditing(false)
  }


  if(editing){
    return (
      <tr key={props.category.id}>
      <td>{props.category.id}</td>
      <td>
        <input value={name} onChange={handleChangeWhenEditing}>
        </input>
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

  return (
    <tr key={props.category.id}>
        <td>{props.category.id}</td>
        <td>{props.category.name}</td>
        <td>
          <div className="d-flex justify-content-around">
            <FaEdit onClick={handleEditIconClick}/>
            <FaRegTrashAlt onClick={() => props.deleteCategory(props.category)}/>
          </div>
        </td>
      </tr>
  )
}

class Categories extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name:''
    }
  }
  handleChange = (event) =>{
    this.setState({
      name:event.target.value
    })
    console.log(event.target.value)
  }
  handleSubmit = (event) => {
    event.preventDefault()
    this.props.createCategory({
      name:this.state.name,
      machines:[]
    })
    this.setState({
      name:''
    })
  }
  render() {
    return (
      <div className="machines-wrapper__categories kr-card2">
        <h3>Tags</h3>
        <table className="table">
          <thead>
            {this.props.categories.length > 0 && 
              <tr>
                <th>Id</th>
                <th>Name</th>
                <td>Actions</td>
              </tr>
            }
          </thead>
          <tbody>
            {this.props.categories.map(category => <CategoryRow category={category} updateCategory={this.props.updateCategory} deleteCategory={this.props.deleteCategory}/>)}
          </tbody>
        </table>
        <div className="kr-card">

        <p className="machines-wrapper__categories--intro">
          Please Enter a new tag below. Once saved,
          the tags will appear as a selection option
          in each machine. You'll have to individually apply
          new tags to existing machines.
        </p>
        <form onSubmit={this.handleSubmit}>
          <TextInput
            id="category-input"
            value={this.state.name}
            onChange={this.handleChange}
            label="Enter new category"
            smallLabel="You will be able to apply each category to multiple machines"
            />
          <button type="submit" className="btn btn-primary" disabled={this.state.name === ""}>Add Category</button>
        </form>
        </div>
      </div>
    )
  }
}

export default Categories