import { useEffect, useState } from "react";
import { capitalizeWords } from "../../../../utils/formatter";
import { calculateItemTotal } from "../../../../domain/calculation";

import Modal from "../../../../components/Modal";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";

import ItemPricingFields from "./ItemPricingFields";
import ParticipantSelector from "./ParticipantSelector";

export default function ItemModal({
    isOpen,
    onClose,
    onSave,
    itemToEdit,
    participants
}) {
    const [name, setName] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [assignedIds, setAssignedIds] = useState([]);

    const isEditing = Boolean(itemToEdit);

    const itemSubtotal = quantity === "" ? 0 : calculateItemTotal({ unitPrice, quantity });

    const isReady = Boolean(
        name.trim() &&
        Number(unitPrice) > 0 &&
        assignedIds.length > 0
    );

    useEffect(() => {
        if (itemToEdit) {
            setName(itemToEdit.name);
            setUnitPrice(itemToEdit.unitPrice);
            setQuantity(itemToEdit.quantity);
            setAssignedIds(itemToEdit.assignedParticipantIds);

            return;
        }

        setName("");
        setUnitPrice("");
        setQuantity(1);
        setAssignedIds([]);
    }, [itemToEdit, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isReady) {
            return;
        }

        const item = {
            name: capitalizeWords(name.trim()),
            unitPrice: Number(unitPrice),
            quantity: Math.max(1, Number(quantity) || 1),
            assignedParticipantIds: assignedIds,
        };

        onSave(item);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex justify-between items-center p-4 gap-2 border-b border-outline-variant/40">
                <div className="flex items-center gap-4">
                    <span
                        className="material-symbols-outlined text-[20px] text-primary"
                        aria-hidden="true"
                    >
                        edit_square
                    </span>

                    <div className="flex flex-col">
                        <h2 className="text-md font-bold">
                            {isEditing
                                ? "Edit Item"
                                : "Tambah Item"}
                        </h2>

                        <span className="text-xs text-slate-600">
                            Masukkan rincian item
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup modal item"
                >
                    <span
                        className="material-symbols-outlined"
                        aria-hidden="true"
                    >
                        close
                    </span>
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-4 px-4 pt-4">
                    <Input
                        label="Nama Item"
                        id="item-name"
                        name="itemName"
                        autoComplete="off"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="cth. Nasi Goreng atau Matcha Latte"
                    />

                    <ItemPricingFields
                        quantity={quantity}
                        unitPrice={unitPrice}
                        subtotal={itemSubtotal}
                        onQuantityChange={setQuantity}
                        onUnitPriceChange={setUnitPrice}
                    />

                    <ParticipantSelector
                        participants={participants}
                        selectedIds={assignedIds}
                        onChange={setAssignedIds}
                        subtotal={itemSubtotal}
                    />
                </div>

                <div className="flex items-center p-4 gap-2 border-t border-outline-variant/30 mt-2 bg-surface-container-low/50">
                    <Button
                        type="button"
                        variant="tonal"
                        onClick={onClose}
                        className="w-full"
                    >
                        Batal
                    </Button>

                    <Button
                        type="submit"
                        iconStart="check"
                        disabled={!isReady}
                        className="w-full"
                    >
                        Simpan
                    </Button>
                </div>
            </form>
        </Modal>
    );
}