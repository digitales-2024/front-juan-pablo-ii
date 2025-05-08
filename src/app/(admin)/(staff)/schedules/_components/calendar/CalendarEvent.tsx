import { format, isSameDay, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, MotionConfig, AnimatePresence } from "framer-motion";
import { CalendarEvent as CalendarEventType } from "../../_types/CalendarTypes";
import { useCalendarContext } from "./CalendarContext";

interface EventPosition {
	left: string;
	width: string;
	top: string;
	height: string;
}

function getOverlappingEvents(
	currentEvent: CalendarEventType,
	events: CalendarEventType[]
): CalendarEventType[] {
	return events.filter((event) => {
		if (event.id === currentEvent.id) return false;
		return (
			currentEvent.start < event.end &&
			currentEvent.end > event.start &&
			isSameDay(currentEvent.start, event.start)
		);
	});
}

function calculateEventPosition(
	event: CalendarEventType,
	allEvents: CalendarEventType[]
): EventPosition {
	const safeEvent = {
		...event,
		start: new Date(event.start),
		end: new Date(event.end)
	};

	const overlappingEvents = getOverlappingEvents(safeEvent, allEvents);
	const group = [safeEvent, ...overlappingEvents].sort(
		(a, b) => a.start.getTime() - b.start.getTime()
	);
	const position = group.indexOf(safeEvent);
	const width = `${100 / (overlappingEvents.length + 1)}%`;
	const left = `${(position * 100) / (overlappingEvents.length + 1)}%`;

	const startHour = safeEvent.start.getHours();
	const startMinutes = safeEvent.start.getMinutes();

	let endHour = safeEvent.end.getHours();
	let endMinutes = safeEvent.end.getMinutes();

	if (!isSameDay(safeEvent.start, safeEvent.end)) {
		endHour = 23;
		endMinutes = 59;
	}

	const topPosition = startHour * 128 + (startMinutes / 60) * 128;
	const duration =
		endHour * 60 + endMinutes - (startHour * 60 + startMinutes);
	const height = (duration / 60) * 128;

	return {
		left,
		width,
		top: `${topPosition}px`,
		height: `${height}px`,
	};
}

export default function CalendarEvent({
	event,
	month = false,
	className,
}: {
	event: CalendarEventType;
	month?: boolean;
	className?: string;
}) {
	console.log('📅 [Event] Renderizado:', event.id, event.start);
	const { events, setSelectedEvent, setManageEventDialogOpen, date } =
		useCalendarContext();
	const style = month ? {} : calculateEventPosition(event, events);

	// Generate a unique key that includes the current month to prevent animation conflicts
	const isEventInCurrentMonth = isSameMonth(event.start, date);
	const animationKey = `${event.id}-${isEventInCurrentMonth ? "current" : "adjacent"
		}`;

	return (
		<MotionConfig reducedMotion="user">
			<AnimatePresence mode="wait">
				<motion.div
					className={cn(
						`px-3 py-1.5 rounded-md truncate cursor-pointer transition-all duration-300 bg-${event.color}-500/10 hover:bg-${event.color}-500/20 border border-${event.color}-500`,
						!month && "absolute",
						className
					)}
					style={style}
					onClick={(e: React.MouseEvent) => {
						e.stopPropagation();
						setSelectedEvent(event);
						setManageEventDialogOpen(true);
					}}
					initial={{
						opacity: 0,
						y: -3,
						scale: 0.98,
					}}
					animate={{
						opacity: 1,
						y: 0,
						scale: 1,
					}}
					exit={{
						opacity: 0,
						scale: 0.98,
						transition: {
							duration: 0.15,
							ease: "easeOut",
						},
					}}
					transition={{
						duration: 0.2,
						ease: [0.25, 0.1, 0.25, 1],
						opacity: {
							duration: 0.2,
							ease: "linear",
						},
						layout: {
							duration: 0.2,
							ease: "easeOut",
						},
					}}
					layoutId={`event-${animationKey}-${month ? "month" : "day"
						}`}
				>
					<motion.div
						className={cn(
							`flex flex-col w-full text-${event.color}-500`,
							month && "flex-row items-center justify-between"
						)}
						layout="position"
					>
						<p
							className={cn(
								"font-bold truncate",
								month && "text-xs"
							)}
						>
							{event.title}
						</p>
						<p className={cn("text-sm", month && "text-xs")}>
							<span>{format(event.start, "h:mm a")}</span>
							<span className={cn("mx-1", month && "hidden")}>
								-
							</span>
							<span className={cn(month && "hidden")}>
								{format(event.end, "h:mm a")}
							</span>
						</p>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		</MotionConfig>
	);
}
