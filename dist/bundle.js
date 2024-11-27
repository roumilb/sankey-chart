var SankeyChart=function(){"use strict";!function(t,e){void 0===e&&(e={});var n=e.insertAt;if(t&&"undefined"!=typeof document){var i=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css","top"===n&&i.firstChild?i.insertBefore(a,i.firstChild):i.appendChild(a),a.styleSheet?a.styleSheet.cssText=t:a.appendChild(document.createTextNode(t))}}(".sankey_chart_container{\n\tdisplay: flex;\n\tflex-direction: row;\n\tgap: 1rem;\n}\n\n.sankey_chart_container #sankey_chart_svg_container{\n\tposition: absolute;\n\tz-index: 1;\n}\n\n.sankey_chart_container #sankey_chart_svg_container .sankey_chart_link{\n\ttransition: .2s;\n}\n\n.sankey_chart_container .sankey_chart_node_container{\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: .5rem;\n\twidth: 20px;\n}\n\n.sankey_chart_container .sankey_chart_node_container .sankey_chart_node{\n\twidth: 100%;\n\tz-index: 2;\n\tcursor: pointer;\n\tposition: relative;\n}\n\n.sankey_chart_container .sankey_chart_node_container .sankey_chart_node .sankey_chart_node_label{\n\tposition: absolute;\n\tleft: 100%;\n\tpadding-left: 5px;\n\ttop: 5px;\n}\n\n.sankey_chart_container .sankey_chart_grow{\n\tflex-grow: 1;\n}\n");const t={chartElement:null,chartDimensions:{width:0,height:0},dataAsTree:null,maxHeightNodeValue:0,htmlElement:[],linksPath:[],nodeValues:{},parentChildren:{},rawData:null,nodeClickCallback:null,linkClickCallback:null,nodeElements:null,linkElements:null,isInteractive:!1,nodeDisplayStates:{},iterationHidden:null,defaultValues:{link:{fillColor:"rgba(229, 246, 254, 0.5)",hoverFillColor:"rgba(0, 164, 255, 0.5)"},node:{backgroundColor:"#00a4ff"}},labels:{},display:function(t){if(this.setData(t),this.configureChartElement(),this.fillNodeValues(),this.sortDataAsTree(),!this.dataAsTree)throw new Error("Invalid data, data as tree is required");this.fillNodeHtmlElement(this.dataAsTree,0,!0),this.fillLinksPath(),this.addHtml(),this.drawPath(),this.setNodeElements(),this.setLinkElements(),this.setNodeClick(),this.setLinkClick(),this.setNodeHover()},setData:function(t){var e,n;if(!t.id)throw new Error("Invalid data, id is required");if(this.chartElement=document.getElementById(t.id),!this.chartElement)throw new Error(`Element with id ${t.id} not found`);if(!t.data||0===t.data.length)throw new Error("Invalid data, data is required and should have at least one element");if(this.rawData=t.data,this.chartDimensions={width:this.chartElement.clientWidth,height:this.chartElement.clientHeight},!this.chartDimensions.width||!this.chartDimensions.height)throw new Error("Invalid dimensions, please set the width and height of the element");this.maxHeightNodeValue=Math.max(...t.data.map((t=>t.value))),t.nodeClickCallback&&"function"==typeof t.nodeClickCallback&&(this.nodeClickCallback=t.nodeClickCallback),t.linkClickCallback&&"function"==typeof t.linkClickCallback&&(this.linkClickCallback=t.linkClickCallback),t.labels&&(this.labels=t.labels),t.link&&(t.link.backgroundColor&&(this.defaultValues.link.fillColor=t.link.backgroundColor),t.link.hoverBackgroundColor&&(this.defaultValues.link.hoverFillColor=t.link.hoverBackgroundColor)),t.node&&t.node.backgroundColor&&(this.defaultValues.node.backgroundColor=t.node.backgroundColor),this.isInteractive=null!==(e=t.interactive)&&void 0!==e&&e,this.iterationHidden=null!==(n=t.iterationHidden)&&void 0!==n?n:null},configureChartElement:function(){this.chartElement&&this.chartElement.classList.add("sankey_chart_container")},sortDataAsTree:function(){if(!this.rawData)throw new Error("Invalid data, data is required");const t={};this.rawData.forEach((e=>{t[e.source]||(t[e.source]={id:e.source,children:[]}),t[e.target]||(t[e.target]={id:e.target,children:[]})})),this.rawData.forEach((e=>{t[e.source].children.push(t[e.target])}));const e=new Set(this.rawData.map((t=>t.target))),n=this.rawData.find((t=>!e.has(t.source)));if(!n)throw new Error("Invalid data, no root node found");const i=n.source;this.dataAsTree=[t[i]]},fillNodeValues:function(){if(!this.rawData)throw new Error("Invalid data, data is required");this.rawData.forEach((t=>{this.parentChildren[t.source]||(this.parentChildren[t.source]=[]),this.nodeValues[t.target]||(this.nodeValues[t.target]=0),this.parentChildren[t.source].push(t.target),this.nodeValues[t.target]+=t.value}))},getHeightForNode:function(t){return t/this.maxHeightNodeValue*this.chartDimensions.height},fillNodeHtmlElement:function(t,e,n=!1){this.htmlElement[e]||(this.htmlElement[e]=[]),t.forEach((t=>{let i=0;if(i=n?this.getHeightForNode(this.maxHeightNodeValue):this.nodeValues[t.id]?this.getHeightForNode(this.nodeValues[t.id]):0,!i)return;const a=this.labels[t.id]?this.labels[t.id]:t.id,l=this.iterationHidden&&e>=this.iterationHidden,r=this.iterationHidden&&e===this.iterationHidden-1;this.nodeDisplayStates[t.id]=!l&&!r;const o=l?"none":"flex",s=`height: ${i}px; background: ${this.defaultValues.node.backgroundColor}; display: ${o}`;return this.htmlElement[e].push(`<div id="node_${t.id}" class="sankey_chart_node" style="${s}">\n                                            <div class="sankey_chart_node_label">${a}</div>\n                                          </div>`),t.children.length?this.fillNodeHtmlElement(t.children,e+1):void 0}))},fillLinksPath:function(){for(const[t,e]of Object.entries(this.parentChildren))this.linksPath.push(...e.map((e=>`<path fill="${this.defaultValues.link.fillColor}" class="sankey_chart_link" id="${t}-${e}"></path>`)))},addHtml:function(){if(!this.chartElement)throw new Error("Invalid chart element");this.chartElement.innerHTML=this.htmlElement.map(((t,e)=>0===e?`<div class="sankey_chart_node_container">${t.join("")}</div>`:`<div class="sankey_chart_grow"></div><div class="sankey_chart_node_container">${t.join("")}</div>`)).join(""),this.chartElement.innerHTML+=`<svg id="sankey_chart_svg_container" width="${this.chartDimensions.width}" height="${this.chartDimensions.height}" viewBox="0 0 ${this.chartDimensions.width} ${this.chartDimensions.height}"></svg>`;const t=document.getElementById("sankey_chart_svg_container");if(!t)throw new Error("Invalid svg container");t.innerHTML=this.linksPath.join("")},drawPath:function(){for(const[t,e]of Object.entries(this.parentChildren)){let n=0;e.forEach((e=>{const i=this.getLink(t,e),a=i.value/(this.nodeValues[t]?this.nodeValues[t]:i.value),l=document.getElementById(`${t}-${e}`),r=document.getElementById(`node_${t}`),o=document.getElementById(`node_${e}`);if(!o)return void console.log(`Target node ${e} not found`);if(!r||!l)throw new Error("Invalid sourceNode or targetNode element");if(o&&"none"===o.style.display)return void l.setAttribute("d","");const s=r.getBoundingClientRect(),d=o.getBoundingClientRect(),h=s.height*a+n;if(!this.chartElement)throw new Error("Invalid chart element");const c=this.chartElement.getBoundingClientRect(),u=[{x:s.x-c.x+s.width,y:s.y-c.y+n},{x:d.x-c.x,y:d.y-c.y},{x:d.x-c.x,y:d.y-c.y+d.height},{x:s.x-c.x+s.width,y:s.y-c.y+h}];n=u[3].y-(s.y-c.y);const f=u[0].x+(u[1].x-u[0].x)/2,k=`M ${u[0].x} ${u[0].y}\n                                 C ${f} ${u[0].y}, ${f} ${u[1].y}, ${u[1].x} ${u[1].y}\n                                 L ${u[2].x} ${u[2].y}\n                                 C ${f} ${u[2].y}, ${f} ${u[3].y}, ${u[3].x} ${u[3].y}`;l.setAttribute("d",k)}))}},getLink:function(t,e){if(!this.rawData)throw new Error("Invalid data, data is required");return this.rawData.find((n=>n.source===t&&n.target===e))},setNodeElements:function(){this.nodeElements=document.querySelectorAll(".sankey_chart_node")},setLinkElements:function(){this.linkElements=document.querySelectorAll(".sankey_chart_link")},setNodeClick:function(){if(!this.nodeElements)throw new Error("Invalid node elements");this.nodeElements.forEach((t=>{t.addEventListener("click",(()=>{const e=t.id.replace("node_","");if(this.nodeClickCallback&&this.nodeClickCallback(e),!this.isInteractive)return;const n=void 0===this.nodeDisplayStates[e]||this.nodeDisplayStates[e];this.nodeDisplayStates[e]=!n;const i=this.getAllNodeChildrenFromNode(e);if(!i)return;const a=n?"none":"block";i.forEach((t=>{this.nodeDisplayStates[t]=!n;const e=document.getElementById(`node_${t}`);e&&(e.style.display=a)})),this.drawPath()}))}))},setLinkClick:function(){if(this.linkClickCallback){if(!this.linkElements)throw new Error("Invalid link elements");this.linkElements.forEach((t=>{t.addEventListener("click",(()=>{const[e,n]=t.id.split("-");this.linkClickCallback(this.getLink(e,n))}))}))}},setNodeHover:function(){if(!this.nodeElements||!this.linkElements)throw new Error("Invalid node or link elements");this.nodeElements.forEach((e=>{e.addEventListener("mouseover",(function(){const e=t.getHistoryForNode(this.id.replace("node_",""));for(let n=0;n<e.length-1;n++){const i=document.getElementById(`${e[n]}-${e[n+1]}`);i&&(i.style.fill=t.defaultValues.link.hoverFillColor)}this.addEventListener("mouseout",(()=>{t.linkElements.forEach((e=>{e.style.fill=t.defaultValues.link.fillColor}))}))}))}))},getHistoryForNode:function(t){if(!this.dataAsTree)throw new Error("Invalid data, data is required");const e=(n,i)=>{if(i.push(n.id),n.id===t)return i;if(n.children.length)for(let t of n.children){const n=e(t,[...i]);if(n)return n}return null};for(let t of this.dataAsTree){const n=e(t,[]);if(n)return n}return null},getAllNodeChildrenFromNode:function(t){if(!this.dataAsTree)throw new Error("Invalid data, data is required");const e=(n,i,a)=>{if(a&&i.push(n.id),n.id===t&&(a=!0),n.children.length)for(let t of n.children)e(t,i,a);return i};for(let t of this.dataAsTree){const n=e(t,[],!1);if(n.length)return n}return null}};return t}();
