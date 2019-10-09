const JSSPProblemInstance = require('./definitions/JobShopProblemInstance');
const JSSPGanttChartSolution = require('./definitions/JSSPSolution');
const JSSP1dToGantt = require('./definitions/JSSPSolution');
const generateRandom1D = require('./definitions/helpers');

// Constants that can be changed. Problem is defined in a problem definition file.
const PROBLEM_INSTANCE_FILE = "demo.txt"
const ALGORITHM_REPETITION = 1000000
const ALGORITHM_MAX_TIME_SECONDS = 1  //Max time we want the algo to run. TODO use timelimit

// Step 1: Create a new instance of JSSPProblemInstance from file.
const problem = new JSSPProblemInstance() // Instantiate with no data. 
problem.generateJSSPFromTextFile(PROBLEM_INSTANCE_FILE)
// console.log(problem)
// Step 2: Next, we run the algorithm for a set number of times.
// console.log("running optimization algo")
function runOptimizationAlgo(problem){
    let gantt = []
    let makeSpan = Infinity
    // const times = 100
    const algoStartTime = (new Date).getTime();
    const algoMaxEndTime = algoStartTime + (ALGORITHM_MAX_TIME_SECONDS * 1000)
    for(let i = 0; i < ALGORITHM_REPETITION; i ++){
        if( (new Date).getTime() > algoMaxEndTime){
            console.log("ENding for time")
            console.log("Ran times : " , i)
            break;

        }
        const randomizedInput = generateRandom1D(problem.numMachines, problem.numJobs)
        //console.log("randomized input " , randomizedInput)
        const problemCopy = Object.assign({}, problem)
        problemCopy.jobs = JSON.parse(JSON.stringify(problem.jobs))
        //console.log("gantt is generate from rand input...")
        //console.log("Problem Copy is ", problemCopy)
        const ganttFromRandInput = randomizedInput.JSSP1dToGantt(problemCopy)
        //JSSP1dToGantt(problemCopy, randomizedInput.jssp1d);
        const newMakeSpan = ganttFromRandInput.getMakeSpan();
        if(newMakeSpan < makeSpan){
            makeSpan = newMakeSpan
            gantt = ganttFromRandInput
            // console.log("Found Better")
            console.log("New Make Span " , newMakeSpan)
            // console.log(gantt)
            // console.log("============")
        }
    }
    return gantt
    console.log(gantt)
}

const best = runOptimizationAlgo(problem)
console.log("Best Gantt Chart is ")
console.log(best)