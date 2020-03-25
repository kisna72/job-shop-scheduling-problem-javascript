import React from 'react';
import { TextInput } from '../sharedComponents/react/Input';
import '../styles/kr-card.css';
import '../styles/kr-form.css';
/**
 * 
 */
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
      id:2,
      name:this.state.name,
      machines:[]
    })
    this.setState({
      name:''
    })
  }
  render() {
    return (
      <div className="machines-wrapper__categories ml-3 kr-card">

        <h3>Categories</h3>
        <table>
          <thead>
            {this.props.categories.length > 0 && 
              <tr>
                <th>Id</th>
                <th>Name</th>
              </tr>
            }
          </thead>
          <tbody>
            {this.props.categories.map(category => {
              return (
                <tr>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="machines-wrapper__categories--intro">
          Please Enter a new category below. Once saved,
          the categories will appear as a selection option
          in each machine. You'll have to individually apply
          new categories to existing machines.
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
    )
  }
}

export default Categories