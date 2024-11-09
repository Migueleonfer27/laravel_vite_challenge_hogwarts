import '../scss/styles.scss'

import { addEnlaceEvent } from "./page-email.js";
import { addPasswordEvent } from "./email-provider.js";

export default function email(){
    addEnlaceEvent()
    addPasswordEvent()
}
