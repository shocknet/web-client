(this["webpackJsonpshockwallet-web"]=this["webpackJsonpshockwallet-web"]||[]).push([[4],{1:function(e,t,n){"use strict";n.d(t,"c",(function(){return g})),n.d(t,"f",(function(){return v})),n.d(t,"i",(function(){return m})),n.d(t,"h",(function(){return _})),n.d(t,"e",(function(){return P})),n.d(t,"d",(function(){return E})),n.d(t,"g",(function(){return y})),n.d(t,"a",(function(){return A})),n.d(t,"b",(function(){return j}));var r=n(3),a=n(2),c=n.n(a),o=n(6),u=n(8),i=n(23),s=n.n(i),l=(n(18),n(73),function(e){try{return JSON.parse(e)}catch(t){return null}}(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).PEERS)),p=l||["https://gun.shock.network/gun","https://gun-eu.shock.network/gun"],d=function(e){return new Promise((function(t,n){setTimeout((function(){t(!0)}),e)}))},f=function(e){for(var t="",n=function(){var e=Math.floor(62*Math.random());return e<10?e:e<36?String.fromCharCode(e+55):String.fromCharCode(e+61)};t.length<e;)t+=n();return t},b=function(e){var t=Object(u.a)(e,2),n=t[0];return t[1]&&"_"!==n&&"#"!==n},O=function e(t){try{if(console.log("Incomplete Gun Response Check:",typeof t,t),null===t||void 0===t)return!0;if(Array.isArray(t))return!t.length||t.reduce((function(t,n){return t||e(n)}));if("object"===typeof t){if(!t||"number"===typeof t.err)return!0;var n=JSON.stringify(t);if(console.log(t,n),"{}"===n)return!0;var r=Object.entries(t).filter(b);if(console.log(r,null===r||void 0===r?void 0:r.length),!(null===r||void 0===r?void 0:r.length))return!0}return!1}catch(a){return console.warn("An error has occurred:",a),!0}},h=function(e){var t=e.path,n=e.gunPointer;return t.split("/").reduce((function(e,t){return e.get(t)}),n)},g=s()({axe:!1,peers:p}),v=function e(t){var n=t.path,r=void 0===n?"":n,a=t.retryDelay,u=void 0===a?500:a,i=t.retryLimit,s=void 0===i?3:i,l=t.retryCondition,p=void 0===l?O:l,f=t.gunPointer,b=void 0===f?g:f,v=t.method,m=void 0===v?"once":v,_=t._retryCount,P=void 0===_?0:_,E=t._fallbackResult;return new Promise((function(t){if(P>s)t(E);else{P>0&&console.log("Retrying event:",r,"".concat(P,"/").concat(s));var n=h({path:r,gunPointer:b});console.log("Fetching Path:",r),n[m](function(){var n=Object(o.a)(c.a.mark((function n(a){var o;return c.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(console.log(r+" Response:",a),!p||!p(a)){n.next=9;break}return n.next=4,d(u);case 4:return n.next=6,e({path:r,retryDelay:u,retryLimit:s,retryCondition:p,gunPointer:b,_retryCount:P+1,_fallbackResult:a});case 6:return o=n.sent,t(o),n.abrupt("return");case 9:t(a);case 10:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}())}}))},m=function(e){var t=e.path,n=void 0===t?"":t,r=e.data,a=void 0===r?{}:r,c=e.gunPointer,o=void 0===c?g:c;return new Promise((function(e,t){var r=h({path:n,gunPointer:o}).set(a,(function(t){console.log(a),e(r)}))}))},_=function(e){var t=e.path,n=void 0===t?"":t,r=e.gunPointer,a=void 0===r?g:r,c=e.callback;return h({path:n,gunPointer:a}).on((function(e){c(e)}))},P=function(){return new Promise((function(e,t){var n=f(10),a=f(10);g.user().create(n,a,(function(c){if(c.err)return console.error("An error has occurred while initializing a new user"),void t({field:"gundb",message:"An error has occurred while initializing a new user",_error:c.err,_event:c});e(Object(r.a)({},c,{alias:n,pass:a}))}))}))},E=function(e,t){return new Promise((function(n,r){g.user().auth(e,t,(function(e){n(e)}))}))},y=function(e){if(console.log("Getting Gun User:",e),!e)throw new Error("Undefined public key");return g.user(e)},A="$$_SHOCKWALLET__ENCRYPTED__",j="$$__SHOCKWALLET__MSG__"},13:function(e,t,n){"use strict";n.d(t,"a",(function(){return l})),n.d(t,"d",(function(){return d})),n.d(t,"e",(function(){return f})),n.d(t,"b",(function(){return b})),n.d(t,"g",(function(){return O})),n.d(t,"f",(function(){return h})),n.d(t,"h",(function(){return v})),n.d(t,"c",(function(){return m})),n.d(t,"k",(function(){return _})),n.d(t,"l",(function(){return P})),n.d(t,"j",(function(){return E})),n.d(t,"i",(function(){return y}));var r=n(17),a=n(3),c=n(2),o=n.n(c),u=n(6),i=n(8),s=n(1),l={LOAD_USER_WALL:"wall/load",LOAD_USER_WALL_TOTAL_PAGES:"wall/loadTotalPages",RESET_USER_WALL:"wall/reset",PIN_WALL_POST:"wall/pin",UPDATE_WALL_POST:"wall/post/update",RESET_USER_DATA:"user/reset",LOAD_USER_DATA:"user/load",LOAD_USER_AVATAR:"avatar/load",UPDATE_USER_PROFILE:"user/update"},p=function(e){var t=Object(i.a)(e,2),n=t[0];return t[1]&&"_"!==n&&"#"!==n},d=function(e){return function(){var t=Object(u.a)(o.a.mark((function t(n){var r,a;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=s.c.user(e),t.next=3,Object(s.f)({path:"profileBinary/avatar",gunPointer:r});case 3:return a=t.sent,n({type:l.UPDATE_USER_PROFILE,data:{avatar:a}}),t.abrupt("return",a);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},f=function(e){return function(){var t=Object(u.a)(o.a.mark((function t(n){var r,a;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=s.c.user(e),t.next=3,Object(s.f)({path:"profileBinary/header",gunPointer:r});case 3:return a=t.sent,n({type:l.UPDATE_USER_PROFILE,data:{header:a}}),t.abrupt("return",a);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},b=function(){var e=Object(u.a)(o.a.mark((function e(t){var n,r,a,c,u,l,p,d,f,b,O,h,g;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.publicKey,r=t.includeAvatar,a=void 0!==r&&r,c=s.c.user(n),e.next=4,Promise.all([Object(s.f)({path:"Profile/bio",gunPointer:c}),Object(s.f)({path:"Profile/displayName",gunPointer:c}),Object(s.f)({path:"alias",gunPointer:c}),Object(s.f)({path:"Profile/lastSeenApp",gunPointer:c}),Object(s.f)({path:"Profile/lastSeenNode",gunPointer:c}),a?Object(s.f)({path:"profileBinary/avatar",gunPointer:c}):void 0]);case 4:return u=e.sent,l=Object(i.a)(u,6),p=l[0],d=l[1],f=l[2],b=l[3],O=l[4],h=l[5],g={publicKey:n,bio:p,displayName:d,alias:f,lastSeenNode:O,lastSeenApp:b,avatar:h},e.abrupt("return",g);case 14:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),O=function(e){return function(){var t=Object(u.a)(o.a.mark((function t(n){var r;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,b({publicKey:e});case 2:return r=t.sent,console.log("User:",r),n({type:l.LOAD_USER_DATA,data:r}),t.abrupt("return",r);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},h=function(){var e=Object(u.a)(o.a.mark((function e(t){var n,r,c,l,d,f,b,O;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.id,r=t.gunPointer,c="".concat("posts","/").concat(n),l="".concat(c,"/contentItems"),e.next=5,Object(s.f)({path:c,gunPointer:r,retryLimit:5,retryDelay:1e3});case 5:return d=e.sent,e.next=8,Object(s.f)({path:l,gunPointer:r,retryLimit:5,retryDelay:500});case 8:return f=e.sent,b=Object.entries(f).filter(p),e.next=12,Promise.all(b.map(function(){var e=Object(u.a)(o.a.mark((function e(t){var n,a,c,u,p,d,f,b,O,h,g,v,m,_,P,E,y,A,j,w;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=Object(i.a)(t,1),a=n[0],e.next=3,Object(s.f)({path:"".concat(l,"/").concat(a,"/type"),gunPointer:r});case 3:if("text/paragraph"!==(c=e.sent)){e.next=9;break}return e.next=7,Object(s.f)({path:"".concat(l,"/").concat(a,"/text"),gunPointer:r});case 7:return u=e.sent,e.abrupt("return",{text:u,type:c});case 9:if("video/embedded"!==c){e.next=18;break}return e.next=12,Promise.all([Object(s.f)({path:"".concat(l,"/").concat(a,"/magnetURI"),gunPointer:r}),Object(s.f)({path:"".concat(l,"/").concat(a,"/width"),gunPointer:r}),Object(s.f)({path:"".concat(l,"/").concat(a,"/height"),gunPointer:r})]);case 12:return p=e.sent,d=Object(i.a)(p,3),f=d[0],b=d[1],O=d[2],e.abrupt("return",{magnetURI:f,width:b,height:O,type:c});case 18:if("image/embedded"!==c){e.next=27;break}return e.next=21,Promise.all([Object(s.f)({path:"".concat(l,"/").concat(a,"/magnetURI"),gunPointer:r}),Object(s.f)({path:"".concat(l,"/").concat(a,"/width"),gunPointer:r}),Object(s.f)({path:"".concat(l,"/").concat(a,"/height"),gunPointer:r})]);case 21:return h=e.sent,g=Object(i.a)(h,3),v=g[0],m=g[1],_=g[2],e.abrupt("return",{magnetURI:v,width:m,height:_,type:c});case 27:if("stream/embedded"!==c){e.next=44;break}return e.next=30,Object(s.f)({path:"".concat(l,"/").concat(a,"/magnetURI"),gunPointer:r});case 30:return P=e.sent,e.next=33,Object(s.f)({path:"".concat(l,"/").concat(a,"/liveStatus"),gunPointer:r});case 33:return E=e.sent,e.next=36,Object(s.f)({path:"".concat(l,"/").concat(a,"/playbackMagnet"),gunPointer:r});case 36:return y=e.sent,e.next=39,Object(s.f)({path:"".concat(l,"/").concat(a,"/viewersCounter"),gunPointer:r,retryLimit:1});case 39:return A=e.sent,j=c,w=P,"wasLive"===E&&y&&(w=y,j="video/embedded"),e.abrupt("return",{magnetURI:w,width:0,height:0,type:j,liveStatus:E,playbackMagnet:y,viewersCounter:A});case 44:return e.abrupt("return",{text:"Unsupported media type",type:c});case 45:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 12:return O=e.sent,e.abrupt("return",Object(a.a)({},null!==d&&void 0!==d?d:{},{id:n,contentItems:null!==O&&void 0!==O?O:[],type:"post"}));case 14:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),g=function(){var e=Object(u.a)(o.a.mark((function e(t){var n,r,a,c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.id,r=t.sharedGunPointer,a="".concat("sharedPosts","/").concat(n),e.next=4,Object(s.f)({path:a,gunPointer:r,retryLimit:5,retryDelay:1e3});case 4:return c=e.sent,e.abrupt("return",{id:n,date:c.shareDate,originalAuthor:c.originalAuthor,type:"shared"});case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),v=function(e){return function(){var t=Object(u.a)(o.a.mark((function t(n){var a,c,u,d,f,b,O,v,m;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,a=s.c.user(e),t.next=4,Promise.all([Object(s.f)({path:"posts",gunPointer:a,retryLimit:5,retryDelay:1e3}),Object(s.f)({path:"sharedPosts",gunPointer:a})]);case 4:return c=t.sent,u=Object(i.a)(c,2),d=u[0],f=u[1],console.log("Posts:",d),console.log("Shared Posts:",f),b=Object.entries(null!==d&&void 0!==d?d:{}).filter(p),O=Object.entries(null!==f&&void 0!==f?f:{}).filter(p),t.next=14,Promise.all([].concat(Object(r.a)(b.map((function(e,t){var n=Object(i.a)(e,1)[0];return h({id:n,gunPointer:a})}))),Object(r.a)(O.map((function(e,t){var n=Object(i.a)(e,1)[0];return g({id:n,sharedGunPointer:a})})))));case 14:return v=t.sent,console.log("User wall",v),m=v.sort((function(e,t){return t.date-e.date})),n({type:l.LOAD_USER_WALL,data:{posts:m,page:0}}),t.abrupt("return",v);case 21:t.prev=21,t.t0=t.catch(0),console.error(t.t0);case 24:case"end":return t.stop()}}),t,null,[[0,21]])})));return function(e){return t.apply(this,arguments)}}()},m=function(e){var t=e.publicKey,n=e.postId,r=e.type,a=void 0===r?"post":r;return function(){var e=Object(u.a)(o.a.mark((function e(r){var c,u,i;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("Getting Pinned post:",t,n,a),t&&n){e.next=3;break}return e.abrupt("return");case 3:if(c=s.c.user(t),"post"!==a){e.next=10;break}return e.next=7,h({id:n,gunPointer:c});case 7:return(u=e.sent)&&r({type:l.PIN_WALL_POST,data:u}),e.abrupt("return",u);case 10:if("sharedPost"!==a){e.next=16;break}return e.next=13,g({id:n,sharedGunPointer:c});case 13:return(i=e.sent)&&r({type:l.PIN_WALL_POST,data:i}),e.abrupt("return",i);case 16:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},_=function(e){return function(t){t({type:l.UPDATE_USER_PROFILE,data:e})}},P=function(e){return function(t){t({type:l.UPDATE_WALL_POST,data:e})}},E=function(){return function(e){e({type:l.RESET_USER_WALL})}},y=function(){return function(e){e({type:l.RESET_USER_DATA})}}},16:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"c",(function(){return d})),n.d(t,"b",(function(){return f})),n.d(t,"d",(function(){return b}));var r=n(2),a=n.n(r),c=n(3),o=n(8),u=n(6),i=n(18),s=n.n(i),l=n(1),p={LOAD_PAYMENT_REQUEST:"tip/paymentRequest/load",RESET_PAYMENT_REQUEST:"tip/paymentRequest/reset",OPEN_TIP_MODAL:"tip/modal/open",CLOSE_TIP_MODAL:"tip/modal/close",UPDATE_METADATA:"tip/metadata/update"},d=function(e){return{type:p.OPEN_TIP_MODAL,data:e}},f=function(){return{type:p.CLOSE_TIP_MODAL}},b=function(e){var t=e.senderPair,n=e.recipientPublicKey,r=e.amount,i=e.metadata;return function(){var e=Object(u.a)(a.a.mark((function e(u){var d,f,b,O,h,g,v,m,_,P,E,y,A,j,w,S,L;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(l.d)(t.alias,t.pass);case 2:return b=e.sent,O=l.c.user(n),e.next=6,Object(l.f)({path:"epub",gunPointer:O});case 6:return h=e.sent,e.next=9,s.a.secret(h,b.sea);case 9:return g=e.sent,e.next=12,Object(l.f)({path:"currentOrderAddress",gunPointer:O});case 12:return v=e.sent,console.log("Order Address:",v),e.next=16,Promise.all([s.a.encrypt(l.b+r.toString(),g),s.a.encrypt(l.b+"Tipped user!",g)]);case 16:return m=e.sent,_=Object(o.a)(m,2),P=_[0],E=_[1],y=Object(c.a)({amount:l.a+P,from:b.sea.pub,memo:l.a+E,timestamp:Date.now()},i),console.log("Order:",y),e.next=24,Object(l.i)({path:"orderNodes/".concat(v),data:y});case 24:return A=e.sent,console.log("New Order:",A,A._["#"].split("/").slice(-1)[0]),j=A._["#"].split("/").slice(-1)[0],console.log("New Order ID:",j,"orderToResponse/".concat(j)),e.next=30,Object(l.f)({path:"orderToResponse/".concat(j),gunPointer:l.c.user(n),method:"on"});case 30:return e.next=32,Object(l.f)({path:"orderToResponse/".concat(j),gunPointer:l.c.user(n)});case 32:return w=e.sent,console.log("Encrypted Order:",w.response,null===(d=w.response)||void 0===d?void 0:d.toString()),e.next=36,s.a.decrypt(w.response.replace(l.a,""),g);case 36:if(S=e.sent,L={response:null===S||void 0===S||null===(f=S.replace)||void 0===f?void 0:f.call(S,l.b,""),type:w.type},console.log("[ORDER] Decrypted order:",L),"err"!==L.type){e.next=41;break}throw{field:"order",message:"An error has occurred while retrieving the order",data:L.response.replace(l.a,"")};case 41:return u({type:p.LOAD_PAYMENT_REQUEST,data:L.response.replace(l.a,"")}),e.abrupt("return",L.response.replace(l.a,""));case 43:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}},33:function(e,t,n){"use strict";var r=n(0),a=n.n(r);n(57);t.a=function(e){var t=e.text,n=void 0===t?"Loading...":t;return a.a.createElement("div",{className:"loading-wall"},a.a.createElement("div",{className:"loading-wall-icon"},a.a.createElement("span",{className:"loading-circle loading-circle-1"}),a.a.createElement("span",{className:"loading-circle loading-circle-2"}),a.a.createElement("span",{className:"loading-circle loading-circle-3"}),a.a.createElement("span",{className:"loading-circle loading-circle-4"}),a.a.createElement("span",{className:"loading-circle loading-circle-5"})),a.a.createElement("div",{className:"loading-wall-text"},n))}},37:function(e,t){function n(e){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}n.keys=function(){return[]},n.resolve=n,e.exports=n,n.id=37},39:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return i}));var r=n(2),a=n.n(r),c=n(6),o=n(1),u={LOAD_GUN_PAIR:"auth/loadPair"},i=function(){return function(){var e=Object(c.a)(a.a.mark((function e(t){var n,r,c,i,s,l,p,d;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=localStorage.getItem("shocknet/gun/alias"),r=localStorage.getItem("shocknet/gun/pass"),c=localStorage.getItem("shocknet/gun/pub"),i=localStorage.getItem("shocknet/gun/epub"),n&&r){e.next=19;break}return console.log("[Gun] Keypair not found, generating a new one..."),e.next=8,Object(o.e)();case 8:return s=e.sent,localStorage.setItem("shocknet/gun/alias",s.alias),localStorage.setItem("shocknet/gun/pass",s.pass),localStorage.setItem("shocknet/gun/pub",s.pub),l=o.c.user(s.pub),e.next=15,Object(o.f)({path:"epub",gunPointer:l});case 15:return p=e.sent,localStorage.setItem("shocknet/gun/epub",p),t({type:u.LOAD_GUN_PAIR,data:s}),e.abrupt("return");case 19:return console.log("[Gun] Keypair exists!"),d={pub:c,alias:n,epub:i,pass:r},console.log("[Gun] User Authenticated"),t({type:u.LOAD_GUN_PAIR,data:d}),e.abrupt("return",d);case 24:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}},47:function(e,t,n){e.exports=n(75)},56:function(e,t,n){},57:function(e,t,n){},58:function(e,t,n){},75:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),c=n(21),o=n.n(c),u=n(32),i=n(25),s=(n(56),n(5)),l=n(33),p=(n(58),a.a.lazy((function(){return Promise.all([n.e(2),n.e(3),n.e(10)]).then(n.bind(null,539))}))),d=a.a.lazy((function(){return Promise.all([n.e(3),n.e(11)]).then(n.bind(null,540))}));var f=Object(s.i)((function(){return a.a.createElement("div",{className:"App"},a.a.createElement(r.Suspense,{fallback:a.a.createElement(l.a,null)},a.a.createElement(s.d,null,a.a.createElement(s.b,{path:"/user/:userId",component:p}),a.a.createElement(s.b,{path:"/:userId/:type/:postId",component:d}),a.a.createElement(s.b,{path:"/:userId",component:p}),a.a.createElement(s.a,{to:"/qsgziGQS99sPUxV1CRwwRckn9cG6cJ3prbDsrbL7qko.oRbCaVKwJFQURWrS1pFhkfAzrkEvkQgBRIUz9uoWtrg"}))))})),b=n(12),O=n(30),h=n(17),g=n(3),v=n(13),m={wall:{posts:[],page:-1,totalPages:0},profile:{}},_=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:m,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case v.a.LOAD_USER_WALL:var n=t.data;return Object(g.a)({},e,{wall:Object(g.a)({},e.wall,{posts:[].concat(Object(h.a)(e.wall.posts),Object(h.a)(n.posts)),page:n.page})});case v.a.LOAD_USER_WALL_TOTAL_PAGES:var r=t.data;return Object(g.a)({},e,{wall:Object(g.a)({},e.wall,{totalPages:r})});case v.a.LOAD_USER_DATA:var a=t.data;return Object(g.a)({},e,{profile:a});case v.a.LOAD_USER_AVATAR:var c=t.data;return Object(g.a)({},e,{profile:Object(g.a)({},e.profile,{avatar:c})});case v.a.UPDATE_USER_PROFILE:var o=t.data;return Object(g.a)({},e,{profile:Object(g.a)({},e.profile,{},o)});case v.a.UPDATE_WALL_POST:var u=t.data;return Object(g.a)({},e,{wall:Object(g.a)({},e.wall,{posts:e.wall.posts.map((function(e){return u.postID===e.id?Object(g.a)({},e,{},u.data):e}))})});case v.a.PIN_WALL_POST:var i=t.data;return Object(g.a)({},e,{wall:Object(g.a)({},e.wall,{pinnedPost:Object(g.a)({},i,{pinned:!0})})});case v.a.RESET_USER_WALL:return Object(g.a)({},e,{wall:m.wall});default:return e}},P=n(39),E={pair:{}},y=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:E,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case P.a.LOAD_GUN_PAIR:var n=t.data;return Object(g.a)({},e,{pair:n});default:return e}},A=n(16),j={paymentRequest:null},w=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:j,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case A.a.LOAD_PAYMENT_REQUEST:var n=t.data;return Object(g.a)({},e,{paymentRequest:n});case A.a.RESET_PAYMENT_REQUEST:return Object(g.a)({},e,{paymentRequest:null});case A.a.OPEN_TIP_MODAL:var r=t.data;return Object(g.a)({},e,{modalOpen:!0,metadata:r});case A.a.CLOSE_TIP_MODAL:return Object(g.a)({},e,{modalOpen:!1,metadata:{}});case A.a.UPDATE_METADATA:var a=t.data;return Object(g.a)({},e,{metadata:a});default:return e}},S=Object(b.c)({user:_,auth:y,tip:w}),L=window.__REDUX_DEVTOOLS_EXTENSION__?Object(b.e)(S,Object(b.d)(Object(b.a)(O.a),window.__REDUX_DEVTOOLS_EXTENSION__())):Object(b.e)(S,Object(b.a)(O.a));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(a.a.createElement(u.a,{store:L},a.a.createElement(a.a.StrictMode,null,a.a.createElement(i.a,{basename:"/"},a.a.createElement(f,null)))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[47,5,7]]]);
//# sourceMappingURL=main.7cc46ec8.chunk.js.map