
import { OptionYesNo } from "common/enums/optionYesNo"


export interface BookingArchiveRequestInterface {
    idBooking: string
    isArchived: OptionYesNo
}