import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { SYSTEM_TIMEZONE } from "./timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault(SYSTEM_TIMEZONE);

export default dayjs;
