import { formatDistanceToNow } from "date-fns"
import { hr } from "date-fns/locale"

export default function FormatDatuma({ datum, prikazDatuma = '-', relativno = false }) {
    if (!datum) {
        return prikazDatuma
    }

    const d = new Date(datum)

    if (isNaN(d.getTime())) {
        return prikazDatuma
    }

    const tekst = Intl.DateTimeFormat('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(d)
    if (!relativno) {
        return tekst
    }
    return (
        <>
        {tekst} <span className="text-muted">
({formatDistanceToNow(d, {addSuffix: true, locale: hr})})

        </span>
        </>
    )
}