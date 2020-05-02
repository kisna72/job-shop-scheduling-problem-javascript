import React from 'react';
import '../styles/navbar.scss';

function MainAppNavBar(props){
  const menuItems =  ['Machines','Jobs','Parameters','Solution']
  console.log(props)
  return (
    <nav>
      <ul className='factory-navbar'>
      {menuItems.map(menu => {
        const activeClass = menu === props.activeMenu ? 'active' : ''
        console.log("activeClass " , activeClass)
        return <> 
          <li className='factory-navbar__menu-item' onClick={() => props.handleClick(menu)}>{menu}</li> 
          <span className={`factory-navbar__right-arrow ${activeClass}`}></span>
        </>
      })}
      </ul>
    </nav>
  )
}

export default MainAppNavBar
