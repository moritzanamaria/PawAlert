import {vrste} from "./VrstePodaci";

  async function get() {
    return {data: [...vrste]}

  }
async function nova(vrsta) {
  if(vrste.length===0){
    vrsta.id = 1
  }else{
    vrsta.id= vrste[vrste.length -1].id + 1
  }
  vrste.push(vrsta)
  }
  


export default {
  get,
  nova
}