import {prijavePodaci} from "./prijavePodaci";

  async function get() {
    return {data: [...prijavePodaci]}
  }

export default {
  get
}