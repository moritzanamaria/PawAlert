import {tip} from "./TipPodaci";

  async function get() {
    return {data: [...tipovi]}

  }
async function novi(tip) {
  if(tipovi.length===0){
    tip.id = 1
  }else{
    tip.id= tipovi[tipovi.length -1].id + 1
  }
  tipovi.push(tip)
  }
  


export default {
  get,
  novi
}