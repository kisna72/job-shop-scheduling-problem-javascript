import React from 'react';
import MainAppNavBar from './mainAppComponents/mainAppNavBar';
/**
 * Main component that handles state of the solver, machines, jobs etc.
 */

class FactoryOptimizationApp extends React.Component {
  constructor(props) {
    super(props)
    // Hold all the state here.
    this.state = {
      activeMenu: 'machine', // machine or jobs or params or solution
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
  handleNavBarClick(choosenMenu){
    console.log(choosenMenu)
  }
  render(){
    return (
      <>
        <MainAppNavBar handleClick={this.handleNavBarClick}/>
        <div>Main App Display here.</div>
      </>
    )
  }
}

export default FactoryOptimizationApp
