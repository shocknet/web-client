(this["webpackJsonpshockwallet-web"]=this["webpackJsonpshockwallet-web"]||[]).push([[1],{1:function(e,t,n){"use strict";n.d(t,"c",(function(){return O})),n.d(t,"f",(function(){return v})),n.d(t,"i",(function(){return m})),n.d(t,"h",(function(){return E})),n.d(t,"e",(function(){return _})),n.d(t,"d",(function(){return P})),n.d(t,"g",(function(){return y})),n.d(t,"a",(function(){return w})),n.d(t,"b",(function(){return j}));var r=n(5),a=n(3),o=n.n(a),c=n(7),u=n(9),i=n(22),s=n.n(i),l=(n(17),n(75),function(e){try{return JSON.parse(e)}catch(t){return null}}(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).PEERS)),p=l||["https://gun.shock.network:8765/gun","https://gun-eu.shock.network:8765/gun"],d=function(e){return new Promise((function(t,n){setTimeout((function(){t(!0)}),e)}))},f=function(e){for(var t="",n=function(){var e=Math.floor(62*Math.random());return e<10?e:e<36?String.fromCharCode(e+55):String.fromCharCode(e+61)};t.length<e;)t+=n();return t},g=function(e){var t=Object(u.a)(e,2),n=t[0];return t[1]&&"_"!==n&&"#"!==n},b=function e(t){try{if(console.log("Incomplete Gun Response Check:",typeof t,t),null===t||void 0===t)return!0;if(Array.isArray(t))return!t.length||t.reduce((function(t,n){return t||e(n)}));if("object"===typeof t){if(!t||"number"===typeof t.err)return!0;var n=JSON.stringify(t);if(console.log(t,n),"{}"===n)return!0;var r=Object.entries(t).filter(g);if(console.log(r,null===r||void 0===r?void 0:r.length),!(null===r||void 0===r?void 0:r.length))return!0}return!1}catch(a){return console.warn("An error has occurred:",a),!0}},h=function(e){var t=e.path,n=e.gunPointer;return t.split("/").reduce((function(e,t){return e.get(t)}),n)},O=s()(p),v=function e(t){var n=t.path,r=void 0===n?"":n,a=t.retryDelay,u=void 0===a?500:a,i=t.retryLimit,s=void 0===i?3:i,l=t.retryCondition,p=void 0===l?b:l,f=t.gunPointer,g=void 0===f?O:f,v=t.method,m=void 0===v?"once":v,E=t._retryCount,_=void 0===E?0:E,P=t._fallbackResult;return new Promise((function(t){if(_>s)t(P);else{_>0&&console.log("Retrying event:",r,"".concat(_,"/").concat(s));var n=h({path:r,gunPointer:g});console.log("Fetching Path:",r),n[m](function(){var n=Object(c.a)(o.a.mark((function n(a){var c;return o.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(console.log(r+" Response:",a),!p||!p(a)){n.next=9;break}return n.next=4,d(u);case 4:return n.next=6,e({path:r,retryDelay:u,retryLimit:s,retryCondition:p,gunPointer:g,_retryCount:_+1,_fallbackResult:a});case 6:return c=n.sent,t(c),n.abrupt("return");case 9:t(a);case 10:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}())}}))},m=function(e){var t=e.path,n=void 0===t?"":t,r=e.data,a=void 0===r?{}:r,o=e.gunPointer,c=void 0===o?O:o;return new Promise((function(e,t){var r=h({path:n,gunPointer:c}).set(a,(function(t){console.log(a),e(r)}))}))},E=function(e){var t=e.path,n=void 0===t?"":t,r=e.gunPointer,a=void 0===r?O:r,o=e.callback;return h({path:n,gunPointer:a}).on((function(e){o(e)}))},_=function(){return new Promise((function(e,t){var n=f(10),a=f(10);O.user().create(n,a,(function(o){if(o.err)return console.error("An error has occurred while initializing a new user"),void t({field:"gundb",message:"An error has occurred while initializing a new user",_error:o.err,_event:o});e(Object(r.a)({},o,{alias:n,pass:a}))}))}))},P=function(e,t){return new Promise((function(n,r){O.user().auth(e,t,(function(e){n(e)}))}))},y=function(e){if(console.log("Getting Gun User:",e),!e)throw new Error("Undefined public key");return O.user(e)},w="$$_SHOCKWALLET__ENCRYPTED__",j="$$__SHOCKWALLET__MSG__"},14:function(e,t,n){"use strict";n.d(t,"a",(function(){return l})),n.d(t,"c",(function(){return d})),n.d(t,"d",(function(){return f})),n.d(t,"b",(function(){return g})),n.d(t,"f",(function(){return b})),n.d(t,"e",(function(){return h})),n.d(t,"g",(function(){return v})),n.d(t,"j",(function(){return m})),n.d(t,"k",(function(){return E})),n.d(t,"i",(function(){return _})),n.d(t,"h",(function(){return P}));var r=n(16),a=n(5),o=n(3),c=n.n(o),u=n(7),i=n(9),s=n(1),l={LOAD_USER_WALL:"wall/load",LOAD_USER_WALL_TOTAL_PAGES:"wall/loadTotalPages",RESET_USER_WALL:"wall/reset",UPDATE_WALL_POST:"wallPost/update",RESET_USER_DATA:"user/reset",LOAD_USER_DATA:"user/load",LOAD_USER_AVATAR:"avatar/load",UPDATE_USER_PROFILE:"user/update"},p=function(e){var t=Object(i.a)(e,2),n=t[0];return t[1]&&"_"!==n&&"#"!==n},d=function(e){return function(){var t=Object(u.a)(c.a.mark((function t(n){var r,a;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=s.c.user(e),t.next=3,Object(s.f)({path:"profileBinary/avatar",gunPointer:r});case 3:return a=t.sent,n({type:l.UPDATE_USER_PROFILE,data:{avatar:a}}),t.abrupt("return",a);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},f=function(e){return function(){var t=Object(u.a)(c.a.mark((function t(n){var r,a;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=s.c.user(e),t.next=3,Object(s.f)({path:"profileBinary/header",gunPointer:r});case 3:return a=t.sent,n({type:l.UPDATE_USER_PROFILE,data:{header:a}}),t.abrupt("return",a);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},g=function(){var e=Object(u.a)(c.a.mark((function e(t){var n,r,a,o,u,l,p,d,f,g,b,h,O;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.publicKey,r=t.includeAvatar,a=void 0!==r&&r,o=s.c.user(n),e.next=4,Promise.all([Object(s.f)({path:"Profile/bio",gunPointer:o}),Object(s.f)({path:"Profile/displayName",gunPointer:o}),Object(s.f)({path:"alias",gunPointer:o}),Object(s.f)({path:"Profile/lastSeenApp",gunPointer:o}),Object(s.f)({path:"Profile/lastSeenNode",gunPointer:o}),a?Object(s.f)({path:"profileBinary/avatar",gunPointer:o}):null]);case 4:return u=e.sent,l=Object(i.a)(u,6),p=l[0],d=l[1],f=l[2],g=l[3],b=l[4],h=l[5],O={publicKey:n,bio:p,displayName:d,alias:f,lastSeenNode:b,lastSeenApp:g,avatar:h},e.abrupt("return",O);case 14:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),b=function(e){return function(){var t=Object(u.a)(c.a.mark((function t(n){var r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,g({publicKey:e});case 2:return r=t.sent,console.log("User:",r),n({type:l.LOAD_USER_DATA,data:r}),t.abrupt("return",r);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},h=function(){var e=Object(u.a)(c.a.mark((function e(t){var n,r,o,l,d,f,g,b;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.id,r=t.gunPointer,o="".concat("posts","/").concat(n),l="".concat(o,"/contentItems"),e.next=5,Object(s.f)({path:o,gunPointer:r,retryLimit:5,retryDelay:1e3});case 5:return d=e.sent,e.next=8,Object(s.f)({path:l,gunPointer:r,retryLimit:5,retryDelay:500});case 8:return f=e.sent,g=Object.entries(f).filter(p),e.next=12,Promise.all(g.map(function(){var e=Object(u.a)(c.a.mark((function e(t){var n,a,o,u,p,d,f,g,b,h,O,v,m,E,_,P,y,w,j;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=Object(i.a)(t,1),a=n[0],e.next=3,Object(s.f)({path:"".concat(l,"/").concat(a,"/type"),gunPointer:r});case 3:if("text/paragraph"!==(o=e.sent)){e.next=9;break}return e.next=7,Object(s.f)({path:"".concat(l,"/").concat(a,"/text"),gunPointer:r});case 7:return u=e.sent,e.abrupt("return",{text:u,type:o});case 9:if("video/embedded"!==o){e.next=18;break}return e.next=12,Promise.all([Object(s.f)({path:"".concat(l,"/").concat(a,"/magnetURI"),gunPointer:r}),Object(s.f)({path:"".concat(l,"/").concat(a,"/width"),gunPointer:r}),Object(s.f)({path:"".concat(l,"/").concat(a,"/height"),gunPointer:r})]);case 12:return p=e.sent,d=Object(i.a)(p,3),f=d[0],g=d[1],b=d[2],e.abrupt("return",{magnetURI:f,width:g,height:b,type:o});case 18:if("image/embedded"!==o){e.next=27;break}return e.next=21,Promise.all([Object(s.f)({path:"".concat(l,"/").concat(a,"/magnetURI"),gunPointer:r}),Object(s.f)({path:"".concat(l,"/").concat(a,"/width"),gunPointer:r}),Object(s.f)({path:"".concat(l,"/").concat(a,"/height"),gunPointer:r})]);case 21:return h=e.sent,O=Object(i.a)(h,3),v=O[0],m=O[1],E=O[2],e.abrupt("return",{magnetURI:v,width:m,height:E,type:o});case 27:if("stream/embedded"!==o){e.next=41;break}return e.next=30,Object(s.f)({path:"".concat(l,"/").concat(a,"/magnetURI"),gunPointer:r});case 30:return _=e.sent,e.next=33,Object(s.f)({path:"".concat(l,"/").concat(a,"/liveStatus"),gunPointer:r});case 33:return P=e.sent,e.next=36,Object(s.f)({path:"".concat(l,"/").concat(a,"/playbackMagnet"),gunPointer:r});case 36:return y=e.sent,w=o,j=_,"wasLive"===P&&y&&(j=y,w="video/embedded"),e.abrupt("return",{magnetURI:j,width:0,height:0,type:w,liveStatus:P,playbackMagnet:y});case 41:return e.abrupt("return",{text:"Unsupported media type",type:o});case 42:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 12:return b=e.sent,e.abrupt("return",Object(a.a)({},null!==d&&void 0!==d?d:{},{id:n,contentItems:null!==b&&void 0!==b?b:[],type:"post"}));case 14:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),O=function(){var e=Object(u.a)(c.a.mark((function e(t){var n,r,a,o;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.id,r=t.sharedGunPointer,a="".concat("sharedPosts","/").concat(n),e.next=4,Object(s.f)({path:a,gunPointer:r,retryLimit:5,retryDelay:1e3});case 4:return o=e.sent,e.abrupt("return",{id:n,date:o.shareDate,originalAuthor:o.originalAuthor,type:"shared"});case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),v=function(e){return function(){var t=Object(u.a)(c.a.mark((function t(n){var a,o,u,d,f,g,b,v,m;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,a=s.c.user(e),t.next=4,Promise.all([Object(s.f)({path:"posts",gunPointer:a,retryLimit:5,retryDelay:1e3}),Object(s.f)({path:"sharedPosts",gunPointer:a})]);case 4:return o=t.sent,u=Object(i.a)(o,2),d=u[0],f=u[1],console.log("Posts:",d),console.log("Shared Posts:",f),g=Object.entries(null!==d&&void 0!==d?d:{}).filter(p),b=Object.entries(null!==f&&void 0!==f?f:{}).filter(p),t.next=14,Promise.all([].concat(Object(r.a)(g.map((function(e,t){var n=Object(i.a)(e,1)[0];return h({id:n,gunPointer:a})}))),Object(r.a)(b.map((function(e,t){var n=Object(i.a)(e,1)[0];return O({id:n,sharedGunPointer:a})})))));case 14:return v=t.sent,console.log("User wall",v),m=v.sort((function(e,t){return t.date-e.date})),n({type:l.LOAD_USER_WALL,data:{posts:m,page:0}}),t.abrupt("return",v);case 21:t.prev=21,t.t0=t.catch(0),console.error(t.t0);case 24:case"end":return t.stop()}}),t,null,[[0,21]])})));return function(e){return t.apply(this,arguments)}}()},m=function(e){return function(t){t({type:l.UPDATE_USER_PROFILE,data:e})}},E=function(e){return function(t){t({type:l.UPDATE_WALL_POST,data:e})}},_=function(){return function(e){e({type:l.RESET_USER_WALL})}},P=function(){return function(e){e({type:l.RESET_USER_DATA})}}},26:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return d})),n.d(t,"c",(function(){return f}));var r=n(3),a=n.n(r),o=n(5),c=n(9),u=n(7),i=n(17),s=n.n(i),l=n(1),p={LOAD_PAYMENT_REQUEST:"paymentRequest/load",RESET_PAYMENT_REQUEST:"paymentRequest/reset"},d=function(e){var t=e.senderPair,n=e.recipientPublicKey,r=e.amount,i=e.metadata;return function(){var e=Object(u.a)(a.a.mark((function e(u){var d,f,g,b,h,O,v,m,E,_,P,y,w,j,A,S,R;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(l.d)(t.alias,t.pass);case 2:return g=e.sent,b=l.c.user(n),e.next=6,Object(l.f)({path:"epub",gunPointer:b});case 6:return h=e.sent,e.next=9,s.a.secret(h,g.sea);case 9:return O=e.sent,e.next=12,Object(l.f)({path:"currentOrderAddress",gunPointer:b});case 12:return v=e.sent,console.log("Order Address:",v),e.next=16,Promise.all([s.a.encrypt(l.b+r.toString(),O),s.a.encrypt(l.b+"Tipped user!",O)]);case 16:return m=e.sent,E=Object(c.a)(m,2),_=E[0],P=E[1],y=Object(o.a)({amount:l.a+_,from:g.sea.pub,memo:l.a+P,timestamp:Date.now()},i),console.log("Order:",y),e.next=24,Object(l.i)({path:"orderNodes/".concat(v),data:y});case 24:return w=e.sent,console.log("New Order:",w,w._["#"].split("/").slice(-1)[0]),j=w._["#"].split("/").slice(-1)[0],console.log("New Order ID:",j,"orderToResponse/".concat(j)),e.next=30,Object(l.f)({path:"orderToResponse/".concat(j),gunPointer:l.c.user(n),method:"on"});case 30:return e.next=32,Object(l.f)({path:"orderToResponse/".concat(j),gunPointer:l.c.user(n)});case 32:return A=e.sent,console.log("Encrypted Order:",A.response,null===(d=A.response)||void 0===d?void 0:d.toString()),e.next=36,s.a.decrypt(A.response.replace(l.a,""),O);case 36:if(S=e.sent,R={response:null===S||void 0===S||null===(f=S.replace)||void 0===f?void 0:f.call(S,l.b,""),type:A.type},console.log("[ORDER] Decrypted order:",R),"err"!==R.type){e.next=41;break}throw{field:"order",message:"An error has occurred while retrieving the order",data:R.response.replace(l.a,"")};case 41:return u({type:p.LOAD_PAYMENT_REQUEST,data:R.response.replace(l.a,"")}),e.abrupt("return",R.response.replace(l.a,""));case 43:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},f=function(){return function(e){e({type:p.RESET_PAYMENT_REQUEST})}}},35:function(e,t,n){"use strict";var r=n(0),a=n.n(r);n(58);t.a=function(e){var t=e.text,n=void 0===t?"Loading...":t;return a.a.createElement("div",{className:"loading-wall"},a.a.createElement("div",{className:"loading-wall-icon"},a.a.createElement("span",{className:"loading-circle loading-circle-1"}),a.a.createElement("span",{className:"loading-circle loading-circle-2"}),a.a.createElement("span",{className:"loading-circle loading-circle-3"}),a.a.createElement("span",{className:"loading-circle loading-circle-4"}),a.a.createElement("span",{className:"loading-circle loading-circle-5"})),a.a.createElement("div",{className:"loading-wall-text"},n))}},38:function(e,t){function n(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}n.keys=function(){return[]},n.resolve=n,e.exports=n,n.id=38},40:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return i}));var r=n(3),a=n.n(r),o=n(7),c=n(1),u={LOAD_GUN_PAIR:"auth/loadPair"},i=function(){return function(){var e=Object(o.a)(a.a.mark((function e(t){var n,r,o,i,s,l,p,d;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=localStorage.getItem("shocknet/gun/alias"),r=localStorage.getItem("shocknet/gun/pass"),o=localStorage.getItem("shocknet/gun/pub"),i=localStorage.getItem("shocknet/gun/epub"),n&&r){e.next=19;break}return console.log("[Gun] Keypair not found, generating a new one..."),e.next=8,Object(c.e)();case 8:return s=e.sent,localStorage.setItem("shocknet/gun/alias",s.alias),localStorage.setItem("shocknet/gun/pass",s.pass),localStorage.setItem("shocknet/gun/pub",s.pub),l=c.c.user(s.pub),e.next=15,Object(c.f)({path:"epub",gunPointer:l});case 15:return p=e.sent,localStorage.setItem("shocknet/gun/epub",p),t({type:u.LOAD_GUN_PAIR,data:s}),e.abrupt("return");case 19:return console.log("[Gun] Keypair exists!"),d={pub:o,alias:n,epub:i,pass:r},console.log("[Gun] User Authenticated"),t({type:u.LOAD_GUN_PAIR,data:d}),e.abrupt("return",d);case 24:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}},48:function(e,t,n){e.exports=n(77)},57:function(e,t,n){},58:function(e,t,n){},59:function(e,t,n){},60:function(e,t,n){},77:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(20),c=n.n(o),u=n(32),i=n(24),s=(n(57),n(6)),l=n(33),p=n(35),d=(n(59),n(60),a.a.lazy((function(){return Promise.all([n.e(3),n.e(5)]).then(n.bind(null,530))})));var f=Object(s.h)((function(){return a.a.createElement("div",{className:"App"},a.a.createElement(r.Suspense,{fallback:a.a.createElement(p.a,null)},a.a.createElement(s.d,null,a.a.createElement(s.b,{path:"/user/:userId",component:d}),a.a.createElement(s.b,{path:"/:userId",component:d}),a.a.createElement(s.a,{to:"/qsgziGQS99sPUxV1CRwwRckn9cG6cJ3prbDsrbL7qko.oRbCaVKwJFQURWrS1pFhkfAzrkEvkQgBRIUz9uoWtrg"}))),a.a.createElement(l.a,{backgroundColor:"#3a4d67",effect:"solid"}))})),g=n(13),b=n(30),h=n(16),O=n(5),v=n(14),m={wall:{posts:[],page:-1,totalPages:0},profile:{}},E=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:m,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case v.a.LOAD_USER_WALL:var n=t.data;return Object(O.a)({},e,{wall:Object(O.a)({},e.wall,{posts:[].concat(Object(h.a)(e.wall.posts),Object(h.a)(n.posts)),page:n.page})});case v.a.LOAD_USER_WALL_TOTAL_PAGES:var r=t.data;return console.log("Total pages:",r),Object(O.a)({},e,{wall:Object(O.a)({},e.wall,{totalPages:r})});case v.a.LOAD_USER_DATA:var a=t.data;return Object(O.a)({},e,{profile:a});case v.a.LOAD_USER_AVATAR:var o=t.data;return Object(O.a)({},e,{profile:Object(O.a)({},e.profile,{avatar:o})});case v.a.UPDATE_USER_PROFILE:var c=t.data;return Object(O.a)({},e,{profile:Object(O.a)({},e.profile,{},c)});case v.a.UPDATE_WALL_POST:var u=t.data;return Object(O.a)({},e,{wall:Object(O.a)({},e.wall,{posts:e.wall.posts.map((function(e){return u.postID===e.id?Object(O.a)({},e,{},u.data):e}))})});case v.a.RESET_USER_WALL:return Object(O.a)({},e,{wall:m.wall});default:return e}},_=n(40),P={pair:{}},y=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:P,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case _.a.LOAD_GUN_PAIR:var n=t.data;return Object(O.a)({},e,{pair:n});default:return e}},w=n(26),j={paymentRequest:null},A=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:j,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case w.a.LOAD_PAYMENT_REQUEST:var n=t.data;return Object(O.a)({},e,{paymentRequest:n});case w.a.RESET_PAYMENT_REQUEST:return Object(O.a)({},e,{paymentRequest:null});default:return e}},S=Object(g.c)({user:E,auth:y,transaction:A}),R=window.__REDUX_DEVTOOLS_EXTENSION__?Object(g.e)(S,Object(g.d)(Object(g.a)(b.a),window.__REDUX_DEVTOOLS_EXTENSION__())):Object(g.e)(S,Object(g.a)(b.a));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(a.a.createElement(u.a,{store:R},a.a.createElement(a.a.StrictMode,null,a.a.createElement(i.a,{basename:"/"},a.a.createElement(f,null)))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[48,2,4]]]);
//# sourceMappingURL=main.9d158588.chunk.js.map