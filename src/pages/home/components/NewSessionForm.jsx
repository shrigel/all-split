import Button from "../../../components/Button";
import Input from "../../../components/Input";

export default function NewSessionForm({
    sessionName,
    onSessionNameChange,
    errorMessage,
    onSubmit
}) {
    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 mb-8"
        >
            <Input
                label="nama patungan"
                icon="edit_note"
                id="session-name"
                name="sessionName"
                placeholder="cth. Makan Bareng atau Liburan Bali"
                autoComplete="off"
                value={sessionName}
                onChange={onSessionNameChange}
                errorMessage={errorMessage}
            />

            <Button
                icon="add_circle"
                type="submit"
            >
                Mulai Hitung Tagihan
            </Button>
        </form>
    )
}