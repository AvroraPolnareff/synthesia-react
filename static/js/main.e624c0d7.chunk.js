(this["webpackJsonpsynthesia-react"]=this["webpackJsonpsynthesia-react"]||[]).push([[0],{136:function(t,n,e){},150:function(t,n,e){"use strict";e.r(n);var i,r,s,a,o,c,u,d=e(0),h=e.n(d),f=e(21),l=e.n(f),m=(e(136),e(13)),p=e.n(m),b=e(22),j=e(9),g=e(10),v=e(14),O=e(2),x=e(3),y=e(1),k=Object(x.b)((function(t){var n=t.className;return Object(y.jsx)("div",{className:n})}))(i||(i=Object(O.a)(["\n  box-sizing: border-box;\n  width: 20px;\n  height: 100%;\n  padding: 2px;\n  background: "," ","\n"])),(function(t){return t.pressed?"#c9c9c9":"#f6f6f6"}),(function(t){return t.black&&Object(x.a)(r||(r=Object(O.a)(["\n    width: 12px;\n    background: ","\n  "])),(function(t){return t.pressed?"#2d2d2d":"#505050"}))})),T=function(t){return[1,3,6,8,10].some((function(n){return n===t%12}))},w=Array.from(Array(127),(function(t,n){return T(n)})),P=Object(x.b)((function(t){var n=t.className,e=t.start,i=void 0===e?48:e,r=t.end,s=void 0===r?71:r,a=t.pressedKeys,o=void 0===a?[48,50,52]:a,c=w.map((function(t,n){return{index:n,black:t,pressed:o.some((function(t){return t===n}))}})).slice(i,s+1);return Object(y.jsx)("div",{className:n,children:c.map((function(t){return Object(y.jsx)(k,{black:t.black,pressed:t.pressed},t.index)}))})}))(s||(s=Object(O.a)(["\n  height: 50px;\n  display: flex;\n"]))),F=e(26),S=e(5),N=e(27),L=function t(){var n=this;Object(S.a)(this,t),this.listeners=[],this.on=function(t){n.listeners.push(t)},this.remove=function(t){n.listeners=n.listeners.filter((function(n){return n!==t}))},this.emit=function(t){n.listeners.forEach((function(n){return n(t)}))}},A=function t(){var n=this;Object(S.a)(this,t),this.animation=0,this.isPlaying=!1,this.isStarted=!1,this.startTime=0,this.time=0,this.event=new L,this.onFrame=function(t){n.event.on(t)},this.loop=function(t){n.isStarted||(n.startTime=t/1e3,n.isStarted=!0),n.isPlaying&&(n.time=t/1e3-n.startTime,n.event.emit({time:n.time,startTime:n.startTime,isPlaying:n.isPlaying}),n.animation=requestAnimationFrame(n.loop))},this.start=function(){n.isPlaying=!0,n.animation=requestAnimationFrame(n.loop)},this.stop=function(){cancelAnimationFrame(n.animation),n.isPlaying=!1,n.isStarted=!1,n.time=0,n.startTime=0,n.event.emit({time:0,startTime:0,isPlaying:!1})},this.pause=function(){throw Error("not implemented")},this.resume=function(){throw Error("not implemented")}},C={isPlaying:!1,currentNotes:[],notes:[],currentTick:0,tickLength:0,time:0},E=function(){function t(n){var e=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;Object(S.a)(this,t),this.midi=n,this.trackToPlay=i,this.speed=r,this.tempo=this.midi.header.tempos[0].bpm,this.currentTick=0,this.animation=new A,this.onStateChange=function(t){e.animation.onFrame((function(n){var i=n.time,r=(n.startTime,n.isPlaying);if(i>e.midi.tracks[e.trackToPlay].duration)e.stop();else{r&&(e.currentTick=Math.floor(i/e.tickLength));var s=e.midi.tracks[e.trackToPlay].notes.map((function(t){var n=t.midi,e=t.duration;return{note:n,position:t.time-i,length:e}})),a=s.filter((function(t){return t.position<=0&&-1*t.position<=t.length}));t({currentTick:e.currentTick,notes:s,currentNotes:a,isPlaying:r,tickLength:e.tickLength,time:i})}}))},this.play=function(){e.animation.start()},this.pause=function(){e.animation.pause()},this.stop=function(){e.animation.stop()},this.resume=function(){e.animation.resume()}}return Object(N.a)(t,[{key:"tickLength",get:function(){return 60/this.tempo/this.midi.header.ppq*this.speed}}]),t}(),z=E,I=e(7),M=e(28),q=x.b.div.attrs((function(t){return{style:{bottom:"".concat(t.position,"px"),height:"".concat(t.size,"px")}}}))(a||(a=Object(O.a)(["\n  position: absolute;\n  width: 100%;\n  bottom: 0;\n  background: #ff7878;\n"]))),D=x.b.div(o||(o=Object(O.a)(["\n  position: relative;\n  box-sizing: border-box;\n  width: 20px;\n  height: 100%;\n  border: solid 1px #989797;\n  background: "," ","\n  overflow: no-display;\n"])),(function(t){return t.pressed?"#c9c9c9":"#f6f6f6"}),(function(t){return t.black&&Object(x.a)(c||(c=Object(O.a)(["\n    width: 12px;\n    background: ","\n  "])),(function(t){return t.pressed?"#b2b2b2":"#dedede"}))})),B=function(t,n,e){var i,r=Array(e-n+1).fill([]),s=Object(M.a)(t);try{for(s.s();!(i=s.n()).done;){var a=i.value,o=a.note-n;r.length>o&&(r[o]=[].concat(Object(j.a)(r[o]),[a]))}}catch(c){s.e(c)}finally{s.f()}return r},J=Object(x.b)((function(t){var n=t.notes,e=void 0===n?[]:n,i=t.className,r=t.start,s=void 0===r?48:r,a=t.end,o=void 0===a?71:a;return Object(y.jsx)("div",{className:i,children:B(e,s,o).map((function(t,n){return Object(y.jsx)(D,{black:T(n+s),children:t.map((function(t){return Object(y.jsx)(q,{position:100*t.position,size:100*t.length})}))})}))})}))(u||(u=Object(O.a)(["\n  height: 300px;\n  display: flex;\n  overflow: hidden;\n"]))),K=function(t){var n=t.track,e=void 0===n?1:n,i=function(){var t=Object(d.useState)(I.a.none),n=Object(g.a)(t,2),e=n[0],i=n[1],r=function(){var t=Object(b.a)(p.a.mark((function t(){var n;return p.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,F.Midi.fromUrl("/synthesia-react/example2.mid");case 2:n=t.sent,i(I.a.some(n));case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return Object(d.useEffect)((function(){r()}),[]),e}();return I.a.map((function(t){return new z(t,e,.5)}))(i)},U=function(t){var n=t.player,e=Object(d.useState)(C),i=Object(g.a)(e,2),r=i[0],s=i[1],a=r.currentNotes,o=r.isPlaying,c=r.notes;return Object(d.useEffect)((function(){return n.onStateChange(s)}),[n]),Object(y.jsxs)("div",{style:{display:"flex",flexDirection:"column"},children:[Object(y.jsx)(J,{notes:c}),Object(y.jsx)(P,{pressedKeys:a.map((function(t){return t.note}))}),Object(y.jsx)("button",{onClick:o?n.stop:n.play,children:o?"stop":"play"}),Object(y.jsx)("h1",{children:r.time.toFixed(3)})]})},G=function(){Object(v.useMIDI)();var t=K({track:1});return I.a.match((function(){return Object(y.jsx)("div",{children:"loading..."})}),(function(t){return Object(y.jsx)(U,{player:t})}))(t)},H=function(t){t&&t instanceof Function&&e.e(3).then(e.bind(null,151)).then((function(n){var e=n.getCLS,i=n.getFID,r=n.getFCP,s=n.getLCP,a=n.getTTFB;e(t),i(t),r(t),s(t),a(t)}))};l.a.render(Object(y.jsx)(h.a.StrictMode,{children:Object(y.jsx)(G,{})}),document.getElementById("root")),H()}},[[150,1,2]]]);
//# sourceMappingURL=main.e624c0d7.chunk.js.map