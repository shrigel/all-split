import Button from "../../../components/Button";
import Input from "../../../components/Input";


export default function NewParticipantForm({
    participantName,
    onSubmit,
    onParticipantNameChange,
    errorMessage,
}) {
    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
                <label htmlFor="participant-name" className="text-sm font-semibold">
                    Tambah Peserta
                </label>

                <span className="text-xs text-slate-400">
                    Tekan Enter atau klik Tambah
                </span>
            </div>

            <form onSubmit={onSubmit} className="flex gap-2 items-start">
                <Input
                    icon="person_add"
                    id="participant-name"
                    name="participantName"
                    placeholder="Tulis nama yang patungan..."
                    autoComplete="off"
                    value={participantName}
                    onChange={onParticipantNameChange}
                    errorMessage={errorMessage}
                />

                <Button
                    type="submit"
                    iconStart="add"
                    className="px-4"
                >
                    Tambah
                </Button>
            </form>
        </div>
    )
}