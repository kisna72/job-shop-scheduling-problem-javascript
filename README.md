# job-shop-scheduling-problem-javascript
Job Shop Scheduling Problem solved in Javascript

React Application that demonstrates how to solve a Job Shop Scheduling Problem with different algorithms. See [https://en.wikipedia.org/wiki/Job_shop_scheduling(wikipedia) for descriptions of JSSP problems.

## Why?
I was looking to learn how to solve discrete optimization class of problems - however realized that all the examples are in python, C, C++ or Java. Pretty much all the open source libraries are design to run on the servers. I wanted to write a demonstration application in javascript - to not only learn the data structures and algorithms behind solving such problems but also to showcases feasibility of running such algorithms in the browser's environment itself. 

### Key things to notice: 
1. Web worker is utilized to run the algorithm itself. There is message passing between react applicatio and the web-worker to move data around. 
2. React app is responsible for rendering makespan chart and the GanttChart of best-yet solution. 
3. You can stop or restart solution at any time, and you are always guarenteed the best-so-far solution. 
4. Becauase at the end of day - different algorithm's are choosing solution space randomly - since its not possible to go over every single possible solutions due to large number of permutations, two different runs might very well produce different results. However - there are 'smart' ways to choose randomly - which is called meta heuristics. 
5. Both algorithms produce fairly good solutions most of the time for our demo problem of water plant manufacturing. 

## How to Run Locally? 

Download the code, `cd jssp-frontend` and then run `yarn install && start`.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


### `yarn start`

Runs the app in the development mode.<br />

The page will reload if you make edits.<br />
You will also see any lint errors in the console.
