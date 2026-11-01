export function getSettings(callback){


if(
typeof chrome==="undefined" ||
!chrome.storage
){

callback({

celebration:true,

sound:true,

theme:"gta"

});


return;

}




chrome.storage.local.get(

{

celebration:true,

sound:true,

theme:"gta"

},

callback

);


}









export function saveSetting(key,value){



if(
typeof chrome==="undefined" ||
!chrome.storage
){

return;

}




chrome.storage.local.set({

[key]:value

});



}








// ==========================================
// INTERFACE THEME (DARK / LIGHT)
// ==========================================
// Kept separate from the "theme" setting, which
// selects the GTA / Minecraft celebration style.

export const UI_THEME_KEY="uiTheme";

export const DEFAULT_UI_THEME="dark";

const UI_THEMES=["dark","light"];


export function normalizeUiTheme(value){

return UI_THEMES.includes(value)
?
value
:
DEFAULT_UI_THEME;

}


function getStorage(){

return globalThis.chrome?.storage?.local;

}


export function getUiTheme(callback){

const storage=getStorage();

if(!storage){

callback(DEFAULT_UI_THEME);

return;

}


try{

storage.get(

{[UI_THEME_KEY]:DEFAULT_UI_THEME},

(data)=>{

callback(
normalizeUiTheme(data?.[UI_THEME_KEY])
);

}

);

}catch{

// Extension context invalidated (e.g. after a reload).
callback(DEFAULT_UI_THEME);

}

}


export function saveUiTheme(value){

saveSetting(
UI_THEME_KEY,
normalizeUiTheme(value)
);

}


// Keeps every open LeetCode tab in sync when the
// theme changes elsewhere. Returns an unsubscribe fn.
export function onUiThemeChange(callback){

const onChanged=globalThis.chrome?.storage?.onChanged;

if(!onChanged){

return ()=>{};

}


function listener(changes,area){

if(area==="local" && changes[UI_THEME_KEY]){

callback(
normalizeUiTheme(changes[UI_THEME_KEY].newValue)
);

}

}


onChanged.addListener(listener);

return ()=>onChanged.removeListener(listener);

}
