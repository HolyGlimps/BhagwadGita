import {atom} from "recoil"

export const chapterState = atom({
     key: 'chapterState', // unique ID (with respect to other atoms/selectors)
     default: '', // default value (aka initial value)
   });

export const verseState = atom({
     key:"verseState",
     default:''
})
