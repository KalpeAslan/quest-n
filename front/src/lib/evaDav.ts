import { LocalStorageService } from "@/services";
import axios from "axios";

export function setEvaDav() {
  const urlParams = new URLSearchParams(window.location.search);
  const clickid = urlParams.get("clickid");
  if (clickid) {
    LocalStorageService.setItem("evadav", clickid);
  }
}

export async function countConvs() {
  const clickid = await LocalStorageService.getItemAsync("evadav");
  if (clickid) {
    try {
      const res = await axios.get("https://evadav.com/phpb", {
        params: {
          click_id: clickid,
          payout: 200, // payout amount
        },
      });
    } catch (e) {
      console.log("Error on EvaDay", e);
    }
  }
}
