
import { createAsyncThunk } from "@reduxjs/toolkit"

import contactJSON from '../../../../common/data/contactData.json'


export const ContactFetchAllThunk = createAsyncThunk("contactFetchAllThunk", async () => {

    try {
        const request = await new Promise((resolve) => {
            setTimeout(() => resolve({             // Tiempo necesario para manejar la promesa
                ok: true,                          // Como es una simulación decimos que siempre es "ok"
                json: () => contactJSON            // Resolvemos la promesa pasandole directamente el contenido
            }), 200)
        })

        if (request.ok) {
            const allContacts = await request.json()
            return allContacts
        }
        else return []
    }
    catch (error) {
        console.log(error)
        throw error
    }

})