(this["webpackJsonpshockwallet-web"]=this["webpackJsonpshockwallet-web"]||[]).push([[11],{119:function(e,t,a){e.exports=a.p+"static/media/av1.48bf5c6a.jpg"},135:function(e,t,a){"use strict";var n=a(9),c=a(0),r=a(34),i=a(118),s=a.n(i),l=a(1);t.a=function(e){var t=Object(r.b)(),a=Object(r.c)((function(e){return e.user.profile})),i=Object(c.useState)(!1),u=Object(n.a)(i,2),o=u[0],b=u[1],f=Object(c.useState)(!1),m=Object(n.a)(f,2),p=m[0],d=m[1],O=Object(c.useState)(!1),j=Object(n.a)(O,2),v=j[0],E=j[1],h=Object(c.useState)(!1),k=Object(n.a)(h,2),g=k[0],N=k[1],y=Object(c.useState)(),P=Object(n.a)(y,2),S=P[0],w=P[1],C=Object(c.useCallback)((function(){var e=s.a.utc().subtract(1,"minutes"),t=s.a.utc(p).isSameOrAfter(e),a=s.a.utc(o).isSameOrAfter(e);N(t),E(a)}),[o,p]);return Object(c.useEffect)((function(){S&&clearTimeout(S),C();var e=setTimeout((function(){C()}),3e4);return w(e),function(){return clearTimeout(S)}}),[a,C]),Object(c.useEffect)((function(){var t=Object(l.h)({path:"Profile/lastSeenApp",gunPointer:Object(l.g)(e),callback:function(e){b(e)}}),a=Object(l.h)({path:"Profile/lastSeenNode",gunPointer:Object(l.g)(e),callback:function(e){d(e)}});return function(){t.off(),a.off()}}),[t,e]),{isOnlineApp:v,isOnlineNode:g}}},136:function(e,t,a){"use strict";var n=a(0),c=a.n(n),r=a(34),i=a(16),s=a(35),l=(a(137),c.a.lazy((function(){return Promise.all([a.e(2),a.e(9),a.e(14)]).then(a.bind(null,177))})));t.a=function(e){var t=Object(r.b)(),a=Object(r.c)((function(e){return e.tip.modalOpen})),u=Object(n.useCallback)((function(){t(Object(i.b)())}),[t]),o=Object(n.useMemo)((function(){return c.a.createElement(s.a,{text:"Loading..."})}),[]);return a?c.a.createElement("div",{className:"modal-container"},c.a.createElement("div",{className:"modal-overlay",onClick:u}),c.a.createElement("div",{className:"modal-content"},c.a.createElement(n.Suspense,{fallback:o},c.a.createElement(l,e)))):null}},137:function(e,t,a){},286:function(e,t,a){},287:function(e,t,a){},546:function(e,t,a){"use strict";a.r(t);var n=a(2),c=a.n(n),r=a(7),i=a(9),s=a(0),l=a.n(s),u=a(34),o=a(6),b=a(14),f=a(135),m=a(35),p=(a(286),l.a.createElement("div",{className:"navbar-icon"})),d=function(e){var t=e.title,a=e.goBack;return l.a.createElement("div",{className:"navbar"},a?l.a.createElement("div",{className:"navbar-icon",onClick:a},l.a.createElement("i",{className:"fas fa-arrow-left"})):p,l.a.createElement("p",{className:"navbar-title"},t),p)},O=a(119),j=a.n(O),v=(a(287),a(136)),E=l.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(1),a.e(15)]).then(a.bind(null,281))})),h=l.a.lazy((function(){return Promise.all([a.e(0),a.e(2),a.e(1),a.e(12)]).then(a.bind(null,540))}));t.default=function(){var e=Object(u.b)(),t=Object(o.h)(),a=t.postId,n=t.type,p=t.userId,O=Object(o.g)(),k=Object(u.c)((function(e){return e.user.profile})),g=Object(u.c)((function(e){var t;return null===(t=e.user.wall)||void 0===t?void 0:t.pinnedPost})),N=Object(s.useState)(!0),y=Object(i.a)(N,2),P=y[0],S=y[1],w=Object(f.a)(p).isOnlineNode,C=Object(s.useMemo)((function(){var e,t;return null!==(e=null!==(t=k.displayName)&&void 0!==t?t:k.alias)&&void 0!==e?e:"POSTS"}),[k.alias,k.displayName]),x=Object(s.useCallback)(Object(r.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e(Object(b.i)()),t.next=3,e(Object(b.g)(p));case 3:e(Object(b.d)(p));case 4:case"end":return t.stop()}}),t)}))),[e,p]),I=Object(s.useCallback)(Object(r.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e(Object(b.c)({postId:a,type:n,publicKey:p}));case 1:case"end":return t.stop()}}),t)}))),[e,a,n,p]),A=Object(s.useCallback)(Object(r.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return S(!0),e.next=3,x();case 3:I(),S(!1);case 5:case"end":return e.stop()}}),e)}))),[I,x]),K=Object(s.useCallback)((function(){O.push("/".concat(p))}),[O,p]),T=Object(s.useCallback)((function(e){if(e){var t,a,n=k.avatar?"data:image/png;base64,".concat(k.avatar):j.a;if("shared"===e.type)return l.a.createElement(s.Suspense,{fallback:l.a.createElement("div",{className:"post-loading"},l.a.createElement(m.a,{text:"Loading Post..."})),key:e.id},l.a.createElement(h,{postID:e.id,postPublicKey:e.originalAuthor,sharedPostId:e.id,sharedTimestamp:e.date,sharerAvatar:n,sharerPublicKey:p,sharerUsername:C,isOnlineNode:w}));if("post"===e.type)return l.a.createElement(s.Suspense,{fallback:l.a.createElement("div",{className:"post-loading"},l.a.createElement(m.a,{text:"Loading Post..."})),key:e.id},l.a.createElement(E,{timestamp:e.date,contentItems:e.contentItems,username:C,avatar:n,publicKey:p,page:e.page,id:e.id,tipValue:null!==(t=e.tipValue)&&void 0!==t?t:0,tipCounter:null!==(a=e.tipCounter)&&void 0!==a?a:0,isOnlineNode:w,pinned:!0}))}}),[w,k.avatar,p,C]);return Object(s.useEffect)((function(){A()}),[A]),P?l.a.createElement(m.a,{text:"Loading Post..."}):l.a.createElement("div",{className:"post-page has-nav"},l.a.createElement(d,{title:C,goBack:K}),l.a.createElement("div",{className:"posts-container"},T(g)),l.a.createElement(v.a,{publicKey:p}))}}}]);
//# sourceMappingURL=11.e434ebd9.chunk.js.map