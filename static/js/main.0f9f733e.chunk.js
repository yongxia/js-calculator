(this["webpackJsonpjs-calculator"]=this["webpackJsonpjs-calculator"]||[]).push([[0],{16:function(e,t,n){"use strict";n.r(t);var s=n(8),c=n(14),r=n(2),l=n(13),i=n(12),a=n(3),u=n(11),d=n(0),o=n.n(d),h=n(4),b=n.n(h),j=n(7),p=n(15),O=(n(21),n(10)),g=n(1),k="MESSAGES",v="RESULT",f="CLEAR",x={messages:[],result:0,parser:""},H=function(e){Object(l.a)(n,e);var t=Object(i.a)(n);function n(e){var c;return Object(s.a)(this,n),(c=t.call(this,e)).resetHandler=function(){c.props.reset()},c.clickHandler=function(e){c.props.addNewMessage(e.target.value)},c.clickEqualsHandler=function(){c.props.updateResult()},c.resetHandler=c.resetHandler.bind(Object(r.a)(c)),c.clickHandler=c.clickHandler.bind(Object(r.a)(c)),c.clickEqualsHandler=c.clickEqualsHandler.bind(Object(r.a)(c)),c}return Object(c.a)(n,[{key:"render",value:function(){return Object(g.jsxs)("div",{className:"container",children:[Object(g.jsxs)("div",{className:"box-group",children:[Object(g.jsxs)("div",{className:"screen",children:[Object(g.jsx)("div",{id:"formula",children:this.props.messages.join("")+this.props.parser}),Object(g.jsx)("div",{id:"display",children:this.props.result})]}),Object(g.jsx)("button",{id:"clear",onClick:this.resetHandler,children:"AC"}),Object(g.jsx)("button",{id:"divide",onClick:this.clickHandler,value:"/",children:"/"}),Object(g.jsx)("button",{id:"multiply",onClick:this.clickHandler,value:"*",children:"*"}),Object(g.jsx)("button",{id:"seven",onClick:this.clickHandler,value:"7",children:"7"}),Object(g.jsx)("button",{id:"eight",onClick:this.clickHandler,value:"8",children:"8"}),Object(g.jsx)("button",{id:"nine",onClick:this.clickHandler,value:"9",children:"9"}),Object(g.jsx)("button",{id:"add",onClick:this.clickHandler,value:"+",children:"+"}),Object(g.jsx)("button",{id:"four",onClick:this.clickHandler,value:"4",children:"4"}),Object(g.jsx)("button",{id:"five",onClick:this.clickHandler,value:"5",children:"5"}),Object(g.jsx)("button",{id:"six",onClick:this.clickHandler,value:"6",children:"6"}),Object(g.jsx)("button",{id:"subtract",onClick:this.clickHandler,value:"-",children:"-"}),Object(g.jsx)("button",{id:"one",onClick:this.clickHandler,value:"1",children:"1"}),Object(g.jsx)("button",{id:"two",onClick:this.clickHandler,value:"2",children:"2"}),Object(g.jsx)("button",{id:"three",onClick:this.clickHandler,value:"3",children:"3"}),Object(g.jsx)("button",{id:"equals",onClick:this.clickEqualsHandler,children:"="}),Object(g.jsx)("button",{id:"zero",onClick:this.clickHandler,value:"0",children:"0"}),Object(g.jsx)("button",{id:"decimal",onClick:this.clickHandler,value:".",children:"."})]}),Object(g.jsxs)("p",{children:["Coded by Yong Xia ",Object(g.jsxs)("a",{href:"https://github.com/yongxia/js-calculator",target:"_blank",rel:"noreferrer",children:[Object(g.jsx)("i",{className:"fa fa-github"})," Github"]})]})]})}}]),n}(o.a.Component),m=Object(j.createStore)((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:x,t=arguments.length>1?arguments[1]:void 0,n=Object(u.a)(e.messages),s=e.parser;switch(t.type){case k:return n.includes("=")&&(n=/[+*/-]/.test(t.message)?[e.result]:[]),s+=t.message,/^[+/*-][+/*]/.test(s)?s=s.substr(1):/^[+*/-]-[+/*-]/.test(s)?s=s.substr(2):/\d+[+*/-]$/.test(s)?(/^[+/*-]/.test(s)&&(n.push(s.charAt(0)),s=s.substring(1)),s.includes(".")?n.push(parseFloat(s.substring(0,s.length-1))):n.push(parseInt(s.substring(0,s.length-1))),s=s.substring(s.length-1)):(/^[+*/]?-?0+$/.test(s)?s=s.replace(/0+/,"0"):/^[+*/]?-?0+[1-9]$/.test(s)&&(s=s.replace(/0+/,"")),(s.match(/\./g)||[]).length>1&&(s=s.substring(0,s.length-1))),Object(a.a)(Object(a.a)({},e),{},{messages:n,parser:s,result:s});case v:if(/^[+*/-]/.test(s)&&(n.push(s.charAt(0)),(s=s.substring(1)).length>0&&(s.includes(".")?n.push(parseFloat(s)):n.push(parseInt(s)),s="")),"number"!==typeof n[0]&&n.unshift(0),n.length<=2||"number"!==typeof n[n.length-1])return e;for(var c=Object(u.a)(n);c.includes("*")||c.includes("/");){for(var r=1;r<c.length-1;){if(/[*|/]/.test(c[r])){var l=c[r-1],i=c[r],d=c[r+1],o="*"===i?Math.round(l*d*1e4)/1e4:Math.round(l/d*1e4)/1e4;c.splice(r-1,3,o)}r++}console.log("reduced",c)}for(;c.includes("+")||c.includes("-");){for(var h=1;h<c.length-1;)if(/[+|-]/.test(c[h])){var b=c[h-1],j=c[h],p=c[h+1],O="+"===j?Math.round(1e4*(b+p))/1e4:Math.round(1e4*(b-p))/1e4;c.splice(h-1,3,O)}h++,console.log("reduced",c)}var g=c[0];return n.push("=",g),Object(a.a)(Object(a.a)({},e),{},{messages:n,parser:"",result:g});case f:return x;default:return e}}),Object(p.devToolsEnhancer)()),C=Object(O.b)((function(e){return{messages:e.messages,result:e.result,parser:e.parser}}),(function(e){return{addNewMessage:function(t){e(function(e){return{type:k,message:e}}(t))},updateResult:function(){e({type:v})},reset:function(){e({type:f})}}}))(H),y=function(e){Object(l.a)(n,e);var t=Object(i.a)(n);function n(){var e;Object(s.a)(this,n);for(var c=arguments.length,r=new Array(c),l=0;l<c;l++)r[l]=arguments[l];return(e=t.call.apply(t,[this].concat(r))).render=function(){return Object(g.jsx)(O.a,{store:m,children:Object(g.jsx)(C,{})})},e}return n}(o.a.Component);b.a.render(Object(g.jsx)(y,{}),document.getElementById("root"))},21:function(e,t,n){}},[[16,1,2]]]);
//# sourceMappingURL=main.0f9f733e.chunk.js.map