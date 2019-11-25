import React from 'react';
import '../styles/machines.scss';

class Machines extends React.Component {
  constructor(props){
    super(props) //props gets the machines object.
  }
  render(){
    return (
    <div className="machines-wrapper">
      <div className="machines-wrapper__main">
        <p>
          Please enter the machine below. Each machine must have a name.
          Applying categories is optional. You will assign jobs 
        </p>
        <form className="machine-form">
          <input className="form-control" name='name' placeholder='Please Enter Machine name'></input>
          <select className="form-control" name='category'>
            <option>Category 1</option>
            <option>Category 2</option>
          </select>
        </form>
        <button>Add New Machine</button>
      </div>
      <div className="machines-wrapper__categories">
        <p className="machines-wrapper__categories--intro">
          Please Enter a new category below. Once saved,
          the categories will appear as a selection option
          in each machine. You'll have to individually apply
          new categories to existing machines.
        </p>
        <form>
          <input className="form-control" name='category' placeholder='Enter a new Category'></input>
        </form>
      </div>
    </div>)
  }
}

export default Machines 
