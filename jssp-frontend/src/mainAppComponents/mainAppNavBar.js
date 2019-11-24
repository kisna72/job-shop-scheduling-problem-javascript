import React from 'react';
import '../styles/navbar.scss';

function MainAppNavBar(props){
  const menuItems =  ['Machines','Jobs','Optimization Parameters','Solution']
  return (
    <nav>
      <ul className='factory-navbar'>
        {menuItems.map(menu => <li className='factory-navbar__menu-item' onClick={() => props.handleClick(menu)}>{menu}</li> )}
      </ul>
    </nav>
  )
}

export default MainAppNavBar
