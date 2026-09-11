import { useState, useEffect } from "react";
import { formatIDR, capitalizeWords } from "../../../utils/formatter";
import Modal from "../../../components/Modal";

export default function AdjustmentModal({
    isOpen,
    onClose,
    onSave,
    adjToEdit
}) {
    const [adjustmentType, setAdjustmentType] = useState('');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [allocationType, setAllocationType] = useState('');

    const isReady = adjustmentType && name.trim() && amount && allocationType;

    useEffect(() => {
        if (adjToEdit) {
            setAdjustmentType(adjToEdit.type);
            setName(adjToEdit.name);
            setAmount(adjToEdit.amount);
            setAllocationType(adjToEdit.allocationType);
        } else {
            setAdjustmentType('');
            setName('');
            setAmount('');
            setAllocationType('');
        }
    }, [adjToEdit, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newAdjustment = {
            type: adjustmentType,
            name: capitalizeWords(name),
            amount: Number(amount),
            allocationType: allocationType
        };

        onSave(newAdjustment);
    };

    const handleClose = () => {
        setAdjustmentType('');
        setName('');
        setAmount('');
        setAllocationType('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-4 gap-2 border-b border-outline-variant/402">
                <div className=" flex items-center gap-4">
                    <span className=" material-symbols-outlined text-[20px] text-primary">
                        instant_mix
                    </span>

                    <div className="flex flex-col">
                        <h2 className="text-md font-bold">
                            Tambah Biaya / Potongan
                        </h2>

                        <span className="text-xs text-slate-600">
                            Pajak, service, diskon, atau biaya lain
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleClose}
                >
                    <span className="material-symbols-outlined">
                        close
                    </span>
                </button>
            </div>

            {/* Body */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-4 px-4 pt-4">
                    {/* Adjustment Type */}
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            Tipe Penyesuaian
                        </span>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setAdjustmentType('charge')}
                                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${adjustmentType === 'charge'
                                    ? 'border-primary bg-primary/10 text-primary shadow-xs'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <span className="text-base leading-none font-bold">+</span>
                                <span>Biaya Tambahan</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setAdjustmentType('discount')}
                                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${adjustmentType === 'discount'
                                    ? 'border-primary bg-primary/10 text-primary shadow-xs'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <span className="text-base leading-none font-bold">-</span>
                                <span>Diskon / Potongan</span>
                            </button>
                        </div>
                    </div>


                    {/* Adjustment Name */}
                    <div className=" flex flex-col gap-1.5">
                        <label
                            htmlFor="name"
                            className="text-xs font-medium"
                        >
                            NAMA / KETERANGAN
                        </label>

                        <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="cth. Pajak atau Kupon"
                            className="
                            w-full h-11 px-4 py-2
                            bg-surface-container-low/50 rounded-xl
                            text-sm text-on-surface
                            placeholder:text-slate-400
                            outline-none
                            border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary
                            transition-all
                        "
                        />
                    </div>

                    {/* Adjustment Amount */}
                    <div className="flex-1 flex flex-col gap-1.5">
                        <label
                            htmlFor="amount"
                            className="text-xs font-medium"
                        >
                            NOMINAL
                        </label>

                        <div className="relative flex items-center h-11">
                            <span className="absolute left-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                                Rp
                            </span>

                            <input
                                type="text"
                                inputMode="numeric"
                                id="amount"
                                placeholder="0"
                                autoComplete="off"
                                value={amount ? Number(amount).toLocaleString("id-ID") : ""}
                                onChange={(e) => {
                                    const rawDigits = e.target.value.replace(/\D/g, "");
                                    setAmount(rawDigits ? Number(rawDigits) : "");
                                }}
                                className="w-full h-full pl-9 pr-3.5 bg-surface-container-low/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Adjustment Amount and Allocation */}
                    <div className="flex gap-2">
                        {/* Adjustment Allocation */}
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label
                                htmlFor="allocation-type"
                                className="text-xs font-medium"
                            >
                                ALOKASI PEMBAGIAN
                            </label>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAllocationType('proportional')}
                                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${allocationType === 'proportional'
                                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <span>Proporsional</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setAllocationType('equal')}
                                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${allocationType === 'equal'
                                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <span>Bagi Rata</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {allocationType && (
                        <div
                            className="text-xs bg-surface-container-low/50 rounded-lg border border-slate-200 overflow-hidden px-4 py-2"
                        >
                            {allocationType === "proportional" ? (
                                <p>
                                    <span className="font-bold">Alokasi Proporsional:</span> Biaya dibagi berdasarkan persentase total nominal pesanan masin-masing orang.
                                </p>
                            ) : (
                                <p>
                                    <span className="font-bold">Alokasi Bagi Rata:</span> Biaya dibagi sama rata untuk semua orang.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center p-4 gap-2 border-t border-outline-variant/30 mt-2 bg-surface-container-low/50">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={!isReady}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${isReady
                            ? "bg-primary text-white hover:bg-primary-hover active:scale-[0.99] cursor-pointer shadow-xs"
                            : "bg-outline-variant/60 text-white cursor-not-allowed opacity-60"
                            }`}
                    >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        <span>Simpan</span>
                    </button>
                </div>
            </form>
        </Modal>
    )
}