import React from 'react';
import '../styles/machines.scss';
import { randomID } from '../helpers';
import { TextInput } from '../sharedComponents/react/Input';

class Machines extends React.Component {
  constructor(props){
    super(props) //props gets the machines object.
    this.state = {
      name:''
    }
  }
  handleChange = (event) => {
    this.setState({name:event.target.value})
  }
  addMachine = (event) => {
    event.preventDefault();
    // CODE to call the API. 
    this.props.createMachine({
        name:this.state.name, 
        id: randomID()
      },     
      this.setState({
        name:''
      })
    );

    console.log("Submitting a new machine with name ", this.state.name)
  }
  render(){
    return (
    <div className="machines-wrapper">
      <div className="machines-wrapper__main">
        <h3 className="machines-wrapper__main__title">Machines</h3>
        <table>
          <tbody>
            {this.props.machines.map(machine => {
              return (
                <tr>
                  <td>{machine.id}</td>
                  <td>{machine.name}</td>
                </tr>)
            })}
          </tbody>
        </table>
        <p>
          Please enter the machine below. Each machine must have a name.
          Once all machines are entered, you can create categories and apply categories to each machines.
        </p>
        <form class="" onSubmit={this.addMachine}>
          <TextInput
            id="machine-name" 
            label="Name for your machine"
            smallLabel="Give your machine a recognizable name"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <button type="submit" class="btn btn-primary mb-2" disabled={this.state.name === "" }>Add Machine</button>
        </form>
      </div>
    </div>)
  }
}

export default Machines 
