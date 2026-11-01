import React from "react";
import {createRoot} from "react-dom/client";
import App from "./App.jsx";
import css from "./index.css?inline";
import {getUiTheme} from "./utils/settings";


console.log("🔥 LeetBoost React Started");


const host=document.createElement("div");

host.id="leetboost-root";

document.body.appendChild(host);


const shadow=host.attachShadow({
    mode:"open"
});


// Tailwind v4 registers its internal --tw-* variables with
// @property, which Chrome ignores inside a shadow root. Without
// their initial values, gradients, shadows and rings never render.
// Re-declare those initial values for every element in the shadow
// tree (the same fallback Tailwind ships for older browsers).
function withPropertyFallbacks(cssText){

const declarations=[...cssText.matchAll(/@property\s+(--[\w-]+)\s*\{([^}]*)\}/g)]
.map(([,name,body])=>{

const initial=body.match(/initial-value\s*:\s*([^;]+)/);

return `${name}:${initial ? initial[1].trim() : "initial"};`;

})
.join("");

if(!declarations){

return cssText;

}

return `${cssText}\n@layer properties{*,::before,::after,::backdrop{${declarations}}}`;

}


const style=document.createElement("style");

style.textContent=withPropertyFallbacks(css);

shadow.appendChild(style);



const root=document.createElement("div");

shadow.appendChild(root);


// Read the saved interface theme before the first render
// so the UI never flashes the wrong theme.
getUiTheme((uiTheme)=>{

createRoot(root).render(

<React.StrictMode>

<App initialUiTheme={uiTheme}/>

</React.StrictMode>

);

});