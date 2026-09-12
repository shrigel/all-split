import Input from "../../../components/Input";

export default function BillInfoSection({
    billName,
    payerId,
    participants,
    onBillNameChange,
    onPayerChange,
}) {
    return (
        <section className="flex flex-col gap-4 bg-white p-3 rounded-xl border border-outline-variant/40">
            <Input
                id="bill-name"
                label="Nama Tagihan / Pengeluaran"
                name="billName"
                placeholder="cth. Restoran Kalcer atau Kafe Estetik"
                value={billName}
                onChange={(e) => onBillNameChange(e.target.value)}
                icon="receipt_long"
            />

            <div className="flex flex-col gap-1.5">
                <label htmlFor="payer-id" className="text-xs">
                    Ditalangin:
                </label>

                <div className="flex gap-2 overflow-x-auto scrollbar-none">
                    <select
                        name="payerId"
                        id="payer-id"
                        value={payerId}
                        onChange={(e) => onPayerChange(e.target.value)}
                        className="w-full text-sm text-on-surface font-medium bg-surface-container py-2 pl-3 rounded-lg"
                    >
                        <option value="">Siapa yang nalangin?</option>
                        {participants.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    )
}