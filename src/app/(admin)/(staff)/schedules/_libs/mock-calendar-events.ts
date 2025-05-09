import { CalendarEvent } from "../_types/CalendarTypes";



export function generateMockEvents(): CalendarEvent[] {
	return [
		{
			id: "a2b3ed2c-f56c-479c-a3fe-da19af0f3b3c",
			title: "HORARIO B",
			type: "TURNO",
			start: new Date("2025-02-07T09:00:00"),
			end: new Date("2025-02-07T18:00:00"),
			color: "sky",
			status: "CONFIRMED",
			isActive: true,
			isCancelled: false,
			isBaseEvent: false,
			recurrence: {
				frequency: "DAILY",
				interval: 1,
				until: "2025-03-10"
			},
			exceptionDates: [],
			cancellationReason: null,
			staffScheduleId: "41fe1608-97d5-4b0a-ba84-6ac8f42d69db",
			staffId: "e474ce76-090e-4e21-9355-6fa867da716a",
			branchId: "d7b0f2a1-809f-419d-9f66-98b7ed8812fb",
			createdAt: new Date("2025-02-06T10:48:47"),
			updatedAt: new Date("2025-02-06T10:48:47"),
			staff: {
				name: "Juan",
				lastName: "Pérez"
			},
			branch: {
				name: "Sucursal Central"
			}
		},
		{
			id: "1c75e9d7-e84c-445c-bd54-1886c515522c",
			title: "HORARIO B",
			type: "TURNO",
			start: new Date("2025-02-10T09:00:00"),
			end: new Date("2025-02-10T18:00:00"),
			color: "sky",
			status: "CONFIRMED",
			isActive: true,
			isCancelled: false,
			isBaseEvent: false,
			recurrence: {
				frequency: "DAILY",
				interval: 1,
				until: "2025-03-10"
			},
			exceptionDates: [],
			cancellationReason: null,
			staffScheduleId: "41fe1608-97d5-4b0a-ba84-6ac8f42d69db",
			staffId: "e474ce76-090e-4e21-9355-6fa867da716a",
			branchId: "d7b0f2a1-809f-419d-9f66-98b7ed8812fb",
			createdAt: new Date("2025-02-06T10:48:47"),
			updatedAt: new Date("2025-02-06T10:48:47"),
			staff: {
				name: "Juan",
				lastName: "Pérez"
			},
			branch: {
				name: "Sucursal Central"
			}
		},
		{
			id: "5d799f10-3118-4bf4-9052-9f088cdd6b97",
			title: "HORARIO B",
			type: "TURNO",
			start: new Date("2025-02-12T09:00:00"),
			end: new Date("2025-02-12T18:00:00"),
			color: "sky",
			status: "CONFIRMED",
			isActive: true,
			isCancelled: false,
			isBaseEvent: false,
			recurrence: {
				frequency: "DAILY",
				interval: 1,
				until: "2025-03-10"
			},
			exceptionDates: [],
			cancellationReason: null,
			staffScheduleId: "41fe1608-97d5-4b0a-ba84-6ac8f42d69db",
			staffId: "e474ce76-090e-4e21-9355-6fa867da716a",
			branchId: "d7b0f2a1-809f-419d-9f66-98b7ed8812fb",
			createdAt: new Date("2025-02-06T10:48:47"),
			updatedAt: new Date("2025-02-06T10:48:47"),
			staff: {
				name: "Juan",
				lastName: "Pérez"
			},
			branch: {
				name: "Sucursal Central"
			}
		},
		{
			id: "4af39ec7-06fa-4449-9f08-bb69d4a52899",
			title: "HORARIO B",
			type: "TURNO",
			start: new Date("2025-02-19T09:00:00"),
			end: new Date("2025-02-19T18:00:00"),
			color: "sky",
			status: "CONFIRMED",
			isActive: true,
			isCancelled: false,
			isBaseEvent: false,
			recurrence: {
				frequency: "DAILY",
				interval: 1,
				until: "2025-03-10"
			},
			exceptionDates: [],
			cancellationReason: null,
			staffScheduleId: "41fe1608-97d5-4b0a-ba84-6ac8f42d69db",
			staffId: "e474ce76-090e-4e21-9355-6fa867da716a",
			branchId: "d7b0f2a1-809f-419d-9f66-98b7ed8812fb",
			createdAt: new Date("2025-02-06T16:28:26"),
			updatedAt: new Date("2025-02-06T16:28:26"),
			staff: {
				name: "josueeryyaaaa",
				lastName: "medina"
			},
			branch: {
				name: "sede 1"
			}
		}
	];
}
