import React from 'react';
import MainAppNavBar from './mainAppComponents/mainAppNavBar';
import Machines from './Pages/Machines';
import Categories from './Pages/Categories';
import JobEditor from './Pages/Jobs';
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
      machines: [],
      categories: [],
      jobs: [
        {
          id:1,
          name: 'Spring Water 16oz',
          operations: [
            {
              id:1,
              operationName:'Water Purifying',
              machineAndTimes: [[1,20]] //First sub-job runs on machine 1 for 20 time units.
            },
            {
              id:2,
              operationName:'Bottle Expansion',
              machineAndTimes:  [[1, 10], [2, 30]], // Second sub-job can run on machine 1 for time 10, or machine 2 for time 30
            },
            {
              id:3,
              operationName: 'Water Filling',
              machineAndTimes: [[1, 20], [2, 40]] // Third sub-job can run on machine 1 for unit 20, or machine 2 for unit 40
            }
          ]
        },
        {
          id:6,
          name: 'Mineral Water 16oz',
          operations: []
        }
      ],
      best_schedule: [],
      makeSpan: 150
    }
  }

  componentDidMount(){
    const machines = JSON.parse(localStorage.getItem("machines") || "[]" );
    const categories = JSON.parse(localStorage.getItem("categories") || "[]");
    this.setState({
      machines,
      categories
    })
  }
  componentDidUpdate(){
    localStorage.setItem('machines', JSON.stringify(this.state.machines) )
    localStorage.setItem('categories', JSON.stringify(this.state.categories) )
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
    console.log("new job ", job)
    job.id = this.state.jobs.reduce( (prev, curr) => curr.id >= prev ? curr.id+1 : prev, 1)
    this.setState({
      jobs: [...this.state.jobs, job]
    })
  }
  updateJob = (job) => {
    this.setState({
      jobs: this.state.jobs.map(j => j.id === job.id ? job : j )
    })
  }
  deleteJob = (job) => {
    this.setState({
      jobs: this.state.jobs.filter(j => j.id !== job.id)
    })
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
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-8">
                  <Machines 
                    createMachine={this.createMachine} 
                    updateMachine={this.updateMachine} 
                    deleteMachine={this.deleteMachine}
                    machines={this.state.machines}
                    categories={this.state.categories}
                    />
                </div>
                <div className="col-sm-4">
                  <Categories
                    categories={this.state.categories}
                    machines={this.state.machines}
                    createCategory={this.createCategory}
                    updateCategory={this.updateCategory}
                    deleteCategory={this.deleteCategory}
                  />
                </div>
              </div>
            </div>
          </Route>
          <Route path="/jobs">
            <JobEditor 
              createJob={this.createJob}
              updateJob={this.updateJob}
              deleteJob={this.deleteJob}
              jobs={this.state.jobs}
              machines={this.state.machines}
            />
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
