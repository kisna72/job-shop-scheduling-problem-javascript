import React from 'react'
function NavBar(props){
    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor:'#34495e'}}>
            <a className="navbar-brand" href="/">Water Bottle Plant Makespan Optimization</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    {props.children}
                </ul>
            </div>
        </nav>
    )
}

function SubNavBar(props){
    return (
        <nav className="navbar navbar-expand-lg navbar-inverse" >
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="/">Random Algorithm <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a disabled className="nav-link" href="/">Neighbourhood search algorithm (Coming Soon)</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export { NavBar, SubNavBar }