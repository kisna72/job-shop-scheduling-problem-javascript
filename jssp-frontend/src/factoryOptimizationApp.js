import React from 'react';
import MainAppNavBar from './mainAppComponents/mainAppNavBar';
import Machines from './Pages/Machines';
import Categories from './Pages/Categories';
import Jobs from './mainAppComponents/Jobs';
import Parameters from './mainAppComponents/Parameters';
import JobSetup from './JobSetup';
import App from './App';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";
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
        { id: 1, name: 'Water Bottle Expansion'},
        { id: 2, name: 'Water Cleaning' }
      ],
      categories: [
        { id: 1, name: 'Expansion', machines:[]}
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
   * 
   */
  createMachine = async (machine) => {
    await this.setState({
      machines: [...this.state.machines,machine]
    })
  }
  updateMachine = (machine) => {
    // get machine by id and replace its value with the value contained in machine and save in state.
    const machines = this.state.machines
    for(let i =0 ; i < machines.length; i++){
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
    for(let i =0; i < machines.length; i++){
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
   * CRUD Operations for Categories
   */
  createCategory = (category) => {
    this.setState({
      categories: [...this.state.categories, category]
    })
    console.log(category)
  }
  updateCategory = (category) => {
    // get machine by id and replace its value with the value contained in machine and save in state.
    const categories = [...this.state.categories]
    for(let i =0 ; i < categories.length; i++){
      if(categories[i].id === category.id){
        categories[i] = [...category]
        break;
      }
    }
    this.setState({
      categories: [...categories]
    })
    
  }

  /**
   * CRUD Operations for Jobs
   */
  createJob = (job) => {
    console.log("create job")
  }


  render() {
    return (
      <Router>
        <nav>
          <ul className='factory-navbar'>
            <NavLink to="">
              <li className='factory-navbar__menu-item'>Machines</li> 
            </NavLink>
            <NavLink to="jobs">
              <li className='factory-navbar__menu-item'>Jobs</li> 
            </NavLink>
            <NavLink to="parameters">
              <li className='factory-navbar__menu-item'>Solution Parameters</li> 
            </NavLink>
            <NavLink to="solution">
              <li className='factory-navbar__menu-item'>Solve</li> 
            </NavLink>
          </ul>
        </nav>
        <Switch>
          <Route path="/" exact={true}>
            <Machines 
              createMachine={this.createMachine} 
              updateMachine={this.updateMachine} 
              deleteMachine={this.deleteMachine}
              machines={this.state.machines}
            />
            <Categories
              categories={this.state.categories}
              machines={this.state.machines}
              createCategory={this.createCategory}
            />
          </Route>
          <Route path="/jobs">
            <Jobs />
          </Route>
          <Route path="/parameters">
            <Parameters  />
          </Route>
          <Route path="/solution">
            <App/>
          </Route>
        </Switch>
      </Router>
    )
  }
};

export default FactoryOptimizationApp
