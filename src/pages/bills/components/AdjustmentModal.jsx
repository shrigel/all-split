import { useEffect, useState } from "react";
import { capitalizeWords } from "../../../utils/formatter";

import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import InputRupiah from "../../../components/InputRupiah";

import OptionSelector from "./OptionSelector";

const ADJUSTMENT_TYPE_OPTIONS = [
    {
        value: "charge",
        label: "Biaya Tambahan",
        prefix: "+"
    },
    {
        value: "discount",
        label: "Diskon / Potongan",
        prefix: "-"
    }
];

const ALLOCATION_TYPE_OPTIONS = [
    {
        value: "proportional",
        label: "Proporsional"
    },
    {
        value: "equal",
        label: "Bagi Rata"
    }
];

export default function AdjustmentModal({
    isOpen,
    onClose,
    onSave,
    adjToEdit
}) {
    const [adjustmentType, setAdjustmentType] =
        useState("");

    const [name, setName] =
        useState("");

    const [amount, setAmount] =
        useState("");

    const [allocationType, setAllocationType] =
        useState("");

    const isEditing = Boolean(adjToEdit);

    const isReady = Boolean(
        adjustmentType &&
        name.trim() &&
        Number(amount) > 0 &&
        allocationType
    );

    useEffect(() => {
        if (adjToEdit) {
            setAdjustmentType(adjToEdit.type);
            setName(adjToEdit.name);
            setAmount(adjToEdit.amount);
            setAllocationType(
                adjToEdit.allocationType
            );

            return;
        }

        setAdjustmentType("");
        setName("");
        setAmount("");
        setAllocationType("");
    }, [adjToEdit, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isReady) {
            return;
        }

        const adjustment = {
            type: adjustmentType,
            name: capitalizeWords(name.trim()),
            amount: Number(amount),
            allocationType,
        };

        onSave(adjustment);
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
                        instant_mix
                    </span>

                    <div className="flex flex-col">
                        <h2 className="text-md font-bold">
                            {isEditing
                                ? "Edit Biaya / Potongan"
                                : "Tambah Biaya / Potongan"}
                        </h2>

                        <span className="text-xs text-slate-600">
                            Pajak, service, diskon, atau biaya lain
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup modal biaya atau potongan"
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
                    <OptionSelector
                        label="Tipe Penyesuaian"
                        value={adjustmentType}
                        options={ADJUSTMENT_TYPE_OPTIONS}
                        onChange={setAdjustmentType}
                    />

                    <Input
                        label="Nama / Keterangan"
                        id="adjustment-name"
                        name="adjustmentName"
                        autoComplete="off"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="cth. Pajak atau Kupon"
                    />

                    <InputRupiah
                        id="adjustment-amount"
                        label="NOMINAL"
                        value={amount}
                        onChange={setAmount}
                    />

                    <OptionSelector
                        label="Alokasi Pembagian"
                        value={allocationType}
                        options={ALLOCATION_TYPE_OPTIONS}
                        onChange={setAllocationType}
                    />

                    {allocationType && (
                        <div className="text-xs bg-surface-container-low/50 rounded-lg border border-slate-200 overflow-hidden px-4 py-2">
                            {allocationType === "proportional" ? (
                                <p>
                                    <span className="font-bold">
                                        Alokasi Proporsional:
                                    </span>{" "}
                                    Biaya dibagi berdasarkan persentase total nominal pesanan masing-masing orang.
                                </p>
                            ) : (
                                <p>
                                    <span className="font-bold">
                                        Alokasi Bagi Rata:
                                    </span>{" "}
                                    Biaya dibagi sama rata untuk semua orang.
                                </p>
                            )}
                        </div>
                    )}
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