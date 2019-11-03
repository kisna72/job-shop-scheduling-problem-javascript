const JSSP1DEncoding = require('./JSSPSolution');

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
}

// const t = generateRandom1D(5,4)
// console.log(t)
module.exports = FishesYatesShuffle
module.exports = generateRandom1D