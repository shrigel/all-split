import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { capitalizeWords, formatIDR } from "../../../utils/formatter";
import ItemModal from "./modal/ItemModal";
import AdjustmentModal from "./modal/AdjustmentModal";
import ScanReceiptModal from "./modal/ScanReceiptModal";
import ConfirmationModal from "../../../components/ConfirmationModal";

export default function BillForm({ participants, bills = [], onSaveBill, onDirtyChange, onBack }) {
    const [billName, setBillName] = useState("");
    const [payerId, setPayerId] = useState("");
    const [items, setItems] = useState([]);
    const [adjustments, setAdjustments] = useState([]);

    const { billId } = useParams();
    const billToEdit = bills.find((b) => b.id === billId);

    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [isAdjModalOpen, setIsAdjModalOpen] = useState(false);
    const [editingAdj, setEditingAdj] = useState(null);

    const [isScanReceiptModalOpen, setIsScanReceiptModalOpen] = useState(false);

    useEffect(() => {
        if (billToEdit) {
            setBillName(billToEdit.name);
            setPayerId(billToEdit.payerId);
            setItems(billToEdit.items || []);
            setAdjustments(billToEdit.adjustments || []);
        } else {
            setBillName("");
            setPayerId("");
            setItems([]);
            setAdjustments([]);
        }
    }, [billToEdit]);

    const [isBackModalOpen, setIsBackModalOpen] = useState(false);
    const isFormDirty = () => {
        if (!billToEdit) {
            return Boolean(billName.trim() || payerId || items.length > 0 || adjustments.length > 0);
        }

        const isNameChanged = billName.trim() !== (billToEdit.name || "").trim();
        const isPayerChanged = payerId !== (billToEdit.payerId || "");
        const isItemsChanged = JSON.stringify(items) !== JSON.stringify(billToEdit.items || []);
        const isAdjustmentsChanged = JSON.stringify(adjustments) !== JSON.stringify(billToEdit.adjustments || []);
        return isNameChanged || isPayerChanged || isItemsChanged || isAdjustmentsChanged;
    };
    const handleBackConfirmation = () => {
        if (isFormDirty()) {
            setIsBackModalOpen(true);
        } else {
            onBack();
        }
    };

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isFormDirty()) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [billName, payerId, items, adjustments]);

    useEffect(() => {
        if (onDirtyChange) {
            onDirtyChange(isFormDirty());
        }
        return () => {
            if (onDirtyChange) onDirtyChange(false);
        };
    }, [billName, payerId, items, adjustments, onDirtyChange]);

    const handleBack = () => {
        setBillName("");
        setPayerId("");
        setItems([]);
        setAdjustments([]);
        onBack();
    };

    const handleSaveItem = (itemData) => {
        if (editingItem) {
            setItems((prev) =>
                prev.map((i) => (i.id === editingItem.id ? { ...itemData, id: editingItem.id } : i))
            );
        } else {
            setItems((prev) => [...prev, { ...itemData, id: 'item-' + Date.now() }]);
        }
        setIsItemModalOpen(false);
        setEditingItem(null);
    };

    const handleDeleteItem = (itemId) => {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
        setIsItemModalOpen(true);
    };

    const handleSaveAdjustment = (adjData) => {
        if (editingAdj) {
            setAdjustments((prev) =>
                prev.map((a) => (a.id === editingAdj.id ? { ...adjData, id: editingAdj.id } : a))
            );
        } else {
            setAdjustments((prev) => [...prev, { ...adjData, id: 'adj-' + Date.now() }]);
        }
        setIsAdjModalOpen(false);
        setEditingAdj(null);
    };

    const handleDeleteAdjustment = (adjId) => {
        console.log(adjustments)
        setAdjustments((prev) => prev.filter((a) => a.id !== adjId));
    };

    const handleEditAdjustment = (adj) => {
        setEditingAdj(adj);
        setIsAdjModalOpen(true);
    };

    const itemsSubtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const totalCharges = adjustments
        .filter((a) => a.type === 'charge')
        .reduce((sum, a) => sum + Number(a.amount || 0), 0);
    const totalDiscounts = adjustments
        .filter((a) => a.type === 'discount')
        .reduce((sum, a) => sum + Number(a.amount || 0), 0);

    const finalTotal = Math.max(0, itemsSubtotal + totalCharges - totalDiscounts);

    const uniqueBilledIds = new Set();
    items.forEach((item) => {
        if (item.assignedParticipantIds.includes('all')) {
            participants.forEach((p) => uniqueBilledIds.add(p.id));
        } else {
            item.assignedParticipantIds.forEach((id) => uniqueBilledIds.add(id));
        }
    });

    const billedCount = uniqueBilledIds.size;

    const isReady = billName.trim() && payerId.trim() && items.length > 0;

    const handleSubmitBill = () => {
        if (!isReady) return;

        const bill = {
            id: billToEdit ? billToEdit.id : 'bill-' + Date.now(),
            name: billName.trim(),
            payerId: payerId,
            items: items,
            adjustments: adjustments,
        };

        onSaveBill(bill);
        setBillName("")
        setPayerId("")
        setItems([])
        setAdjustments([])
    };

    return (
        <>
            <main className="flex-1 flex flex-col gap-6 w-full max-w-app mx-auto px-4 py-6">
                <div>
                    <button
                        type="button"
                        onClick={handleBackConfirmation}
                        className="flex items-center gap-2 text-primary bg-surface-container/75 px-2 py-1 rounded-full border border-outline-variant/40 hover:bg-surface-container-high transition-all"
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            arrow_back
                        </span>

                        <span className="text-sm">
                            Kembali
                        </span>
                    </button>
                </div>

                <div className="flex items-center bg-surface-container p-1 rounded-lg gap-1">
                    <button className="flex-1 flex items-center justify-center gap-2.5 bg-white py-2.5 rounded-md text-primary">
                        <span className="material-symbols-outlined text-[20px]">
                            edit_note
                        </span>

                        <span className="text-sm">
                            Ketik Manual
                        </span>
                    </button>

                    <button
                        onClick={() => setIsScanReceiptModalOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2.5"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            document_scanner
                        </span>

                        <span className="text-sm">
                            Scan Struk
                        </span>
                    </button>
                </div>

                <section className="flex flex-col gap-4 bg-white p-3 rounded-xl border border-outline-variant/40">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="bill-name" className="text-xs">Nama Tagihan / Pengeluaran</label>

                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined text-[20px] text-slate-400 absolute left-3 pointer-events-none">
                                receipt_long
                            </span>
                            <input
                                type="text"
                                id="bill-name"
                                name="billName"
                                placeholder="cth. Restoran Kalcer atau Kafe Estetik"
                                autoComplete="off"
                                value={billName}
                                onChange={(e) => setBillName(e.target.value)}
                                className={`w-full h-11 pl-11 pr-3 rounded-xl bg-surface-container-low/50 text-slate-800 text-sm placeholder:text-slate-400 outline-none transition-all border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary`}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="payer-id" className="text-xs">
                            Ditalangin:
                        </label>

                        <div className="flex gap-2 overflow-x-auto scrollbar-none">
                            <select
                                name="payerId"
                                id="payer-id"
                                value={payerId}
                                onChange={(e) => setPayerId(e.target.value)}
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

                <section className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">
                            shopping_cart
                        </span>

                        <span className="text-lg font-semibold">
                            Rincian Tagihan ({items.length})
                        </span>
                    </div>

                    <div className="flex flex-col px-4 bg-white rounded-2xl shadow-xs border border-outline-variant/40 divide-y divide-outline-variant/20 overflow-hidden">
                        {items.length === 0 ? (
                            <div className="flex flex-col py-10 items-center text-center">
                                <div className="bg-secondary/20 flex justify-center items-center rounded-full w-12 h-12">
                                    <span className="material-symbols-outlined text-[36px] text-secondary">
                                        receipt_long
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-on-surface">
                                    Belum ada rincian tagihan
                                </h3>

                                <p className="text-sm text-on-surface-variant max-w-[260px] leading-relaxed">
                                    Tambahkan item pertama ke struk agar bisa dibuat patungan
                                </p>
                            </div>
                        ) : (
                            <>
                                {items.map((item) => (
                                    <div key={item.id} className="flex flex-col py-3 gap-2">
                                        <div className="flex justify-between items-center gap-4">
                                            <div className="flex items-center justify-between gap-2 w-full">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-on-surface truncate">
                                                        {capitalizeWords(item.name)}
                                                    </span>

                                                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5">
                                                        <span>
                                                            {item.quantity} porsi @ {formatIDR(item.unitPrice)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <span className="text-lg font-bold text-on-surface">
                                                    {formatIDR(item.quantity * item.unitPrice)}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleEditItem(item)}
                                                className="text-gray-400 hover:text-primary transition-all cursor-pointer"
                                                title="Edit Item"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    edit
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => (handleDeleteItem(item.id))}
                                                className="text-gray-400 hover:text-red-500 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">
                                                    delete
                                                </span>
                                            </button>
                                        </div>

                                        <div className="flex gap-2 items-center flex-wrap bg-surface-container-low p-2 rounded-xl">
                                            <span className="text-xs">
                                                Dipesan:
                                            </span>

                                            {item.assignedParticipantIds.includes('all') || item.assignedParticipantIds.length === participants.length ? (
                                                <div className="flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2 py-1 rounded-lg text-xs font-semibold">
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        groups
                                                    </span>

                                                    <span>
                                                        Semua ({participants.length} peserta)
                                                    </span>
                                                </div>
                                            ) : (
                                                item.assignedParticipantIds.map((pId) => {
                                                    const p = participants.find((part) => part.id === pId);

                                                    return (
                                                        <span
                                                            key={p.id}
                                                            className="bg-surface-container-high text-on-surface px-2 py-1 rounded-lg text-xs font-medium"
                                                        >
                                                            {p.name}
                                                        </span>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        <div className="flex justify-center items-center py-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsItemModalOpen(true);
                                    setEditingItem(null);
                                }}
                                className="flex justify-center items-center gap-1.5 text-primary w-full h-10 rounded-xl bg-surface-container hover:bg-surface-container-high hover:text-primary-hover border border-primary/20 transition-all"
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    add_circle
                                </span>
                                <span className="text-sm font-semibold">
                                    Tambah Item
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">
                            tune
                        </span>

                        <span className="text-lg font-semibold">
                            Biaya Lain / Potongan
                        </span>
                    </div>
                    <div className="flex flex-col bg-white rounded-xl px-4 border border-outline-variant/40 divide-y divide-outline-variant/20">
                        {adjustments.length === 0 ? (
                            <div className="flex flex-col justify-center items-center mt-4 py-4">
                                <div className="bg-secondary/20 flex justify-center items-center rounded-full w-12 h-12">
                                    <span className="material-symbols-outlined text-[36px] text-secondary">
                                        money_bag
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-on-surface">
                                    Belum ada biaya lain / potongan
                                </h3>
                            </div>
                        ) : (
                            adjustments.map((adj) => (
                                <div key={adj.id} className="flex items-center justify-between py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">
                                            {adj.name}
                                        </span>
                                        <span className="text-xs text-gray-600">
                                            {adj.type === 'charge' ? 'Tambahan' : 'Potongan'} | {adj.allocationType === 'proportional' ? 'Proporsional' : 'Bagi Rata'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-semibold ${adj.type === 'charge' ? 'text-red-500' : 'text-green-500'
                                            }`}>
                                            {adj.type === 'charge' ? `+${formatIDR(adj.amount)}` : `-${formatIDR(adj.amount)}`}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => handleEditAdjustment(adj)}
                                            className="text-gray-400 hover:text-primary transition-all cursor-pointer"
                                            title="Edit Item"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                edit
                                            </span>
                                        </button>

                                        <button
                                            onClick={() => { handleDeleteAdjustment(adj.id); }}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                        <div className="flex justify-center items-center py-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdjModalOpen(true);
                                    setEditingAdj(null);
                                }}
                                className="flex justify-center items-center gap-1.5 text-primary w-full h-10 rounded-xl bg-surface-container hover:bg-surface-container-high hover:text-primary-hover border border-primary/20 transition-all"
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    add_circle
                                </span>
                                <span className="text-sm font-semibold">
                                    Tambah Biaya / Potongan
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                <div className="flex justify-between bg-surface-container-high p-3 py-3.5 border-t border-outline-variant/40 rounded-xl">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-on-surface/80">
                            Total Tagihan
                        </span>

                        <span className="text-2xl font-bold text-primary">
                            {formatIDR(finalTotal)}
                        </span>
                    </div>

                    <div className="flex flex-col text-right gap-1">
                        <span className="text-xs text-on-surface/80">
                            Ditagih ke:
                        </span>

                        <span className="text-xs font-semibold text-primary">
                            {billedCount} orang
                        </span>
                    </div>
                </div>

                <button
                    disabled={!isReady}
                    onClick={handleSubmitBill}
                    className={`flex justify-center items-center w-full gap-2 py-2.5 rounded-xl transition-all text-white
                    ${isReady
                            ? 'bg-primary hover:bg-primary-hover active:scale-[0.99] cursor-pointer'
                            : 'bg-outline-variant/60 cursor-not-allowed opacity-60'
                        }`}
                >
                    <span className="material-symbols-outlined text-[20px]">
                        check
                    </span>

                    <span className="text-sm font-semibold">
                        Simpan Tagihan
                    </span>
                </button>
            </main>

            <ScanReceiptModal
                isOpen={isScanReceiptModalOpen}
                onClose={() => setIsScanReceiptModalOpen(false)}
            />

            <ItemModal
                isOpen={isItemModalOpen}
                onClose={() => {
                    setIsItemModalOpen(false)
                    setEditingItem(null);
                }}
                onSave={handleSaveItem}
                itemToEdit={editingItem}
                participants={participants}
            />

            <AdjustmentModal
                isOpen={isAdjModalOpen}
                onClose={() => {
                    setIsAdjModalOpen(false);
                    setEditingAdj(null);
                }}
                onSave={handleSaveAdjustment}
                adjToEdit={editingAdj}
            />

            <ConfirmationModal
                isOpen={isBackModalOpen}
                onClose={() => setIsBackModalOpen(false)}
                onConfirm={handleBack}
                confirmationMessage="Apakah Anda yakin ingin kembali? Detail tagihan yang belum disimpan akan hilang."
            />
        </>
    )
}