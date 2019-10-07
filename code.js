/**
 * Problem Instance
 * Data structure that will hold JSSP data type.
 * Follows open source JSSP format.
 */
function JSSPProblemInstance(m,n){
    this.m = m
    this.n = n;
    this.jobs = []; // list of lists.
}

const demoinstance = `
+++++++++++++++++++++++
A simple Demo
4 5
0 10 1 20 2 20 3 40 4 10
1 20 0 10 3 30 2 50 4 30
2 30 1 20 4 12 3 40 0 10
4 50 3 30 2 15 0 20 1 15
++++++++++++++++++++++++
`
const a = new JSSPProblemInstance(4,5)
a.jobs.push([0,10,1,20,2,20,3,40,4,10])
a.jobs.push([1,20,0,10,3,30,2,50,4,30])
a.jobs.push([2,30,1,20,4,12,3,40,0,10])
a.jobs.push([4,50,3,30,2,15,0,20,1,15])
console.log(a)

/**
 * SOlution Space
 * Solution Space for JSSP represents Gantt Chart to show what jobs to run on what machines and in what order. 
 * Looks like follows:
 * [
 *  [] //Job ORder for Machine 1.
 *  [] // Job order for Machine 2 and so on....
 * ]
 */
function JSSPGanttChartSolution(){
    this.schedule = []
}

/**
 * Calculates MakeSpan of an instance of a JSSP Gantt Chart Solution
 * In our definition of ganttChart, we choose last integer of each array if array>0. 
 * and return max of them
 */
function getMakeSpan(ganttChartSolution){
    return Math.max(ganttChartSolution.map(arrForMachine => {
        if(arrForMachine.lenth > 0){
            return arrForMachine[-1]
        } else {
            return 0
        }
    }));
}

/**
 * Given a 1D solution, convert it into Gantt Chart Solution. 
 */
function JSSP1dToGantt(jobInstance, test1D){
    //const test1D = [0,2,1,0,3,1,0,1,2,3,2,1,1,2,3,0,2,0,3,3]
    // const test1D =[0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3]
    const m = 5 // Number of Machines: 0,1,2,3,4,5
    const n = 4 // Number of Jobs. 0,1,2,3 -> as denoted in the 1d strucutre. 
    const ganttChart = []
    for(let i = 0; i<m; i++){
        ganttChart.push([])
    }
    //console.log(ganttChart)

    // Next we fill the ganttChart with data based on test1D
    // We need access to the job instance so that we can look at
    
    // Keep Track of last time for each job.
    const lastJobTime = new Array(jobInstance.n).fill(0)
    // console.log("Last Job Time", lastJobTime)

    //console.log(jobInstance)
    test1D.forEach(jobNumber => {
        // job jobNumber is assigned to its respective first. 
        const jobDef = jobInstance.jobs[jobNumber]
        // console.log("job def is", jobDef);
        // Get the first one out.
        const firstJob = jobDef.splice(0,2);
        // console.log(`Current Job for Job Number ${jobNumber}  :` ,firstJob)
        const machine = firstJob[0];
        const time = firstJob[1]

        // Now fill Gantt Chart
        const firstAvailableTimeOnMachine = ganttChart[machine].length === 0 ? 0 : ganttChart[machine][ganttChart[machine].length -1]
        // What is the last time of dependent job? We can find that out dependent jobs by looking at job instance from before...
        
        const _lastJobTime = lastJobTime[jobNumber]
        const firstAvailableTime = Math.max(_lastJobTime,firstAvailableTimeOnMachine)
        lastJobTime[jobNumber] = firstAvailableTime+time
        
        const ganttSchedule = [jobNumber,firstAvailableTime+1,firstAvailableTime+time ]
        ganttChart[machine] = [...ganttChart[machine], ...ganttSchedule]
    })

    //console.log(ganttChart)


    return ganttChart
}
/**
 * Generating MakeSpan is basically calculating Max of the end index of all times from all machines
 * @param {*} ganttChart 
 */
function getMakeSpan(ganttChart){
    return Math.max(...ganttChart.map(machineInfo => machineInfo[machineInfo.length -1 ]));
}

function FishesYatesShuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}
  

/**
 * Our Random Algorithm will 
 */
console.log("running optimization algo")
function runOptimizationAlgo(m,n){
    const startingInput = [0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3]
    let gantt = []
    let makeSpan = Infinity
    const times = 100
    for(let i = 0; i < times; i ++){
        // Create new Job Shop Instance every time. 
        const a = new JSSPProblemInstance(4,5)
        a.jobs.push([0,10,1,20,2,20,3,40,4,10])
        a.jobs.push([1,20,0,10,3,30,2,50,4,30])
        a.jobs.push([2,30,1,20,4,12,3,40,0,10])
        a.jobs.push([4,50,3,30,2,15,0,20,1,15])
        //console.log(a)
        //console.log("running once")
        const randomizedInput = FishesYatesShuffle(startingInput)
        //console.log("randomized input " , randomizedInput)
        const gantFromRandInput = JSSP1dToGantt(a, randomizedInput);
        const newMakeSpan = getMakeSpan(gantFromRandInput);
        if(newMakeSpan < makeSpan){
            makeSpan = newMakeSpan
            gantt = gantFromRandInput
            console.log("Found Better")
            console.log(gantt)
            console.log("============")
        }
    }
    return gantt
    console.log(gantt)
}

const best = runOptimizationAlgo()
console.log("Best Gantt Chart is ")
console.log(best)