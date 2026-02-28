
export const ROUTES = {
    root: "/",

    dashboard: {
        root: "/dashboard"
    },

    bookings: {
        root: "/bookings",
        create: "/bookings/booking-create",
        update: (id: string) => `/bookings/booking-update/${id}`,
        details: (id: string) => `/bookings/booking-details/${id}`
    },

    rooms: {
        root: "/rooms",
        create: "/rooms/room-create",
        update: (id: string) => `/rooms/room-update/${id}`
    },

    clients: {
        root: "/clients",
        create: "/clients/client-create",
        update: (id: string) => `/clients/client-update/${id}`
    },

    users: {
        root: "/users",
        create: "/users/user-create",
        update: (id: string) => `/users/user-update/${id}`
    }
}