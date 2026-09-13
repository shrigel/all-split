import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { calculateBillTotal, calculateBilledParticipantCount } from "../../utils/calculations";
import ItemModal from "./components/item-modal/ItemModal";
import AdjustmentModal from "./components/AdjustmentModal";
import ScanReceiptModal from "./components/ScanReceiptModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import Button from "../../components/Button";
import BillInfoSection from "./components/BillInfoSection";
import BillItemsSection from "./components/BillItemsSection";
import BillAdjustmentsSection from "./components/BillAdjustmentsSection";
import BillSummarySection from "./components/BillSummarySection";
import { capitalizeWords } from "../../utils/formatter";

export default function BillForm({
    participants,
    bills = [],
    onSaveBill,
    onDirtyChange,
    onBack
}) {
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
    const isFormDirty = billToEdit
        ? (
            billName.trim() !== (billToEdit.name || "").trim() ||
            payerId !== (billToEdit.payerId || "") ||
            JSON.stringify(items) !== JSON.stringify(billToEdit.items || []) ||
            JSON.stringify(adjustments) !== JSON.stringify(billToEdit.adjustments || [])
        )
        : Boolean(
            billName.trim() ||
            payerId ||
            items.length > 0 ||
            adjustments.length > 0
        );

    const handleBackConfirmation = () => {
        if (isFormDirty) {
            setIsBackModalOpen(true);
            return
        }

        onBack();
    };

    useEffect(() => {
        if (!isFormDirty) {
            return;
        }

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener(
            "beforeunload",
            handleBeforeUnload
        );

        return () => {
            window.removeEventListener(
                "beforeunload",
                handleBeforeUnload
            );
        };
    }, [isFormDirty]);

    useEffect(() => {
        onDirtyChange?.(isFormDirty);
    }, [isFormDirty, onDirtyChange]);

    useEffect(() => {
        return () => {
            onDirtyChange?.(false);
        };
    }, [onDirtyChange]);

    const handleConfirmBack = () => {
        setIsBackModalOpen(false);
        onBack();
    };

    const handleAddItem = () => {
        setEditingItem(null);
        setIsItemModalOpen(true);
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

    const handleCloseItemModal = () => {
        setIsItemModalOpen(false);
        setEditingItem(null);
    };

    const handleAddAdjustment = () => {
        setEditingAdj(null);
        setIsAdjModalOpen(true);
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
        setAdjustments((prev) => prev.filter((a) => a.id !== adjId));
    };

    const handleEditAdjustment = (adj) => {
        setEditingAdj(adj);
        setIsAdjModalOpen(true);
    };

    const handleCloseAdjustmentModal = () => {
        setIsAdjModalOpen(false);
        setEditingAdj(null);
    };

    const finalTotal = calculateBillTotal({ items, adjustments });

    const billedCount = calculateBilledParticipantCount(items, participants);

    const isReady = Boolean(
        billName.trim() &&
        payerId &&
        items.length > 0
    );

    const handleSubmitBill = () => {
        if (!isReady) {
            return;
        }

        const bill = {
            id: billToEdit
                ? billToEdit.id
                : `bill-${Date.now()}`,
            name: capitalizeWords(billName.trim()),
            payerId,
            items,
            adjustments,
        };

        onSaveBill(bill);
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

                <BillInfoSection
                    billName={billName}
                    payerId={payerId}
                    participants={participants}
                    onBillNameChange={setBillName}
                    onPayerChange={setPayerId}
                />

                <BillItemsSection
                    items={items}
                    participants={participants}
                    onAddItem={handleAddItem}
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem}
                />

                <BillAdjustmentsSection
                    adjustments={adjustments}
                    onAddAdjustment={handleAddAdjustment}
                    onEditAdjustment={handleEditAdjustment}
                    onDeleteAdjustment={handleDeleteAdjustment}
                />

                <BillSummarySection
                    total={finalTotal}
                    billedCount={billedCount}
                />

                <Button
                    disabled={!isReady}
                    onClick={handleSubmitBill}
                    iconStart="check"
                >
                    Simpan Tagihan
                </Button>
            </main>

            <ScanReceiptModal
                isOpen={isScanReceiptModalOpen}
                onClose={() => setIsScanReceiptModalOpen(false)}
            />

            <ItemModal
                isOpen={isItemModalOpen}
                onClose={handleCloseItemModal}
                onSave={handleSaveItem}
                itemToEdit={editingItem}
                participants={participants}
            />

            <AdjustmentModal
                isOpen={isAdjModalOpen}
                onClose={handleCloseAdjustmentModal}
                onSave={handleSaveAdjustment}
                adjToEdit={editingAdj}
            />

            <ConfirmationModal
                btnLabel="Kembali"
                isOpen={isBackModalOpen}
                onClose={() => setIsBackModalOpen(false)}
                onConfirm={handleConfirmBack}
                confirmationMessage="Apakah Anda yakin ingin kembali? Detail tagihan yang belum disimpan akan hilang."
            />
        </>
    )
}