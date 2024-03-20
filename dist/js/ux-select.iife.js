var f=Object.defineProperty;var x=(d,c,r)=>c in d?f(d,c,{enumerable:!0,configurable:!0,writable:!0,value:r}):d[c]=r;var a=(d,c,r)=>(x(d,typeof c!="symbol"?c+"":c,r),r);this["ux-select"]=function(){"use strict";const d="";function c(h){const t=new Event("change");h.dispatchEvent(t)}function r(h){const t=new Event("input");h.dispatchEvent(t)}class p{constructor(t,s={}){a(this,"el");a(this,"config");a(this,"localization");a(this,"state");a(this,"options");a(this,"groups");a(this,"uxEl");a(this,"uxBody");a(this,"uxSearchInput");a(this,"uxClearButton");this.el=t,this.config={isSearchable:s.isSearchable??!1,isSearchFocus:s.isSearchFocus??!1,isGroupOptions:s.isGroupOptions??!1,hideOnClear:s.hideOnClear??!0,hideOnSelect:s.hideOnSelect??!1,optionStyle:s.optionStyle??"default",closeButton:s.closeButton??!0},this.localization={placeholder:this.el.dataset.placeholder??s.placeholder??"Select an option",searchText:this.el.dataset.searchText??s.searchText??"Search",clearText:this.el.dataset.clearText??s.clearText??"Clear option(s)",selectedText:this.el.dataset.selectedText??s.selectedText??"Selected:"},this.state={multiple:this.el.multiple,disabled:this.el.disabled},this.options=this.extractOptions(),this.groups=this.extractGroups(),this.uxEl=this.create(),this.setSelectState(),this.bindEvents()}extractOptions(t=!1){const s=this.el.options,o=this.config.isGroupOptions,e=[];for(const i of s){if(i.value==="")continue;let l="empty";o&&i.dataset.uxSelectGroup&&(l=i.dataset.uxSelectGroup);let n;t&&(n=this.uxEl.querySelector(`.ux-select-group__elem[data-value='${i.value}']`));let u;this.config.optionStyle==="image"&&i.dataset.imageSrc&&(u={src:i.dataset.imageSrc,srcset:i.dataset.imageSrcset??void 0,alt:i.dataset.imageAlt??"",width:i.dataset.imageWidth?Number(i.dataset.imageWidth):24,height:i.dataset.imageHeight?Number(i.dataset.imageHeight):24}),e.push({attributes:{selected:i.selected,disabled:i.disabled,group:l},data:{text:i.textContent?i.textContent.trim():"",value:i.value},image:u,element:i,uxOption:n})}return e}extractGroups(){const t=this.el.options,s=this.config.isGroupOptions,o=new Set;for(const e of t){if(e.value==="")continue;let i="empty";s&&e.dataset.uxSelectGroup&&(i=e.dataset.uxSelectGroup),o.add(i)}return Array.from(o)}setSelectState(){const t=this.uxEl.querySelector(".ux-select__title"),s=this.options.reduce((o,e)=>(e.attributes.selected&&o.push(e.data.text),o),[]);if(s.length>0?(s.length===1?t.textContent=s[0]:this.state.multiple&&(t.textContent=`${this.localization.selectedText} ${s.length}`),this.uxEl.classList.add("-filled")):(t.textContent=this.localization.placeholder,this.uxEl.classList.remove("-filled")),this.config.isGroupOptions)for(const o of this.groups){const e=this.uxEl.querySelector(`[data-ux-group="${o}"]`);if(!e)continue;const i=e.querySelector(".ux-select-group__list");if(!i)continue;const n=Array.from(i.querySelectorAll(".ux-select-group__elem")).every(u=>{u.classList.contains("-disabled")});e.classList.toggle("-disabled",n)}}createGroupElement(t){const s=document.createElement("div");if(s.classList.add("ux-select__group","ux-select-group"),s.dataset.uxGroup=t,t==="empty")s.classList.add("-empty");else{const e=document.createElement("div");e.classList.add("ux-select-group__title"),e.textContent=t,s.appendChild(e)}const o=document.createElement("ul");return o.classList.add("ux-select-group__list"),s.appendChild(o),s}createGroupAndOptions(){const t=document.createElement("div");t.classList.add("ux-select__dropdown");const s=document.createDocumentFragment(),o={};for(const e of this.groups){const i=this.createGroupElement(e);s.appendChild(i),o[e]=document.createDocumentFragment()}t.appendChild(s);for(const e of this.options){const i=document.createElement("li");if(i.classList.add("ux-select-group__elem"),i.dataset.value=e.data.value,i.textContent=e.data.text,e.attributes.selected&&i.classList.add("-selected"),e.attributes.disabled&&i.classList.add("-disabled"),this.config.optionStyle==="image"&&e.image){const l=document.createElement("img");l.classList.add("ux-select-group-elem__image"),l.src=e.image.src,l.width=e.image.width,l.height=e.image.height,l.alt=e.image.alt,e.image.srcset&&(l.srcset=`${e.image.src} 1x, ${e.image.srcset} 2x`),i.appendChild(l)}i.addEventListener("click",this.onClickOption.bind(this)),o[e.attributes.group].appendChild(i),e.uxOption=i}for(const e of this.groups){const i=o[e],l=t.querySelector(`[data-ux-group="${e}"] .ux-select-group__list`);l&&l.appendChild(i)}if(!this.uxBody)throw new Error("uxBody is undefined");this.uxBody.childNodes[1]?this.uxBody.replaceChild(t,this.uxBody.childNodes[1]):this.uxBody.appendChild(t)}create(){const t=document.createElement("div");t.classList.add("ux-select__head");const s=document.createElement("div");if(s.classList.add("ux-select__title"),s.textContent=this.localization.placeholder,t.appendChild(s),this.config.closeButton){const l=document.createElement("button");l.type="button",l.classList.add("ux-select__clear"),l.title=this.localization.clearText,this.uxClearButton=l,t.appendChild(l)}const o=document.createElement("div");if(o.classList.add("ux-select__body"),this.uxBody=o,this.config.isSearchable){const l=document.createElement("div");l.classList.add("ux-select__search");const n=document.createElement("input");n.type="search",n.classList.add("ux-select-search__input"),n.placeholder=this.localization.searchText,this.uxSearchInput=n,l.appendChild(n),o.appendChild(l)}this.createGroupAndOptions();const e=document.createElement("div"),i=["ux-select",this.el.classList];return this.state.multiple&&i.push("-multiple"),this.state.disabled&&i.push("-disabled"),this.config.optionStyle!=="default"&&i.push(`-${this.config.optionStyle}`),e.className=i.join(" "),e.append(t,o),this.el.style.display="none",this.el.insertAdjacentElement("afterend",e),this.el.nextElementSibling}enable(){this.state.disabled&&(this.el.disabled=!1,this.uxEl.classList.remove("-disabled"),this.state.disabled=!1)}disable(){this.state.disabled||(this.el.disabled=!0,this.uxEl.classList.add("-disabled"),this.state.disabled=!0)}update(t=!0){const s=JSON.stringify(this.options);this.options=this.extractOptions(!0),this.groups=this.extractGroups(),s!==JSON.stringify(this.options)&&this.createGroupAndOptions(),this.setSelectState(),this.el.disabled?this.disable():this.enable(),t&&c(this.el)}clear(){for(const t of this.options)t.attributes.selected&&(t.attributes.selected=!1,t.element.selected=!1,t.uxOption&&t.uxOption.classList.remove("-selected"));this.setSelectState(),c(this.el)}destroy(){this.uxEl.remove(),this.el.style.display=""}onToggleShown(t){t.preventDefault();const s=t.target;if(!this.state.disabled&&!(this.uxClearButton&&t.target===this.uxClearButton)&&!(this.uxBody&&this.uxBody.contains(s))){if(this.uxEl.classList.contains("-shown")){this.uxEl.classList.remove("-shown");return}this.uxEl.classList.add("-shown"),this.config.isSearchable&&this.uxSearchInput&&(this.uxSearchInput.value="",this.uxSearchInput.dispatchEvent(new Event("input")),this.config.isSearchFocus&&this.uxSearchInput.focus())}}onClickOutside(t){const s=t.target;this.uxEl.contains(s)||this.uxEl.classList.remove("-shown")}onClickClear(t){if(t.preventDefault(),!this.state.disabled)return this.config.hideOnClear&&this.uxEl.classList.remove("-shown"),this.clear()}onClickOption(t){t.preventDefault();const s=t.target;if(!s.classList.contains("-disabled")&&!(!this.state.multiple&&s.classList.contains("-selected"))){if(this.state.multiple){t.stopPropagation();const o=this.options.find(e=>e.uxOption===s);o&&o.uxOption&&(o.attributes.selected=!o.attributes.selected,o.element.selected=o.attributes.selected,o.uxOption.classList.toggle("-selected"))}else for(const o of this.options){const e=o.uxOption===s;o.attributes.selected=e,o.element.selected=e,o.uxOption&&o.uxOption.classList.toggle("-selected",e)}return this.config.hideOnSelect&&this.uxEl.classList.remove("-shown"),this.update()}}onSearch(t){if(t.target===null)return;const o=t.target.value.toLowerCase(),e=o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),i=this.uxEl.querySelectorAll(".ux-select-group");if(o===""){for(const n of this.options)n.uxOption&&(n.uxOption.style.display="");if(this.config.isGroupOptions)for(const n of i)n.style.display="";return}const l=new RegExp(e);for(const n of this.options){const u=l.test(n.data.text.toLowerCase());n.uxOption&&(n.uxOption.style.display=u?"":"none")}if(this.config.isGroupOptions)for(const n of i){n.style.display="";const u=n.querySelector(".ux-select-group__list");u&&(n.style.display=u.clientHeight!==0?"":"none")}r(this.el)}bindEvents(){this.uxEl.addEventListener("click",this.onToggleShown.bind(this)),this.uxClearButton&&this.uxClearButton.addEventListener("click",this.onClickClear.bind(this)),window.addEventListener("click",this.onClickOutside.bind(this)),this.config.isSearchable&&this.uxSearchInput&&this.uxSearchInput.addEventListener("input",this.onSearch.bind(this))}}return p}();
//# sourceMappingURL=ux-select.iife.js.map
