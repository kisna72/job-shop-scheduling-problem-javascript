const workercode = () => {
    
    const JSSPProblemInstance = (n,m,mbar) => {
        this.numJobs = n;
        this.numMachines = m;
        this.numMachineType = mbar;
        this.jobs = []; // list of lists.
    }
    
    const JSSPGanttChartSolution = function(schedule){
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
            let max = -Infinity;
            allEnds.forEach(item => {
                if(item > max){
                    max = item
                }
            })
            return max
            //return Math.max(...allEnds)
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
    
        this.JSSP1dToGantt = (jobInstance) => {
            /**
             * Given a 1D solution, convert it into Gantt Chart Solution. 
             * example of 1D solution for m = 5, n = 4 : [0,2,1,0,3,1,0,1,2,3,2,1,1,2,3,0,2,0,3,3]
             */
            const ganttChart = []
            for(let i = 0; i<jobInstance.numMachines; i++){
                ganttChart.push([])
            }
        
            // Next we fill the ganttChart with data based on test1D
            // We need access to the job instance so that we can look at
            
            // Keep Track of last time for each job.
            const lastJobTime = new Array(jobInstance.numJobs).fill(0)
            this.jssp1d.forEach(jobNumber => {
                // job jobNumber is assigned to its respective first. 
                const jobDef = jobInstance.jobs[jobNumber]
                const numberOfMachinesAllowed = jobDef[0]; // 1 -> slice to 2*1 + 1 = 3. 2 slice to 5.
                const sliceEnd = 2*numberOfMachinesAllowed + 1;
                const firstJob = jobDef.splice(0,sliceEnd);
                /** Next up -> we have numberofMachinesallowed say 3. firs job = [3,1,20,3,30,4,50]
                 * We will randomly choose a machine from given machines.
                */
                const jobList = []
                for(let i = 0; i < numberOfMachinesAllowed; i++ ){
                   const unitJob = [firstJob[i*2 + 1], firstJob[i*2 + 2]]
                   jobList.push(unitJob)
                }
                
                const choosenMachineJob = randomFromArray(jobList);
                //const allowedMachinesWithTimeRequirement = firstJob.
                const machine = choosenMachineJob[0]; // In this step randomly choose machine out of available ones.
                const time = choosenMachineJob[1]
        
                // Now fill Gantt Chart
                const firstAvailableTimeOnMachine = ganttChart[machine].length === 0 ? 0 : ganttChart[machine][ganttChart[machine].length -1]
                
                // What is the last time of dependent job? We can find that out dependent jobs by looking at job instance from before...
                const _lastJobTime = lastJobTime[jobNumber]
                const firstAvailableTime = Math.max(_lastJobTime,firstAvailableTimeOnMachine)
                lastJobTime[jobNumber] = firstAvailableTime+time
                
                const ganttSchedule = [jobNumber,firstAvailableTime+1,firstAvailableTime+time ]
                ganttSchedule.forEach(item => ganttChart[machine].push(item))
                
            })
            
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
    
    function randomFromArray(array){
        // Given an array of length l, return a random item.
        const randomIndex = Math.floor(Math.random() * array.length)
        return array[randomIndex] // TODO produce random item.
    }
    
    function generateRandom1D(numMachines, numJobs, base, nswap) {
        if (base){
            // if base is passed in - just do a swap once. nswap not used at the moment.
            function swap(){
                const randi = Math.floor(Math.random() * base.length )
                let randj = Math.floor(Math.random() * base.length )
                while(base[randi] === base[randj]){ // no point in swapping the same number.
                    randj = Math.floor(Math.random() * base.length )
                }
                const randiVal = base[randi]
                base[randi] = base[randj]
                base[randj] = randiVal
            }
            swap()
            return new JSSP1DEncoding(base) // spread to avoid side effects.
        }
        // We want each jobs repetead numMachines of times. 
        let jobs = []
        for(let i = 0;i < numJobs; i++){
            for(let j = 0; j < numMachines; j++){
                jobs.push(i)
            }
        }
        const jssp1d = new JSSP1DEncoding(FishesYatesShuffle(jobs))
        return jssp1d
    };
    function sleep(miliseconds) { 
        /**
         * Evil sleep function used for demoing simulation.
         * Since the example problem I am using solves really fast, I am adding sleep in the thread.
         * TODO >> Actually use setTimeOut to accomplish the same thing so thread isn't running while waiting.
         */
        var currentTime = new Date().getTime();
     
        while (currentTime + miliseconds >= new Date().getTime()) {
        }
     }
     
    function _runOptimizationAlgo(problem, algorithmRepetition, algorithmMaxTimeSecs, algorithmType) {
        let makeSpan = Infinity;
        const algoStartTime = (new Date).getTime();
        const algoMaxEndTime = algoStartTime + (algorithmMaxTimeSecs * 1000)
        const makeSpanHistory = []
        let bestSolution1DEncoded;  // Store the best solution encoded in 1d so far.
        for(let i = 0; i < algorithmRepetition; i ++){
            if( (i%5===0) && (new Date).getTime() > algoMaxEndTime) {
                console.log("Ran for too long already")
                break;
            }
            // alternative
            if( (i%100==0) && (new Date).getTime() > algoMaxEndTime){ //Run time check every 100th run.
                console.log("Ending because of time limit")
                console.log("Ran times : " , i)
                break;
            }
            const randomizedInput = generateRandom1D(problem.numMachineType, problem.numJobs, algorithmType === "hillClimbing" ? bestSolution1DEncoded && bestSolution1DEncoded.jssp1d : null)
            const problemCopy = Object.assign({}, problem)
            problemCopy.jobs = JSON.parse(JSON.stringify(problem.jobs))

            const ganttFromRandInput = randomizedInput.JSSP1dToGantt(problemCopy)
            const newMakeSpan = ganttFromRandInput.getMakeSpan();

            makeSpanHistory.push(newMakeSpan)
            if(i%1  === 0){
                const returnData = {
                    type:'iterationCount',
                    iteration:i+1,
                    newMakeSpan:makeSpanHistory
                }
                this.postMessage(returnData);
                sleep(1*200) // Give UI thread enough time to render this.
                makeSpanHistory.length = 0
            }
            
            // console.log(ganttFromRandInput.schedule[0])
            if(newMakeSpan < makeSpan){
                makeSpan = newMakeSpan
                bestSolution1DEncoded = randomizedInput
                this.postMessage("Got New MakeSpan")
                const returnData = {
                    'type':'newSchedule',
                    'schedule':ganttFromRandInput.schedule,
                    'makeSpan':makeSpan,
                    "minMakeSpanDetectedIteration": i
                }
                this.postMessage(returnData);
                sleep(1*1000)

            }
        }
    }

    onmessage = function(e) {
        const that = this;
        const { problem, algorithmRepetition, algorithmMaxTimeSecs, algorithmType} = e.data; 
        console.log(problem, algorithmMaxTimeSecs);
        _runOptimizationAlgo(problem, algorithmRepetition, algorithmMaxTimeSecs, algorithmType, that)
        var workerResult = 'Received from main: ' + (e.data);
        this.postMessage(workerResult);
    }
};

let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});
const worker_script = URL.createObjectURL(blob);

export default worker_script;
