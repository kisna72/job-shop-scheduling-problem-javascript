/**
 * JSSP Solver
 * 
 * Code below provides a simple API to solve job shop type problems.
 * 
 * Constants: 
 * 1. JSSP Instance Fromat (which is just an array of arrays)
 *    Flexible JSSP Instance follows the same format. Except the array has info about all the 
 *    machines a job can run on, as well as how long it'd take the jobs to run there. 
 * 2. JSSP 1D Instance. 
 * 3. 
 */

function JsspModel() {
    // First Lets define various functions.
    function generateRandomSolution(algorithm, neighbours){
        // if random -> return random.
        // if algorith -> hill climbing, then return a random solution that closely resembles provided args.
        // if nswap parameter is provided -> swap anywhere betwenn 1 - n times.
        return [] // Returns an array of 
    }

    function randomSolutionToGanttChart(solution){
        // variants: simple, a sub job can use multiple machines, a sub job can use multiple jobs but time is machine dependent. 
        // variant: multipe machines per job, and cost depends on what job was run before.
        // complex 2 variant: multiple machines per job, machine dependent job, and allow batching of jobs based on some batching rules.
        // Lets not touch variant 2 for now.....
    }

}


const model = new JSSPModel();
model.selectionAlgorithm = "random" || "stochastic hill climbing" // How does this affect how the selection algo is choosen? 
model.randomGenerator = () => {} // Pass in function that takes args and returns random JSSP Instance. 
model.solve()
