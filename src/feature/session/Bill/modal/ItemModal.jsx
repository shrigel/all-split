import { useState, useEffect } from "react";
import { formatIDR, capitalizeWords } from "../../../../utils/formatter";
import Modal from "../../../../components/Modal";

export default function ItemModal({
    isOpen,
    onClose,
    onSave,
    itemToEdit,
    participants
}) {
    const [name, setName] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [assignedIds, setAssignedIds] = useState([]);

    const isAll = assignedIds.includes('all') || (assignedIds.length === participants.length && participants.length > 0);
    const selectedCount = isAll ? participants.length : assignedIds.length;
    const itemSubtotal = (Number(unitPrice) || 0) * (Number(quantity) || 1);
    const perPersonEstimate = selectedCount > 0 ? Math.round(itemSubtotal / selectedCount) : 0;

    useEffect(() => {
        if (itemToEdit) {
            setName(itemToEdit.name);
            setUnitPrice(itemToEdit.unitPrice);
            setQuantity(itemToEdit.quantity);
            setAssignedIds(itemToEdit.assignedParticipantIds);
        } else {
            setName('');
            setUnitPrice('');
            setQuantity(1);
            setAssignedIds([]);
        }
    }, [itemToEdit, isOpen]);

    const isParticipantSelected = (pId) => isAll || assignedIds.includes(pId);

    const handleToggleAll = () => {
        if (isAll) {
            setAssignedIds([]);
        } else {
            setAssignedIds(['all']);
        }
    };

    const handleTogglePerson = (pId) => {
        const allIds = participants.map((p) => p.id);

        if (isAll) {
            setAssignedIds(allIds.filter((id) => id !== pId));
        } else {
            if (assignedIds.includes(pId)) {
                setAssignedIds(assignedIds.filter((id) => id !== pId));
            } else {
                const updated = [...assignedIds, pId];

                if (updated.length === participants.length) {
                    setAssignedIds(['all']);
                } else {
                    setAssignedIds(updated);
                }
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const item = {
            name: capitalizeWords(name),
            unitPrice: Number(unitPrice),
            quantity: Math.max(1, Number(quantity) || 1),
            assignedParticipantIds: assignedIds,
        };

        onSave(item);
        handleClose();
    };

    const handleClose = () => {
        setName('');
        setUnitPrice('');
        setQuantity(1);
        setAssignedIds([]);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
        >
            {/* Header */}
            <div className=" flex justify-between items-center p-4 gap-2 border-b border-outline-variant/40">
                <div className=" flex items-center gap-4">
                    <span className="material-symbols-outlined text-[20px] text-primary">
                        edit_square
                    </span>

                    <div className="flex flex-col">
                        <h2 className="text-md font-bold">
                            Tambah Item
                        </h2>

                        <span className="text-xs text-slate-600">
                            Masukkan rincian item
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

            {/* Body / Form */}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-4 px-4 pt-4">

                    {/* Input Item Name */}
                    <div className=" flex flex-col gap-1.5">
                        <label
                            htmlFor="item-name"
                            className="text-xs font-medium"
                        >
                            NAMA ITEM
                        </label>

                        <input
                            type="text"
                            name="itemName"
                            id="item-name"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="cth. Nasi Goreng atau Matcha Latte"
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

                    {/* Input Quantity and Price */}
                    <div className="flex gap-2">

                        {/* Input Quantity */}
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label
                                htmlFor="quantity"
                                className="text-xs font-medium"
                            >
                                JUMLAH (QTY)
                            </label>

                            <div className="flex items-center bg-surface-container-low/50 border border-slate-200 rounded-xl p-1 h-11">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((prev) => Math.max(1, (Number(prev) || 1) - 1))}
                                    className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                                >
                                    -
                                </button>

                                <input
                                    type="number"
                                    id="quantity"
                                    value={quantity}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '') {
                                            setQuantity('');
                                        } else {
                                            const parsed = parseInt(val, 10);
                                            setQuantity(isNaN(parsed) ? '' : parsed);
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!quantity || Number(quantity) < 1) {
                                            setQuantity(1);
                                        }
                                    }}
                                    className="w-full bg-transparent text-center text-sm font-bold text-slate-800 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />

                                <button
                                    type="button"
                                    onClick={() => setQuantity((prev) => (Number(prev) || 0) + 1)}
                                    className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Input Unit Price */}
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label
                                htmlFor="unit-price"
                                className="text-xs font-medium"
                            >
                                HARGA SATUAN
                            </label>

                            <div className="relative flex items-center h-11">
                                <span className="absolute left-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                                    Rp
                                </span>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    id="unit-price"
                                    placeholder="0"
                                    autoComplete="off"
                                    value={unitPrice ? Number(unitPrice).toLocaleString("id-ID") : ""}
                                    onChange={(e) => {
                                        const rawDigits = e.target.value.replace(/\D/g, "");
                                        setUnitPrice(rawDigits ? Number(rawDigits) : "");
                                    }}
                                    className="w-full h-full pl-9 pr-3.5 bg-surface-container-low/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Subtotal */}
                    <div className="flex justify-between items-center px-4 py-2 bg-surface-container rounded-xl">
                        <span className="text-xs">
                            Subtotal:
                        </span>

                        <span className="text-sm font-semibold text-primary text-right">
                            {formatIDR(unitPrice * quantity)}
                        </span>
                    </div>

                    {/* Allocation */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Dibagi Ke Siapa?
                            </span>

                            <button
                                type="button"
                                onClick={handleToggleAll}
                                className="text-xs font-medium text-primary hover:underline cursor-pointer"
                            >
                                {isAll ? "Batalkan Semua" : `Pilih Semua (${participants.length})`}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                            {participants.map((p) => {
                                const selected = isParticipantSelected(p.id);

                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => handleTogglePerson(p.id)}
                                        className={`flex items-center gap-2 p-2.5 rounded-xl transition-all text-left cursor-pointer border ${selected
                                            ? "border-primary bg-primary/10 shadow-xs"
                                            : "border-slate-200 bg-white hover:bg-slate-50"
                                            }`}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${selected ? "bg-primary text-white" : "bg-slate-200 text-slate-600"
                                                }`}
                                        >
                                            {p.name.charAt(0).toUpperCase()}
                                        </div>

                                        <span className={`text-xs font-semibold truncate flex-1 ${selected ? "text-on-surface" : "text-slate-600"}`}>
                                            {p.name}
                                        </span>

                                        {selected && (
                                            <span className="material-symbols-outlined text-primary text-[16px]">
                                                check_circle
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <p className="text-[11px] text-slate-500 mt-1">
                            {selectedCount === 0 ? (
                                <span className="font-medium">Pilih minimal 1 orang</span>
                            ) : (
                                <>Dihitung {formatIDR(perPersonEstimate)} / orang ({selectedCount} dipilih).</>
                            )}
                        </p>
                    </div>
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
                        disabled={!name.trim() || !unitPrice || selectedCount === 0}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${name.trim() && unitPrice && selectedCount > 0
                            ? "bg-primary text-white hover:bg-primary-hover active:scale-[0.99] cursor-pointer shadow-xs"
                            : "bg-outline-variant/60 text-white cursor-not-allowed opacity-60"
                            }`}
                    >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        <span>Simpan</span>
                    </button>
                </div>
            </form >
        </Modal >
    )
}