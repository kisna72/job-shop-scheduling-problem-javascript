const JSSPProblemInstance = require('./definitions/JobShopProblemInstance');
const JSSPGanttChartSolution = require('./definitions/JSSPSolution');
const JSSP1dToGantt = require('./definitions/JSSPSolution');
const generateRandom1D = require('./definitions/helpers');

// Constants that can be changed. Problem is defined in a problem definition file.
const PROBLEM_INSTANCE_FILE = "demo.txt"
const ALGORITHM_REPETITION = 1000
const ALGORITHM_MAX_TIME_MINS = 3 //Max time we want the algo to run.

// Step 1: Create a new instance of JSSPProblemInstance from file.
const problem = new JSSPProblemInstance() // Instantiate with no data. 
problem.generateJSSPFromTextFile(PROBLEM_INSTANCE_FILE)
console.log(problem)
// Step 2: Next, we run the algorithm for a set number of times.
console.log("running optimization algo")
function runOptimizationAlgo(problem){
    let gantt = []
    let makeSpan = Infinity
    // const times = 100
    for(let i = 0; i < ALGORITHM_REPETITION; i ++){
        
        // Create new Job Shop Instance every time. 
        // const a = new JSSPProblemInstance(4,5)
        // a.jobs.push([0,10,1,20,2,20,3,40,4,10])
        // a.jobs.push([1,20,0,10,3,30,2,50,4,30])
        // a.jobs.push([2,30,1,20,4,12,3,40,0,10])
        // a.jobs.push([4,50,3,30,2,15,0,20,1,15])
        // //console.log(a)
        // //console.log("running once")
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