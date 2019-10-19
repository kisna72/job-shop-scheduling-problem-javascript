import React from 'react'
function NavBar(props){
    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <a class="navbar-brand" href="/">Job Shop Problem Demo</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="/">Water Bottle Plant Example <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a disabled="true" class="nav-link" href="/">Plastics Plant Example (coming soon)</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

function SubNavBar(props){
    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="/">Random Algorithm <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a disabled class="nav-link" href="/">Neighbourhood search algorithm (Coming Soon)</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export { NavBar, SubNavBar }