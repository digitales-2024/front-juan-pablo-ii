import { useCalendarContext } from "../../CalendarContext";
import CalendarBodyDayCalendar from "./CalendarBodyDayCalendar";
import CalendarBodyDayContent from "./CalendarBodyDayContent";
import CalendarBodyDayEvents from "./CalendarBodyDayEvents";
import CalendarBodyMarginDayMargin from "./CalendarBodyMarginDayMargin";

export default function CalendarBodyDay() {
	const { date } = useCalendarContext();
	return (
		<div className="flex divide-x flex-grow overflow-hidden">
			<div className="flex flex-col flex-grow divide-y overflow-hidden">
				<div className="flex flex-col flex-1 overflow-y-auto">
					<div className="relative flex flex-1 divide-x">
						<CalendarBodyMarginDayMargin />
						<CalendarBodyDayContent date={date} />
					</div>
				</div>
			</div>
			<div className="lg:flex hidden flex-col flex-grow divide-y max-w-[276px]">
				<CalendarBodyDayCalendar />
				<CalendarBodyDayEvents />
			</div>
		</div>
	);
}
