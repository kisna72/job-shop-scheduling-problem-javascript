const workercode = () => {
    /**
     * Compiled Code -> ES3
     */
    // var __assign = (this && this.__assign) || function () {
    //     __assign = Object.assign || function(t) {
    //         for (var s, i = 1, n = arguments.length; i < n; i++) {
    //             s = arguments[i];
    //             for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
    //                 t[p] = s[p];
    //         }
    //         return t;
    //     };
    //     return __assign.apply(this, arguments);
    // };
    // var __spreadArrays = function () {
    //     for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    //     for (var r = Array(s), k = 0, i = 0; i < il; i++)
    //         for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
    //             r[k] = a[j];
    //     return r;
    // };
    var ResourceTypeEnum;
    (function (ResourceTypeEnum) {
        ResourceTypeEnum[ResourceTypeEnum["MACHINE"] = 0] = "MACHINE";
        ResourceTypeEnum[ResourceTypeEnum["PERSON"] = 1] = "PERSON";
    })(ResourceTypeEnum || (ResourceTypeEnum = {}));
    var ComplexOperationTypeEnum;
    (function (ComplexOperationTypeEnum) {
        ComplexOperationTypeEnum[ComplexOperationTypeEnum["SIMPLE"] = 0] = "SIMPLE";
        ComplexOperationTypeEnum[ComplexOperationTypeEnum["CAN_RUN_IN_PARALLEL"] = 1] = "CAN_RUN_IN_PARALLEL";
        ComplexOperationTypeEnum[ComplexOperationTypeEnum["CAN_RUN_IN_MULTIPLE_MACINES"] = 2] = "CAN_RUN_IN_MULTIPLE_MACINES";
    })(ComplexOperationTypeEnum || (ComplexOperationTypeEnum = {}));
    var JobShopAlgorithmEnum;
    (function (JobShopAlgorithmEnum) {
        JobShopAlgorithmEnum[JobShopAlgorithmEnum["RANDOM"] = 0] = "RANDOM";
        JobShopAlgorithmEnum[JobShopAlgorithmEnum["HILL_CLIMBING"] = 1] = "HILL_CLIMBING";
        JobShopAlgorithmEnum[JobShopAlgorithmEnum["HILL_CLIMBING_WITH_RESTARTS"] = 2] = "HILL_CLIMBING_WITH_RESTARTS";
        // GENETIC_ALGORITHM
    })(JobShopAlgorithmEnum || (JobShopAlgorithmEnum = {}));
    var RandomAlgorithmEnum;
    (function (RandomAlgorithmEnum) {
        RandomAlgorithmEnum[RandomAlgorithmEnum["FISHERYATES"] = 0] = "FISHERYATES";
        RandomAlgorithmEnum[RandomAlgorithmEnum["NORANDOM"] = 1] = "NORANDOM"; // this will cause every simulation to run with same job ... only used for benchmarking...
    })(RandomAlgorithmEnum || (RandomAlgorithmEnum = {}));
    var MaterialEnum;
    (function (MaterialEnum) {
        MaterialEnum[MaterialEnum["ACETAL"] = 0] = "ACETAL";
        MaterialEnum[MaterialEnum["PP"] = 1] = "PP";
    })(MaterialEnum || (MaterialEnum = {}));
    var JobShopProblem = /** @class */ (function () {
        function JobShopProblem() {
            this.resources = new Map();
            this.jobs = new Map();
            this.maxNumberOfSimulations = 100000; // default unless set otherwise
            this.maxSecondsToRun = 30; // default unless set otherwise.
            this.algorithm = JobShopAlgorithmEnum.RANDOM;
            this.hillClimbingRandomRestartPercent = 1; // default use random in 1 percents of the calls. 
            this.totalRestarts = 0;
            this.terminationCriteriaFuncs = this.generateDefaultTerminationCriteriaFunctions();
            this.bestMakeSpanLocal = Infinity;
            this.randomAlgorithm = RandomAlgorithmEnum.FISHERYATES;
        }
        JobShopProblem.prototype.addJob = function (job) {
            this.jobs.set(job.id, job);
            // this.calculateNumberOfOperations()
        };
        JobShopProblem.prototype.addOperation = function (jobKey) { };
        JobShopProblem.prototype.updateOperation = function (jobKey) { };
        /**
         * Returns ID of the newly added Machine
         * @param name
         * @param tags
         */
        JobShopProblem.prototype.addMachine = function (name,id,tags) {
            id = id ? id : Array.from(this.resources.keys()).reduce(function (prev, curr) { return curr >= prev ? curr + 1 : prev; }, 0);
            var machine = { id: id, name: name, type: ResourceTypeEnum.MACHINE };
            this.resources.set(id, machine);
            return id;
        };
        JobShopProblem.prototype.addResource = function (resource) {
            if (!resource.id) {
                var id = Array.from(this.resources.keys()).reduce(function (prev, curr) { return curr >= prev ? curr + 1 : prev; }, 0);
                resource.id = id
                this.resources.set(id, resource);
                return id;
            }
            else {
                this.resources.set(resource.id, resource);
                return resource.id;
            }
        };
        JobShopProblem.prototype.setSolutionParameters = function (params) {
            if (params.maxNumberOfSimulations) {
                this.maxNumberOfSimulations = params.maxNumberOfSimulations;
            }
            if (params.maxSecondsToRun) {
                this.maxSecondsToRun = params.maxSecondsToRun;
            }
            if (params.algorithm) {
                this.algorithm = params.algorithm;
            }
            if (params.hillClimbingRandomRestartPercent) {
                this.hillClimbingRandomRestartPercent = params.hillClimbingRandomRestartPercent;
            }
            if (params.randomAlgorithm) {
                this.randomAlgorithm = params.randomAlgorithm;
            }
        };
        JobShopProblem.prototype.addTerminationCriteria = function (terminationFunction) {
            // add a new termination criteria
            this.terminationCriteriaFuncs.push(terminationFunction);
            return this.terminationCriteriaFuncs;
        };
        /**
         * SOLVER FUNCTIONS
         */
        JobShopProblem.prototype.isOperationComplex = function (operation) {
            return operation.hasOwnProperty("type") && operation.hasOwnProperty("operations");
        };
        JobShopProblem.prototype.FisherYatesShuffle = function (array) {
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
        };
        // UNUSED ... TODO > recursively count operations until everthing is counted correctly .... 
        JobShopProblem.prototype.countOperations = function (job) {
            var _this = this;
            var count = 0;
            job.operations.forEach(function (op) {
                if (_this.isOperationComplex(op)) {
                    var _op = op;
                    if (_op.type === ComplexOperationTypeEnum.CAN_RUN_IN_PARALLEL) {
                        var _operations = _op.operations;
                        count += _operations.length;
                    }
                    else {
                        count += 1;
                    }
                }
                else {
                    count += 1;
                }
            });
            //console.log("number of operations is ", count);
            return count;
        };
        JobShopProblem.prototype.oneDToGanttChart = function (oned) {
            var _this = this;
            var ganttChartMachineMap = new Map(); // number is machine ID,  and number[] is schedule for machine. [ Job id, starttime, endTime, ...repeat ]
            this.resources.forEach(function (value, key) {
                ganttChartMachineMap.set(key, []);
            });
            var jobOperationIndexTrackingMap = new Map(); // could do this with array. just easier to read with Map
            this.jobs.forEach(function (value, key) {
                jobOperationIndexTrackingMap.set(key, 0); // start on zero index as in first operation.
            });
            var jobEarliestStartMap = new Map();
            this.jobs.forEach(function (value, key) {
                jobEarliestStartMap.set(key, 0);
            });
            // Helper to add operation 
            var addOperationToSchedule = function (operation, jobId) {
                var scheduleSoFar = ganttChartMachineMap.get(operation.machine);
                var earliestMachineAvailableTime = scheduleSoFar.length === 0 ? 0 : scheduleSoFar[scheduleSoFar.length - 1] + 1;
                var earliestJobStartTime = jobEarliestStartMap.get(jobId);
                var job = _this.jobs.get(jobId);
                var startTime = Math.max(earliestMachineAvailableTime, earliestJobStartTime);
                var endTime = startTime + (operation.time * job.requiredInventory);
                if (scheduleSoFar.length === 0) {
                    ganttChartMachineMap.set(operation.machine, [jobId, startTime, endTime]);
                }
                else {
                    scheduleSoFar.push(jobId);
                    scheduleSoFar.push(startTime);
                    scheduleSoFar.push(endTime);
                    ganttChartMachineMap.set(operation.machine, scheduleSoFar);
                    //ganttChartMachineMap.set(operation.machine, [...scheduleSoFar, jobId, startTime, endTime]);
                }
                return endTime;
            };
            oned.forEach(function (jobId, idx, arr) {
                var job = _this.jobs.get(jobId);
                var operationIndex = jobOperationIndexTrackingMap.get(jobId);
                var operation = job.operations[operationIndex];
                // adding to schedule 
                if (_this.isOperationComplex(operation)) {
                    var complexOperation = operation; // Cast to complex operation type
                    if (complexOperation.type === ComplexOperationTypeEnum.CAN_RUN_IN_PARALLEL) {
                        var endTimes = complexOperation.operations.map(function (operation, idx) {
                            var endTime = addOperationToSchedule(operation, jobId);
                            return endTime;
                        });
                        var maxEndTime = Math.max.apply(Math, endTimes);
                        jobEarliestStartMap.set(jobId, maxEndTime + 1);
                    }
                    else if (complexOperation.type === ComplexOperationTypeEnum.CAN_RUN_IN_MULTIPLE_MACINES) {
                        var randomlyChoosenOperationFromMultipleMachineOptions = complexOperation.operations[Math.floor(Math.random() * complexOperation.operations.length)];
                        var endTime = addOperationToSchedule(randomlyChoosenOperationFromMultipleMachineOptions, jobId); // cast before sending .
                        jobEarliestStartMap.set(jobId, endTime + 1);
                    }
                    else {
                        throw new Error("Type not supported yet");
                    }
                }
                else {
                    // if operation is not complex, we simply add the operation to the schedule.
                    var _operation = operation;
                    var endTime = addOperationToSchedule(_operation, jobId);
                    jobEarliestStartMap.set(jobId, endTime + 1);
                }
                // at the end, incremebt the index of operation ...
                // Open Question? What if the job is of type CAN_BE_SPLIT in 4 equal parts?
                jobOperationIndexTrackingMap.set(jobId, operationIndex + 1);
            });
            return ganttChartMachineMap;
        };
        JobShopProblem.prototype.onedArrayOfJobs = function () {
            var _this = this;
            var getRandomArrayOfJobs = function () {
                var arr = [];
                _this.jobs.forEach(function (v, k) {
                    var opcount = v.operations.length;
                    var a = new Array(opcount).fill(k);
                    arr = arr.concat(a);
                });
                //console.log("returning array ", arr)
                // return arr
                if (_this.randomAlgorithm === RandomAlgorithmEnum.NORANDOM) {
                    return arr;
                }
                arr = _this.FisherYatesShuffle(arr);
                return arr;
            };
            var swap = function (base) {
                var randi = Math.floor(Math.random() * base.length);
                var randj = Math.floor(Math.random() * base.length);
                while (base[randi] === base[randj]) { // no point in swapping the same number.
                    randj = Math.floor(Math.random() * base.length);
                }
                var randiVal = base[randi];
                base[randi] = base[randj];
                base[randj] = randiVal;
                return base;
            };
            if (!this.best1Dsolution) {
                return getRandomArrayOfJobs();
            }
            if (this.algorithm === JobShopAlgorithmEnum.RANDOM) {
                return getRandomArrayOfJobs();
            }
            else if (this.algorithm === JobShopAlgorithmEnum.HILL_CLIMBING) {
                return swap(this.best1Dsolution);
            }
            else if (this.algorithm === JobShopAlgorithmEnum.HILL_CLIMBING_WITH_RESTARTS) {
                var randomPercent = Math.random() * 100;
                // eg: percent = 20.There is a 20% chance that randomPercent is 20 or less. 
                // so if randomPercent is 20 or less, we add randomness, else we keep hill climbing. 
                var useRandom = randomPercent < this.hillClimbingRandomRestartPercent ? true : false;
                if (useRandom) {
                    this.totalRestarts += 1;
                    //makeSpansForCsv.push(90000)
                    var oned = getRandomArrayOfJobs();
                    this.best1DSolutionLocal = oned; //rest best1DSolutionLocal
                    this.bestMakeSpanLocal = Infinity;
                    return oned;
                }
                else {
                    return swap(this.best1DSolutionLocal);
                }
            }
            else {
                throw new Error("Not implemented");
            }
        };
        JobShopProblem.prototype.costFunction = function (ganttChart) {
            var makeSpan = Array.from(ganttChart.values()).reduce(function (prev, currentListOfSchedules) {
                var lastTime = currentListOfSchedules[currentListOfSchedules.length - 1];
                if (lastTime > prev) {
                    return lastTime;
                }
                return prev;
            }, 0);
            return makeSpan;
        };
        JobShopProblem.prototype.generateDefaultTerminationCriteriaFunctions = function () {
            var funcs = [];
            if (this.maxNumberOfSimulations) {
                var terminateBasedOnNumberOfSimulations = function (args) {
                    if (args.currentSimulationIndex > args.maxNumberOfSimulations) {
                        return true;
                    }
                    return false; //otherwise return false
                };
                funcs.push(terminateBasedOnNumberOfSimulations);
            }
            if (this.maxSecondsToRun) {
                var terminateBasedOnMaxSecondsSinceStart = function (args) {
                    var terminationTime = new Date(args.simulationStartTime.getTime());
                    terminationTime.setSeconds(terminationTime.getSeconds() + args.maxSecondsToRun);
                    if (new Date() > terminationTime) {
                        return true;
                    }
                    return false;
                };
                funcs.push(terminateBasedOnMaxSecondsSinceStart);
            }
            return funcs;
        };
        JobShopProblem.prototype.solve = function (postMessage) {
            console.log("solving");
            var currentSimCount = 0;
            var terminateNow;
            var bestGanttChart;
            var bestMakeSpan = +Infinity;
            var bestMakeSpanIndex = 0;
            var makeSpanHistory = [];
            var defaultTerminationArgs = {
                currentSimulationIndex: currentSimCount,
                simulationStartTime: new Date(),
                maxNumberOfSimulations: this.maxNumberOfSimulations,
                maxSecondsToRun: this.maxSecondsToRun,
                algorithm: this.algorithm
            };
            while (!terminateNow) {
                // Update current Sim Count to run on termination criteria functions.
                defaultTerminationArgs.currentSimulationIndex = currentSimCount;
                var terminatedList = this.terminationCriteriaFuncs.map(function (f) { return f(defaultTerminationArgs); });
                terminateNow = terminatedList.reduce(function (prev, curr) { return curr ? true : prev; }, false);
                // print to screen every so often
                // if (currentSimCount % 10) {
                //     process.stdout.write("Running simulation " + currentSimCount + " of " + this.maxNumberOfSimulations + ". RS " + this.totalRestarts + " Best MakeSpan so far " + bestMakeSpan + " on simulation number " + bestMakeSpanIndex + " \r");
                // }

                var oned = this.onedArrayOfJobs();
                var ganttChart = this.oneDToGanttChart(oned);
                var makespan = this.costFunction(ganttChart);
                //console.log("makespan is ", makespan)
                if (makespan < bestMakeSpan) {
                    // output global makespan value here.
                    bestMakeSpan = makespan;
                    bestGanttChart = ganttChart;
                    this.best1Dsolution = oned;
                    bestMakeSpanIndex = currentSimCount;

                    postMessage("Got New MakeSpan")
                    const returnData = {
                        'type':'newSchedule',
                        'schedule':bestGanttChart,
                        'makeSpan':makespan,
                        "minMakeSpanDetectedIteration": currentSimCount
                    }
                    postMessage(returnData);
                    sleep(1000) // Allow time for UI to update
                }
                if (this.algorithm === JobShopAlgorithmEnum.HILL_CLIMBING_WITH_RESTARTS) {
                    if (makespan < this.bestMakeSpanLocal) {
                        // send makespan value here for hill climbing with restarts...
                        this.bestMakeSpanLocal = makespan;
                        this.best1DSolutionLocal = oned;
                    }
                }
                currentSimCount += 1;

                /**
                 * CODE FOR LOGGING TO THE UI 
                 */
                let newMakeSpanToPushToUI;
                switch (this.algorithm) {
                    case JobShopAlgorithmEnum.RANDOM:
                        newMakeSpanToPushToUI = makespan
                        break;
                    case JobShopAlgorithmEnum.HILL_CLIMBING:
                        newMakeSpanToPushToUI = bestMakeSpan
                        break;
                    case JobShopAlgorithmEnum.HILL_CLIMBING_WITH_RESTARTS:
                        newMakeSpanToPushToUI = this.bestMakeSpanLocal
                        break;
                    default:
                        newMakeSpanToPushToUI = makespan
                }
                makeSpanHistory.push(newMakeSpanToPushToUI)
                let send;
                if(currentSimCount < 100){
                    send = currentSimCount % 1 === 0
                } else if (currentSimCount < 1000){
                    send = currentSimCount % 100 === 0
                } else if (currentSimCount < 10000) {
                    send = currentSimCount % 1000 === 0
                } else if (currentSimCount % 100000) {
                    send = currentSimCount % 100000 === 0
                } else {
                    send = currentSimCount % 250000 === 0
                }
                if(send){
                    const returnData = {
                        type:'iterationCount',
                        iteration:currentSimCount,
                        newMakeSpan:makeSpanHistory
                    }
                    postMessage(returnData);
                    //sleep(200) // Give UI thread enough time to render this.
                    makeSpanHistory.length = 0 // delete the array
                }
            }
            // clear one last time ... 
            if(makeSpanHistory.length > 0 ){
                const returnData = {
                    type:'iterationCount',
                    iteration:currentSimCount,
                    newMakeSpan:makeSpanHistory
                }
                postMessage(returnData);
            }
            // console.log("Termination criteria passed");
            // console.log("shortest makespan is ", bestMakeSpan);
            // console.log(bestGanttChart)
            return {
                bestGanttChart: bestGanttChart,
                bestMakeSpan: bestMakeSpan,
                bestMakeSpanIndex: bestMakeSpanIndex
            };
        };
        return JobShopProblem;
    }());
    
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

    onmessage = function(e) {
        const that = this;
        const { problem, algorithmRepetition, algorithmMaxTimeSecs, algorithmType, machines, jobs } = e.data; 
        // console.log(problem, algorithmMaxTimeSecs);
        // _runOptimizationAlgo(problem, algorithmRepetition, algorithmMaxTimeSecs, algorithmType, that)
        const jsspSolver = new JobShopProblem();

        machines.forEach((machine, index) => {
            jsspSolver.addMachine(machine.name, machine.id)
        })
        jobs.forEach((job, index) => {
            const operations = []
            job.operations.forEach((operation, index) => {
                if(operation.machineAndTimes.length === 0){
                    return
                }
                if(operation.machineAndTimes.length > 1){
                    // add complex operation 
                    const complexOperation = {
                        type: ComplexOperationTypeEnum.CAN_RUN_IN_MULTIPLE_MACINES,
                        operations: operation.machineAndTimes.map(mat => {
                            return {
                                machine: parseInt(mat[0]),
                                time: parseInt(mat[1])
                            }
                        })
                    }
                    operations.push(complexOperation)
                } else {
                    // add simple operation
                    operations.push({
                        machine: parseInt(operation.machineAndTimes[0][0]),
                        time: parseInt(operation.machineAndTimes[0][0])
                    })
                }
            })
            jsspSolver.addJob({
                id: job.id,
                name: job.name,
                operations: operations,
                requiredInventory: 1
            })
        })
        let algo;
        if(algorithmType === "random"){
            algo = JobShopAlgorithmEnum.RANDOM
        } else if (algorithmType === "hillClimbing"){
            algo = JobShopAlgorithmEnum.HILL_CLIMBING
        } else {
            algo = JobShopAlgorithmEnum.HILL_CLIMBING_WITH_RESTARTS
        }
        const solParams = {
            maxNumberOfSimulations:algorithmRepetition,
            maxSecondsToRun: algorithmMaxTimeSecs,
            algorithm: algo,
            hillClimbingRandomRestartPercent: 0.1, // restart 0.0001 percent of the time. Gives the algorithm enough time to discover a local minima.
            randomAlgorithm: RandomAlgorithmEnum.FISHERYATES
            // Smaller than number better chance the algorithm has to discover local minima... important during large 
        }
    
        jsspSolver.setSolutionParameters(solParams)
        const bestGanttChart = jsspSolver.solve(this.postMessage);
        console.log("returning bestGanttChart")
        console.log(bestGanttChart)
        var workerResult = 'Received from main: ' + (e.data);
        this.postMessage(workerResult);
    }
};

let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});
const worker_script = URL.createObjectURL(blob);
console.log("generated worker script is ", worker_script)
export default worker_script;
