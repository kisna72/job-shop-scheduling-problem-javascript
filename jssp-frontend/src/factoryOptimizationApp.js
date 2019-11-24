import React from 'react';
import MainAppNavBar from './mainAppComponents/mainAppNavBar';
import Machines from './mainAppComponents/Machines';
import Jobs from './mainAppComponents/Jobs';
import Parameters from './mainAppComponents/Parameters';
/**
 * Main component that handles state of the solver, machines, jobs etc.
 */

class FactoryOptimizationApp extends React.Component {
  constructor(props) {
    super(props)
    // Hold all the state here.
    this.state = {
      activeMenu: 'Machines', // machine or jobs or params or solution
      machines: [
        { id: 1, name: 'Water Bottle Expansion', categories: [1] },
        { id: 2, name: 'Water Cleaning' }
      ],
      categories: [
        { id: 1, name: 'waterBottle' }
      ],
      jobs: [
        {
          name: 'Spring Water 16oz',
          jobSequence: [
            [[1, 20]], //First sub-job runs on machine 1 for 20 time units.
            [[1, 10], [2, 30]], // Second sub-job can run on machine 1 for time 10, or machine 2 for time 30
            [[1, 20], [2, 40]] // Third sub-job can run on machine 1 for unit 20, or machine 2 for unit 40
          ]
        },
        {
          name: 'Mineral Water 16oz',
          jobSequence: [

          ]
        }
      ],
      best_schedule: [],
      makeSpan: 150
    }
  }
  handleNavBarClick = (choosenMenu) => {
    this.setState({
      activeMenu:choosenMenu
    })
    console.log(choosenMenu)
  }

  /**
   * CRUD Operations for machines (minus read obvs)
   */
  createMachine = (machine) => {
    this.setState({
      machines: [...this.state.machines,machine]
    })
  }
  updateMachine = (machine) => {
    // get machine by id and replace its value with the value contained in machine and save in state.
    const machines = this.state.machines
    for(let i; i < machines.length; i++){
      if(machines[i].id === machine.id){
        machines[i] = [...machine]
        break;
      }
    }
    this.setState({
      machines: [...machines]
    })
  }
  deleteMachine = (machine) => {
    const machines = this.state.machines
    for(let i; i < machines.length; i++){
      if(machines[i].id === machine.id){
        delete machines[i]
        break;
      }
    }
    this.setState({
      machines: [...machines]
    })
  }

  /**
   * CRUD Operations for Jobs
   */
  createJob = (job) => {

  }


  render(){
    return (
      <>
        <MainAppNavBar handleClick={this.handleNavBarClick} activeMenu={this.state.activeMenu}/>
        {this.state.activeMenu === "Machines" ? <Machines createMachine updateMachine deleteMachine /> : null}
        {this.state.activeMenu === "Jobs" ? <Jobs /> : null}
        {this.state.activeMenu === "Parameters" ? <Parameters  /> : null}
      </>
    )
  }
}

export default FactoryOptimizationApp
