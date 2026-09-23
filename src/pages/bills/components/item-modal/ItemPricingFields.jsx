import { formatIDR } from "../../../../utils/formatter";
import InputRupiah from "../../../../components/InputRupiah";

export default function ItemPricingFields({
    quantity,
    unitPrice,
    subtotal,
    onQuantityChange,
    onUnitPriceChange,
}) {
    const handleDecreaseQuantity = () => {
        const nextQuantity = Math.max(1, (Number(quantity) || 1) - 1);

        onQuantityChange(nextQuantity);
    };

    const handleIncreaseQuantity = () => {
        const nextQuantity = (Number(quantity) || 0) + 1;

        onQuantityChange(nextQuantity);
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;

        if (value === "") {
            onQuantityChange("");
            return;
        }

        const parsedValue = parseInt(value, 10);

        onQuantityChange(Number.isNaN(parsedValue) ? "" : parsedValue);
    };

    const handleQuantityBlur = () => {
        if (!quantity || Number(quantity) < 1) {
            onQuantityChange(1);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <div className="flex-1 flex flex-col gap-1.5">
                    <label
                        htmlFor="quantity"
                        className="text-xs text-on-surface font-semibold uppercase tracking-wider"
                    >
                        JUMLAH (QTY)
                    </label>

                    <div className="flex items-center border border-slate-200 rounded-xl p-1 h-11">
                        <button
                            type="button"
                            onClick={handleDecreaseQuantity}
                            aria-label="Kurangi jumlah item"
                            className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                        >
                            -
                        </button>

                        <input
                            type="number"
                            id="quantity"
                            min="1"
                            value={quantity}
                            onFocus={(e) => e.target.select()}
                            onChange={handleQuantityChange}
                            onBlur={handleQuantityBlur}
                            className="w-full bg-transparent text-center text-sm font-bold text-slate-800 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />

                        <button
                            type="button"
                            onClick={handleIncreaseQuantity}
                            aria-label="Tambah jumlah item"
                            className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                        >
                            +
                        </button>
                    </div>
                </div>

                <InputRupiah
                    id="unit-price"
                    label="HARGA SATUAN"
                    value={unitPrice}
                    onChange={onUnitPriceChange}
                />
            </div>

            <div className="flex justify-between items-center px-4 py-2 bg-surface-container rounded-xl">
                <span className="text-xs">
                    Subtotal:
                </span>

                <span className="text-sm font-semibold text-primary text-right">
                    {formatIDR(subtotal)}
                </span>
            </div>
        </div>
    );
}