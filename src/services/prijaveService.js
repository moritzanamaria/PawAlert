import {prijavePodaci} from "./prijavePodaci";

  async function get() {
    return {data: [...prijavePodaci]}
  }
async function nova(prijava) {
  if(prijavePodaci.length===0){
    prijava.id = 1
  }else{
    prijava.id= prijavePodaci[prijavePodaci.length -1].id + 1
  }
  prijavePodaci.push(prijava)
  }
  


export default {
  get,
  nova
}