(this["webpackJsonpshockwallet-web"]=this["webpackJsonpshockwallet-web"]||[]).push([[6,7],{154:function(e,t,a){"use strict";a.r(t);var n=a(9),c=a(0),r=a.n(c),i=a(121),l=a.n(i),o=a(33),s=a(32),u=a(271),m=a(259),d=a.n(m),p=a(14),b=(a(88),a(1)),f=function(e){var t=e.tipCounter,a=e.tipValue,n=e.zoomed;return a>0?r.a.createElement("div",{className:"ribbon-container",style:{opacity:n?0:1}},r.a.createElement("p",{className:"ribbon-title"},"Total Tips"),r.a.createElement("p",{className:"ribbon-value"},t," ",1===t?"Tip":"Tips")):null},v=function(e){var t=e.id,a=e.item,n=e.index,c=e.postId,i=e.tipValue,l=e.tipCounter;return r.a.createElement("div",{className:"media-container"},r.a.createElement("div",{className:"video-container",style:{cursor:"pointer"}},r.a.createElement("video",{className:"torrent-video torrent-video-".concat(c,"-").concat(t),"data-torrent":a.magnetURI,"data-file-key":n,controls:!0,"data-played":"false"}),r.a.createElement(f,{tipCounter:l,tipValue:i})))},j=a(531),O=(a(260),function(e){var t=e.id,a=e.item,i=e.index,l=e.postId,o=e.tipValue,s=e.tipCounter,u=Object(c.useState)(!1),m=Object(n.a)(u,2),d=m[0],p=m[1],b=Object(c.useState)(!1),v=Object(n.a)(b,2),O=v[0],E=v[1],h=Object(c.useState)(!0),g=Object(n.a)(h,2),y=g[0],N=g[1],k=Object(c.useState)(null),w=Object(n.a)(k,2),C=w[0],I=w[1],x=Object(c.useCallback)((function(e){if(clearTimeout(C),p(e),!e&&O){E(!1);var t=setTimeout((function(){N(!0)}),200);I(t)}e&&N(!1)}),[C,O]);return r.a.createElement("div",{className:"media-container"},r.a.createElement(j.a,{isZoomed:d,onZoomChange:x,overlayBgColorStart:"#16191c00",overlayBgColorEnd:"#16191c"},r.a.createElement("img",{className:"torrent-img torrent-img-".concat(l,"-").concat(t),alt:"Post Media","data-torrent":a.magnetURI,"data-file-key":i,style:{opacity:y?1:0}}),r.a.createElement("img",{className:"enlarged-img enlarged-img-".concat(l,"-").concat(t),alt:"Post Media","data-file-key":i,onLoad:function(){E(!0)},style:{opacity:O?1:0},src:decodeURIComponent(a.magnetURI.split("ws=")[1])}),r.a.createElement(f,{tipCounter:s,tipValue:o,zoomed:d})))}),E=a(3),h=a.n(E),g=a(7),y=a(273),N="".concat("https://webtorrent.shock.network","/rtmpapi/api/streams/live"),k=function(e){e.id;var t=e.item,a=(e.index,e.postId,e.tipValue),i=e.tipCounter,l=e.hideRibbon,o=e.width,s=Object(c.useRef)(null),u=Object(c.useState)(!1),m=Object(n.a)(u,2),d=m[0],p=m[1],b={width:"100%"};return o&&(b.width=o),Object(c.useEffect)((function(){if(t){var e=null,a=function(){var e=Object(g.a)(h.a.mark((function e(){var a,c,r,i,l;return h.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=t.magnetURI.split("/live/")[1].split("/index.m3u8"),c=Object(n.a)(a,1),r=c[0],e.next=4,fetch("".concat(N,"/").concat(r));case 4:return i=e.sent,e.next=7,i.json();case 7:if(e.sent.isLive){e.next=10;break}return e.abrupt("return",!1);case 10:return(l=Object(y.a)(s.current,{autoplay:!0,muted:!0,aspectRatio:"16:9"})).src({src:t.magnetURI,type:"application/x-mpegURL"}),l.play(),e.abrupt("return",!0);case 16:return e.prev=16,e.t0=e.catch(0),console.log(e.t0),e.abrupt("return",!1);case 20:case"end":return e.stop()}}),e,null,[[0,16]])})));return function(){return e.apply(this,arguments)}}();return a().then((function(t){t?p(!0):e=setInterval(Object(g.a)(h.a.mark((function t(){return h.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,a();case 2:if(!t.sent){t.next=7;break}return p(!0),clearInterval(e),t.abrupt("return");case 7:case"end":return t.stop()}}),t)}))),1e4)})),function(){clearInterval(e)}}}),[t]),r.a.createElement("div",{className:"media-container w-100"},r.a.createElement("div",{className:"video-container w-100",style:{cursor:"pointer",width:"100%"}},!d&&r.a.createElement("p",null,"The streamer has disconnected."),r.a.createElement("div",{style:d?{width:"100%"}:{display:"none",width:"100%"}},r.a.createElement("video",{className:"video-js vjs-default-skin",ref:s,style:b,preload:"auto",controls:!0,muted:!0,autoPlay:!0})),!l&&r.a.createElement(f,{tipCounter:i,tipValue:a,zoomed:!1})))},w=a(24);t.default=function(e){var t=e.id,a=e.timestamp,i=e.avatar,m=e.tipCounter,f=e.tipValue,j=e.publicKey,E=e.openTipModal,h=e.contentItems,g=void 0===h?{}:h,y=e.username,N=e.isOnlineNode,C=Object(s.b)(),I=Object(u.useEmblaCarousel)({slidesToScroll:1,align:"center"}),x=Object(n.a)(I,2),S=x[0],V=x[1],T=Object(c.useState)(0),P=Object(n.a)(T,2),R=P[0],L=P[1],U=Object(c.useState)(0),A=Object(n.a)(U,2),K=A[0],M=A[1],D=function(e,a){var c=Object(n.a)(e,2),i=c[0],l=c[1];return"text/paragraph"===l.type?r.a.createElement("p",{key:i},l.text):"image/embedded"===l.type?r.a.createElement(O,{id:i,item:l,index:a,postId:t,tipCounter:m,tipValue:f,key:"".concat(t,"-").concat(a)}):"video/embedded"===l.type?r.a.createElement(v,{id:i,item:l,index:a,postId:t,tipCounter:m,tipValue:f,key:"".concat(t,"-").concat(a)}):"stream/embedded"===l.type?r.a.createElement(k,{id:i,item:l,index:a,postId:t,tipCounter:m,tipValue:f,key:"".concat(t,"-").concat(a)}):null},z=Object(c.useCallback)((function(){V&&V.canScrollNext()&&V.scrollNext()}),[V]),B=Object(c.useCallback)((function(){V&&V.canScrollPrev()&&V.scrollPrev()}),[V]),J=Object(c.useCallback)((function(e){if(0!==R){var t=e.key;"ArrowRight"===t&&z(),"ArrowLeft"===t&&B()}}),[R,B,z]),Z=Object(c.useCallback)((function(){M(V.selectedScrollSnap())}),[V,M]);Object(c.useEffect)((function(){Object(b.f)({path:"posts/".concat(t,"/tipsSet"),gunPointer:Object(b.g)(j),method:"load"}).then((function(e){var a=e?Object.values(e):[],n=a.length,c=n>0?a.reduce((function(e,t){return Number(t)+Number(e)})):0;C(Object(p.k)({postID:t,data:{tipValue:c,tipCounter:n}}))}))}),[C,t,j]),Object(c.useEffect)((function(){if(V)return V.on("scroll",Z),L(V.scrollSnapList().length),window.addEventListener("keydown",J),function(){window.removeEventListener("keydown",J),V.off("scroll",Z)}}),[V,R,J,Z]);var q=Object(c.useCallback)((function(){N&&E({targetType:"tip",ackInfo:t})}),[t,N,E]);return Object(c.useEffect)((function(){o.a.rebuild()}),[]),r.a.createElement("div",{className:"post"},r.a.createElement("div",{className:"head"},r.a.createElement("div",{className:"user"},r.a.createElement(w.b,{className:"av",to:"/".concat(j),style:{backgroundImage:"url(".concat(i,")")}}),r.a.createElement("div",{className:"details"},r.a.createElement(w.b,{to:"/".concat(j)},y),r.a.createElement("p",null,l.a.utc(a).fromNow())))),r.a.createElement("div",{className:"content"},Object.entries(g).filter((function(e){var t=Object(n.a)(e,2);return t[0],"text/paragraph"===t[1].type})).map(D),r.a.createElement("div",{className:"media-content-carousel"},R>1?r.a.createElement("div",{className:"media-carousel-controls-container"},r.a.createElement("div",{className:"media-carousel-arrow fas fa-angle-left",onClick:B}),r.a.createElement("div",{className:"media-carousel-pages"},Array.from({length:R}).map((function(e,t){return r.a.createElement("div",{className:d()({"media-carousel-page":!0,"active-carousel-page":K===t}),onClick:function(){return null===V||void 0===V?void 0:V.scrollTo(t)}})}))),r.a.createElement("div",{className:"media-carousel-arrow fas fa-angle-right",onClick:z})):null,r.a.createElement("div",{className:"media-content-root",ref:S},r.a.createElement("div",{className:"media-content-container"},Object.entries(g).filter((function(e){var t=Object(n.a)(e,2);return t[0],"text/paragraph"!==t[1].type})).map(D))))),r.a.createElement("div",{className:"actions"},r.a.createElement("div",{className:"icon-tip-btn","data-tip":"Tip this post",onClick:q},r.a.createElement("div",{className:"tip-icon icon-thin-feed"}))))}},262:function(e,t){},264:function(e,t){},529:function(e,t,a){"use strict";a.r(t);var n=a(3),c=a.n(n),r=a(7),i=a(9),l=a(0),o=a.n(l),s=a(121),u=a.n(s),m=a(33),d=a(32),p=a(14),b=a(1),f=a(154),v=a(258),j=a.n(v),O=(a(88),a(272)),E=a(35);t.default=function(e){var t,a=e.sharedPostId,n=e.sharerPublicKey,s=e.sharerUsername,v=e.sharerAvatar,h=e.sharedTimestamp,g=e.isOnlineNode,y=e.postID,N=e.postPublicKey,k=e.openTipModal,w=Object(d.b)(),C=Object(l.useState)(!0),I=Object(i.a)(C,2),x=I[0],S=I[1],V=Object(l.useState)(null),T=Object(i.a)(V,2),P=T[0],R=T[1],L=Object(l.useState)(null),U=Object(i.a)(L,2),A=U[0],K=U[1];Object(l.useEffect)((function(){Object(b.h)({path:"posts/".concat(a,"/tipCounter"),gunPointer:Object(b.g)(n),callback:function(e){w(Object(p.k)({postID:a,data:{tipCounter:e}}))}}),Object(b.h)({path:"posts/".concat(a,"/tipValue"),gunPointer:Object(b.g)(n),callback:function(e){w(Object(p.k)({postID:a,data:{tipValue:e}}))}})}),[w,a,n]);var M=Object(l.useCallback)(Object(r.a)(c.a.mark((function e(){var t,a,n,r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(S(!0),N){e.next=3;break}return e.abrupt("return");case 3:return e.next=5,Promise.all([Object(p.b)({publicKey:N,includeAvatar:!0}),Object(p.e)({id:y,gunPointer:Object(b.g)(N)})]);case 5:t=e.sent,a=Object(i.a)(t,2),n=a[0],r=a[1],K(n),R(r),S(!1),Object(O.a)([r],!1);case 13:case"end":return e.stop()}}),e)}))),[y,N]);return Object(l.useEffect)((function(){m.a.rebuild(),M()}),[M]),o.a.createElement("div",{className:"post shared-post"},o.a.createElement("div",{className:"head"},o.a.createElement("div",{className:"user"},o.a.createElement("div",{className:"av",style:{backgroundImage:"url(".concat(v,")")}}),o.a.createElement("div",{className:"details"},o.a.createElement("p",null,s),o.a.createElement("p",null,u.a.utc(h).fromNow())))),o.a.createElement("div",{className:"shared-content"},x?o.a.createElement(E.a,{text:"Loading Post..."}):P&&A?o.a.createElement(f.default,{id:P.id,timestamp:P.date,avatar:A.avatar?"data:image/png;base64,".concat(A.avatar):j.a,tipCounter:P.tipCounter,tipValue:P.tipValue,publicKey:N,openTipModal:k,contentItems:P.contentItems,username:null!==(t=A.displayName)&&void 0!==t?t:A.alias,isOnlineNode:g}):null))}},88:function(e,t,a){}}]);
//# sourceMappingURL=6.66879c11.chunk.js.map