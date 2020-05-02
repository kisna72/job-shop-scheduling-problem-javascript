import React from 'react';
import Machines from './Pages/Machines';
import Categories from './Pages/Categories';
import JobEditor from './Pages/Jobs';
import Parameters from './mainAppComponents/Parameters';
import "./styles/util.scss";
import './styles/navbar.scss';
import App from './App';
import {
  BrowserRouter as Router,
  Switch,
  Route,
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
      jobs: [],
      best_schedule: [],
      makeSpan: 150
    }
  }

  componentDidMount(){
    const jobsStr = '[{"id":1,"name":"Spring Water 16oz","operations":[{"id":1,"operationName":"Bottle Expansion","machineAndTimes":[[1,"10"],["6","20"]]},{"id":2,"operationName":"Water Purifying","machineAndTimes":[["2","10"]]},{"id":3,"operationName":"Water Filling","machineAndTimes":[["3","10"]]},{"id":4,"operationName":"Bottle Capping","machineAndTimes":[["4","10"]]},{"id":5,"operationName":"Bottle Labeling","machineAndTimes":[["5","8"]]},{"id":6,"operationName":"Bottle Labeling 2","machineAndTimes":[["5","10"]]},{"id":7,"operationName":"Bottle Labeling 3","machineAndTimes":[["5","10"]]}]},{"id":2,"name":"Distilled Water 16oz","operations":[{"id":1,"operationName":"Bottle Expansion","machineAndTimes":[[1,"50"],["6","30"]]},{"id":2,"operationName":"Water Purifying","machineAndTimes":[["2","15"]]},{"id":3,"operationName":"Water Filling","machineAndTimes":[["3","10"]]},{"id":4,"operationName":"Bottle Capping","machineAndTimes":[["4","10"]]}]},{"id":3,"name":"Distilled Water 32oz","operations":[{"id":1,"operationName":"Bottle Expansion ","machineAndTimes":[[1,"30"],["6","50"]]},{"id":2,"operationName":"Water Purifying","machineAndTimes":[["2","12"]]},{"id":3,"operationName":"Water Filling","machineAndTimes":[["3","20"]]},{"id":4,"operationName":"Bottle Capping","machineAndTimes":[["4","10"]]},{"id":5,"operationName":"Bottle Labeling","machineAndTimes":[["5","16"]]}]},{"id":4,"name":"Bottle Water 32oz","operations":[{"id":1,"operationName":"Bottle Expansion ","machineAndTimes":[[1,"15"],["6","20"]]},{"id":2,"operationName":"Water Purifying","machineAndTimes":[["2","30"]]},{"id":3,"operationName":"Water Filling","machineAndTimes":[["3","20"]]},{"id":4,"operationName":"Bottle Capping","machineAndTimes":[["4","10"]]},{"id":5,"operationName":"Bottle Labeling","machineAndTimes":[["5","10"]]}]}]'
    const machinesStr = '[{"name":"Bottle Expansion Mold Machine","categories":[],"id":1},{"name":"Water Cleaning Machine","categories":[],"id":2},{"name":"Water Filling Machine","categories":[],"id":3},{"name":"Bottle Capping Machine","categories":[],"id":4},{"name":"Bottle Labeling Machine","categories":[],"id":5},{"name":"Bottle Expansion Mold Machine 2","categories":[],"id":6}]'
    const machines = JSON.parse(localStorage.getItem("machines") || machinesStr );
    const categories = JSON.parse(localStorage.getItem("categories") || "[]" );
    const jobs = JSON.parse(localStorage.getItem("jobs") || jobsStr);
    this.setState({
      machines,
      categories,
      jobs
    })
  }
  componentDidUpdate(){
    localStorage.setItem('machines', JSON.stringify(this.state.machines) )
    localStorage.setItem('categories', JSON.stringify(this.state.categories) )
    localStorage.setItem('jobs', JSON.stringify(this.state.jobs) )
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
    const _machine = {
      ...machine, 
      id: this.state.machines.length + 1
    }
    this.setState({
      machines: [...this.state.machines,_machine]
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
      <Router basename={process.env.PUBLIC_URL}>
        <nav className='factory-navbar d-flex justify-content-between'>          
          <div className="ml-2 navbar-brand text-white">Water Bottling Plant Makespan Optimization</div>
          <ul className="d-flex mr-5">
            <NavLink to="machines">
              <li className='factory-navbar__menu-item'>Machines</li> 
            </NavLink>
            <NavLink to="jobs">
              <li className='factory-navbar__menu-item'>Jobs</li> 
            </NavLink>
            <NavLink to="/" exact>
              <li className='factory-navbar__menu-item'>Solve</li> 
            </NavLink>
          </ul>
        </nav>
        <Switch>
          <Route path="/machines" exact={true}>
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
          <Route path="/jobs"  exact={true}>
            <JobEditor 
              createJob={this.createJob}
              updateJob={this.updateJob}
              deleteJob={this.deleteJob}
              jobs={this.state.jobs}
              machines={this.state.machines}
            />
          </Route>
          <Route path="/parameters"  exact={true}>
            <Parameters  />
          </Route>
          <Route path="" exact={true}>
            <App
              jobs={this.state.jobs}
              machines={this.state.machines}
            />
          </Route>

        </Switch>
      </Router>
    )
  }
};

export default FactoryOptimizationApp
