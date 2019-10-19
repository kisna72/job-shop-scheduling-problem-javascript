
const workercode = () => {
    
    function JSSPProblemInstance(n,m){
        this.numJobs = n;
        this.numMachines = m
        this.jobs = []; // list of lists.
    }
    
    function JSSPGanttChartSolution(schedule){
        /**
         * Gantt Chart looks like this:
         * [
         *  [jobId,StartTime,EndTime,jobId,StartTime,EndTime,...]   -> for Machine with Index 0 
         *  [jobId,StartTime,EndTime,...]   -> for Machine with Index 1
         * ]
         * It is useful to have GanttChart in this format because it lets us 
         * read the ganttChart in text format without any special help.
         */
        this.schedule = schedule
        this.getMakeSpan = ()=>{
            /**
             * Calculates MakeSpan of an instance of a JSSP Gantt Chart Solution
             * In our definition of ganttChart, we choose last integer of each array if array>0. 
             * and return max of them
             */
            const allEnds = this.schedule.map(arrForMachine => {
                if(!arrForMachine.length || arrForMachine.length === 0){
                    return 0
                }
                return arrForMachine[arrForMachine.length -1 ]
            });
            return Math.max(...allEnds)
        }
    }
    
    
    function JSSP1DEncoding(jobs1d){
        /**
         * Most JSSP problems have way too many ways to run, we need to generate options randomly
         * Since randomly generating options is harder in  2d array while meeting all the constraints
         * we will use a 1D Encoding. We also have functions to convert this into Gantt Chart. 
         * 
         * This can be represented as a singe array as well.
         */
        this.jssp1d = jobs1d
        // Example jssp1d = [0,2,1,0,3,1,0,1,2,3,2,1,1,2,3,0,2,0,3,3]
    
        this.JSSP1dToGantt = (jobInstance) => {
            /**
             * Given a 1D solution, convert it into Gantt Chart Solution. 
             */
            //const test1D = [0,2,1,0,3,1,0,1,2,3,2,1,1,2,3,0,2,0,3,3]
            // const test1D =[0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3]
            // const m = 5 // Number of Machines: 0,1,2,3,4,5
            // const n = 4 // Number of Jobs. 0,1,2,3 -> as denoted in the 1d strucutre. 
            const ganttChart = []
            for(let i = 0; i<jobInstance.numMachines; i++){
                ganttChart.push([])
            }
            //console.log(ganttChart)
        
            // Next we fill the ganttChart with data based on test1D
            // We need access to the job instance so that we can look at
            
            // Keep Track of last time for each job.
            const lastJobTime = new Array(jobInstance.numJobs).fill(0)
            // console.log("Last Job Time", lastJobTime)
        
            //console.log(jobInstance)
            this.jssp1d.forEach(jobNumber => {
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
    
            return new JSSPGanttChartSolution(ganttChart)
        }
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
    
    function generateRandom1D(numMachines, numJobs) {
        // We want each jobs repetead numMachines of times. 
        let jobs = []
        for(let i = 0;i < numJobs; i++){
            const values = new Array(numMachines).fill(i) // Fill with Job Number 
            jobs = [...jobs, ...values]
        }
        const jssp1d = new JSSP1DEncoding(FishesYatesShuffle(jobs))
        return jssp1d
        console.log(jobs)
    };
    function _runOptimizationAlgo(problem, algorithmRepetition, algorithmMaxTimeSecs, context) {
        let makeSpan = Infinity;
        const algoStartTime = (new Date).getTime();
        const algoMaxEndTime = algoStartTime + (algorithmMaxTimeSecs * 1000)
        for(let i = 0; i < algorithmRepetition; i ++){
            if(i%100  === 0){
                const returnData = {
                    type:'iterationCount',
                    value:i+1
                }
                this.postMessage(returnData);
                
            }
            if( (i%100==0) && (new Date).getTime() > algoMaxEndTime){ //Run time check every 100th run.
                console.log("Ending because of time limit")
                console.log("Ran times : " , i)
                break;
            }
            const randomizedInput = context.generateRandom1D(problem.numMachines, problem.numJobs)
            const problemCopy = Object.assign({}, problem)
            problemCopy.jobs = JSON.parse(JSON.stringify(problem.jobs))

            const ganttFromRandInput = randomizedInput.JSSP1dToGantt(problemCopy)
            const newMakeSpan = ganttFromRandInput.getMakeSpan();
            
            // console.log(ganttFromRandInput.schedule[0])
            if(newMakeSpan < makeSpan){
                makeSpan = newMakeSpan
                // gantt = ganttFromRandInput
                console.log("Found Better", ganttFromRandInput)
                console.log("New Make Span at index ", i, newMakeSpan)
                this.postMessage("Got New MakeSpan")
                const returnData = {
                    'type':'newSchedule',
                    'schedule':ganttFromRandInput.schedule,
                    'makeSpan':makeSpan
                }
                this.postMessage(returnData)
                // this.setState({
                //   schedule:ganttFromRandInput.schedule,
                //   makeSpan:makeSpan
                // })
            }
        }
    }

    onmessage = function(e) {
        console.log('Message received from main script');
        console.log("message", e);
        const { problem, algorithmRepetition, algorithmMaxTimeSecs} = e.data; 
        console.log(problem, algorithmMaxTimeSecs);
        _runOptimizationAlgo(problem, algorithmRepetition, algorithmMaxTimeSecs, this)
        var workerResult = 'Received from main: ' + (e.data);
        console.log('Posting message back to main script');
        this.postMessage(workerResult);
    }
};

let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});
const worker_script = URL.createObjectURL(blob);

export default worker_script;
//module.exports = worker_script;


// const runOptimizationAlgo = (problem, algorithmRepetition, algorithmMaxTimeSecs, workerInstance ) => {
//     // let gantt = []
//     let { makeSpan } = this.state
//     // const times = 100
//     const algoStartTime = (new Date).getTime();
//     const algoMaxEndTime = algoStartTime + (algorithmMaxTimeSecs * 1000)
//     for(let i = 0; i < algorithmRepetition; i ++){
//       console.log("running algo")
//       workerInstance.postMessage(`Iteration : ${i}`)
//         if( (i%100==0) && (new Date).getTime() > algoMaxEndTime){ //Run time check every 100th run.
//             console.log("Ending because of time limit")
//             console.log("Ran times : " , i)
//             break;
//         }
//         const randomizedInput = generateRandom1D(problem.numMachines, problem.numJobs)
//         const problemCopy = Object.assign({}, problem)
//         problemCopy.jobs = JSON.parse(JSON.stringify(problem.jobs))

//         const ganttFromRandInput = randomizedInput.JSSP1dToGantt(problemCopy)
//         const newMakeSpan = ganttFromRandInput.getMakeSpan();
        
//         // console.log(ganttFromRandInput.schedule[0])
//         if(newMakeSpan < makeSpan){
//             makeSpan = newMakeSpan
//             // gantt = ganttFromRandInput
//             //console.log("Found Better", ganttFromRandInput)
//             console.log("New Make Span at index ", i, newMakeSpan)
//             workerInstance.postMessage("Got New MakeSpan")
//             workerInstance.postMessage(makeSpan)
//             // this.setState({
//             //   schedule:ganttFromRandInput.schedule,
//             //   makeSpan:makeSpan
//             // })
//         }
//     }
// }