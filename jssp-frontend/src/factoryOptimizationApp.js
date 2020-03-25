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
    machine.id = this.state.machines.length + 1
    this.setState({
      machines: [...this.state.machines,machine]
    })
  }
  updateMachine = (machine) => {
    this.setState({
      machines: this.state.machines.map(mac => mac.id === machine.id ? machine : mac)
    })
  }
  deleteMachine = (machine) => {
    this.setState({
      machines: this.state.machines.filter(mac => mac.id !==  machine.id)
    })
  }

  /**
   * CRUD Operations for Categories
   */
  createCategory = (category) => {
    category.id = this.state.categories.reduce((prev,cur) => cur.id + 1, 1)
    this.setState({
      categories: [...this.state.categories, category]
    })
  }
  updateCategory = (category) => {
    this.setState({
      categories: this.state.categories.map(cat => cat.id === category.id ? category : cat)
    })
  }
  deleteCategory = (category) => {
    console.log("deleting ", category)
    this.setState({
      categories: this.state.categories.filter(cat => cat.id !== category.id)
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
            <Categories
              categories={this.state.categories}
              machines={this.state.machines}
              createCategory={this.createCategory}
              updateCategory={this.updateCategory}
              deleteCategory={this.deleteCategory}
            />
            <Machines 
              createMachine={this.createMachine} 
              updateMachine={this.updateMachine} 
              deleteMachine={this.deleteMachine}
              machines={this.state.machines}
              categories={this.state.categories}
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
