
interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_API_ENDPOINT_LOGIN: string
    readonly VITE_API_ENDPOINT_BOOKINGS: string
    readonly VITE_API_ENDPOINT_ROOMS: string
    readonly VITE_API_ENDPOINT_CLIENTS: string
    readonly VITE_API_ENDPOINT_USERS: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}