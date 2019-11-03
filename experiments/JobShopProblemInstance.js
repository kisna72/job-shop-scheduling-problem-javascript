const fs = require('fs')
const lr = require('readline')
/**
 * Problem Instance
 * Data structure that will hold JSSP data type.
 * Follows open source JSSP format.
 * JSSP Problem Instance Looks as follows in a text file:
+++++++++++++++++++++++
A simple Demo
4 5
0 10 1 20 2 20 3 40 4 10
1 20 0 10 3 30 2 50 4 30
2 30 1 20 4 12 3 40 0 10
4 50 3 30 2 15 0 20 1 15
++++++++++++++++++++++++

This is converted into JSSPProblemInstance. 
 */
function JSSPProblemInstance(n,m){
    this.numJobs = n;
    this.numMachines = m
    this.jobs = []; // list of lists.

    this.generateJSSPFromTextFile = async (filePath) => {
        this.jobs = [] // Reset jobs
        var lines = require('fs').readFileSync(filePath, 'utf-8').split('\n')
        lines.forEach( (line, index) => {
            // console.log(line)
            if(index < 2){
                //console.log("UseLess Line : ", line)
            } else if(line.startsWith("++")){
                //console.log("End")
            } else if (index == 2) {
                const split_by_space = line.split(" ")
                this.numJobs = parseInt(split_by_space[0])
                this.numMachines = parseInt(split_by_space[1])
            } else {
                const split_by_space = line.split(" ")
                const machineTimeArr = split_by_space.filter(item => !isNaN(parseInt(item))).map(s => parseInt(s))
                this.jobs.push(machineTimeArr)
            }
        })
    }
}

const a = new JSSPProblemInstance()
a.generateJSSPFromTextFile("demo.txt")
console.log(a)

module.exports = JSSPProblemInstance