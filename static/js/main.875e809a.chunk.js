(this["webpackJsonpjssp-frontend"]=this["webpackJsonpjssp-frontend"]||[]).push([[0],{14:function(e,t,a){},15:function(e,t,a){},17:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(8),o=a.n(r),i=(a(14),a(1)),c=a(2),s=a(4),u=a(3),m=a(5),h=(a(15),a(6));var p=function(e){for(var t="".concat(e,"color"),a=0,n=0;n<t.length;n++)a=t.charCodeAt(n)+((a<<5)-a);var l="#";for(n=0;n<3;n++){l+=("00"+(a>>8*n&255).toString(16)).substr(-2)}return l},d=function(e){function t(e){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).call(this,e))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"randColor",value:function(){return Math.floor(180*Math.random())}},{key:"render",value:function(){for(var e=[],t=0;t<this.props.schedule.length;t++)if(t%3===0){var a=this.props.schedule[t],n=this.props.schedule[t+1],r=this.props.schedule[t+2],o=100*(r-n)/this.props.maxTime,i=100*n/this.props.maxTime,c={width:"".concat(o,"%"),height:"20px",backgroundColor:"".concat(p(a)),position:"absolute",left:"".concat(i,"%"),transition:"all 1s linear"},s=l.a.createElement("div",{id:"key-".concat(this.props.index,"-").concat(a),className:"job-".concat(a),style:c,"data-start":n,"data-end":r,"data-jobid":a},"Job-",a);e.push(s)}var u={position:"relative",display:"flex",top:"".concat(25*this.props.index,"px")};return l.a.createElement("div",{style:u},e)}}]),t}(l.a.Component),g=function(e){function t(){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){for(var e={position:"relative",top:"".concat(25*this.props.index,"px")},t=[],a=10*(this.props.maxTime/10+1),n=0;n<a;n++){var r=100*n/this.props.maxTime,o={left:"".concat(r,"%"),transition:"all 1s linear",position:"absolute"};if(n%10===0){var i=l.a.createElement("span",{style:o},l.a.createElement("div",null,"|"),l.a.createElement("div",null,n));t.push(i)}}return l.a.createElement("div",{style:e},t)}}]),t}(l.a.Component),b=["Bottle Expansion Mold","Water Cleaning/ Purifying","Water Filling","Bottle Capping","Bottle Labeling"],f=function(e){function t(){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){console.log(this.props);var e=this.props.schedule.map((function(e){return e[e.length-1]}));console.log(e);var t=Math.max.apply(Math,Object(h.a)(e));return l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"ganttChartWithY"},l.a.createElement("div",{className:"ganttChartYAxis"},this.props.schedule.map((function(e,t){var a=b[t];return l.a.createElement("span",{className:"yAxisTick"},"".concat(a," Machine"))}))),l.a.createElement("div",{className:"ganttChartData"},this.props.schedule.map((function(e,a){return l.a.createElement(d,{schedule:e,maxTime:t,index:a})})),l.a.createElement(g,{index:this.props.schedule.length,maxTime:t}))))}}]),t}(l.a.Component);a(16);function v(e){var t=this;this.schedule=e,this.getMakeSpan=function(){var e=t.schedule.map((function(e){return e.length&&0!==e.length?e[e.length-1]:0}));return Math.max.apply(Math,Object(h.a)(e))}}function E(e){var t=this;this.jssp1d=e,this.JSSP1dToGantt=function(e){for(var a=[],n=0;n<e.numMachines;n++)a.push([]);var l=new Array(e.numJobs).fill(0);return t.jssp1d.forEach((function(t){var n=e.jobs[t].splice(0,2),r=n[0],o=n[1],i=0===a[r].length?0:a[r][a[r].length-1],c=l[t],s=Math.max(c,i);l[t]=s+o;var u=[t,s+1,s+o];a[r]=[].concat(Object(h.a)(a[r]),u)})),new v(a)}}function y(e,t){for(var a=[],n=0;n<t;n++){var l=new Array(e).fill(n);a=[].concat(Object(h.a)(a),Object(h.a)(l))}return new E(function(e){for(var t,a,n=e.length;0!==n;)a=Math.floor(Math.random()*n),t=e[n-=1],e[n]=e[a],e[a]=t;return e}(a))}function j(e){return l.a.createElement("nav",{class:"navbar navbar-expand-lg navbar-dark bg-primary"},l.a.createElement("a",{class:"navbar-brand",href:"/"},"Job Shop Problem Demo"),l.a.createElement("button",{class:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarSupportedContent","aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation"},l.a.createElement("span",{class:"navbar-toggler-icon"})),l.a.createElement("div",{class:"collapse navbar-collapse",id:"navbarSupportedContent"},l.a.createElement("ul",{class:"navbar-nav mr-auto"},l.a.createElement("li",{class:"nav-item active"},l.a.createElement("a",{class:"nav-link",href:"/"},"Simple Problem (n=4,m=5) ",l.a.createElement("span",{class:"sr-only"},"(current)"))),l.a.createElement("li",{class:"nav-item"},l.a.createElement("a",{class:"nav-link",href:"/"},"Medium (n=4,m=5)")))))}function w(e){return l.a.createElement("nav",{class:"navbar navbar-expand-lg navbar-light bg-light"},l.a.createElement("div",{class:"collapse navbar-collapse",id:"navbarSupportedContent"},l.a.createElement("ul",{class:"navbar-nav mr-auto"},l.a.createElement("li",{class:"nav-item active"},l.a.createElement("a",{class:"nav-link",href:"/"},"Random Algorithm ",l.a.createElement("span",{class:"sr-only"},"(current)"))),l.a.createElement("li",{class:"nav-item"},l.a.createElement("a",{class:"nav-link",href:"/"},"Neighbourhood search algorithm")))))}var x=new function(e,t){this.numJobs=e,this.numMachines=t,this.jobs=[]}(4,5);x.jobs=[[0,10,1,30,2,10,3,10,4,8],[0,50,1,60,2,10,3,10,4,16],[0,30,1,90,2,20,3,10,4,16],[0,15,1,90,2,20,3,10,4,10]];var O=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={schedule:[[],[]],makeSpan:1/0},a.runOptimizationAlgo(x,10,1),a}return Object(m.a)(t,e),Object(c.a)(t,[{key:"runOptimizationAlgo",value:function(e,t,a){for(var n=this,l=this.state.makeSpan,r=(new Date).getTime()+1e3*a,o=0;o<t;o++){if(console.log("running algo"),o%100==0&&(new Date).getTime()>r){console.log("Ending because of time limit"),console.log("Ran times : ",o);break}var i=y(e.numMachines,e.numJobs),c=Object.assign({},e);c.jobs=JSON.parse(JSON.stringify(e.jobs));var s=i.JSSP1dToGantt(c),u=s.getMakeSpan();u<l&&(l=u,console.log("Found Better",s),console.log("New Make Span at index ",o,u),this.setState({schedule:s.schedule,makeSpan:l}))}setTimeout((function(){n.runOptimizationAlgo(e,1,1)}),1e3)}},{key:"render",value:function(){return console.log("Render function re-running",this.state.schedule),l.a.createElement("div",{className:"App"},l.a.createElement(j,null),l.a.createElement(w,null),l.a.createElement("h3",null,"Water Bottling Plant Schedule Optimization"),l.a.createElement(f,{schedule:this.state.schedule}),l.a.createElement("div",{className:"explanation"},l.a.createElement("p",null,"The Chart above shows the order in which each operation in a water bottling plant must run on each machine to complete all bottling activities in the most efficient manner. Watch the chart change as the algorithm finds more and more efficient way to run the factory over time. Simulation is slowed down for demonstration purpose."),l.a.createElement("hr",null),l.a.createElement("h3",null,"Explanation"),"In this demo, we are trying to optimize how to run a water bottling plant. We have 5 machines for different operations, and various different types of products we need to produce.",l.a.createElement("ol",null,l.a.createElement("li",null,"Machine 0 - Bottle Expansion Molding"),l.a.createElement("li",null,"Machine 1 - Water Cleaning or purifying Machine "),l.a.createElement("li",null,"Machine 2 - Pouring water / Filling Process "),l.a.createElement("li",null,"Machine 3 - Capping"),l.a.createElement("li",null,"Machine 4 - Labelling")),"This factory produces 4 different types of water bottles, and each water bottling operation must be run in the following order:",l.a.createElement("ol",null,l.a.createElement("li",null,l.a.createElement("span",{style:{backgroundColor:"".concat(p(0))}},"Job 0 - Spring Water 16oz "),l.a.createElement("ol",null,l.a.createElement("li",null,"Bottle Expansion - 10 seconds"),l.a.createElement("li",null,"Water Purifying - 30 seconds"),l.a.createElement("li",null,"Water Filling - 10 seconds"),l.a.createElement("li",null,"Bottle Capping - 10 seconds"),l.a.createElement("li",null,"Bottle Labeling - 8 seconds"))),l.a.createElement("li",null,l.a.createElement("span",{style:{backgroundColor:"".concat(p(1))}},"Job 1 - Distilled Water 16 oz"),l.a.createElement("ol",null,l.a.createElement("li",null,"Bottle Expansion - 50 seconds"),l.a.createElement("li",null,"Water Purifying - 60 seconds"),l.a.createElement("li",null,"Water Filling - 10 seconds"),l.a.createElement("li",null,"Bottle Capping - 10 seconds"),l.a.createElement("li",null,"Bottle Labeling - 16 seconds"))),l.a.createElement("li",null,l.a.createElement("span",{style:{backgroundColor:"".concat(p(2))}},"Job 2 - Distilled Water 32 oz"),l.a.createElement("ol",null,l.a.createElement("li",null,"Bottle Expansion - 30 seconds"),l.a.createElement("li",null,"Water Purifying - 90 seconds"),l.a.createElement("li",null,"Water Filling - 20 seconds"),l.a.createElement("li",null,"Bottle Capping - 10 seconds"),l.a.createElement("li",null,"Bottle Labeling - 16 seconds"))),l.a.createElement("li",null,l.a.createElement("span",{style:{backgroundColor:"".concat(p(3))}},"Job 3 - Bottoled Water 32 oz"),l.a.createElement("ol",null,l.a.createElement("li",null,"Bottle Expansion - 15 seconds"),l.a.createElement("li",null,"Water Purifying - 90 seconds"),l.a.createElement("li",null,"Water Filling - 20 seconds"),l.a.createElement("li",null,"Bottle Capping - 10 seconds"),l.a.createElement("li",null,"Bottle Labeling - 10 seconds")))),"Algorithm that runs in the background finds the most optimal way of running all the jobs in the given order. The Chart shows the order in which each job must run on each machine to complete all bottling activities in the most efficient manner. Watch the chart change as the algorithm finds more and more efficient way to run the factory."))}}]),t}(l.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(l.a.createElement(O,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},9:function(e,t,a){e.exports=a(17)}},[[9,1,2]]]);
//# sourceMappingURL=main.875e809a.chunk.js.map