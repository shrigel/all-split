import WhatsAppLogo from "../../../components/WhatsAppLogo";

export default function ResultActions({
    isCopied,
    onCopy,
    onShareWA,
    onBackToHome
}) {
    return (
        <div className="flex flex-col gap-2">
            <button
                type="button"
                onClick={onCopy}
                className={`flex items-center gap-2 justify-center w-full py-3 rounded-xl text-md font-semibold transition-all cursor-pointer active:scale-[0.99] ${isCopied
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-primary text-on-primary hover:bg-primary-hover shadow-xs"
                    }`}
            >
                <span className="material-symbols-outlined text-[20px] transition-transform duration-200">
                    {isCopied ? "check" : "content_copy"}
                </span>
                <span className="text-sm font-bold">
                    {isCopied ? "Rincian Berhasil Disalin!" : "Salin Rincian Patungan"}
                </span>
            </button>

            <button
                onClick={onShareWA}
                className="flex items-center gap-2 justify-center w-full py-3 rounded-xl bg-[#25d366] text-white text-md font-semibold hover:bg-[#128c7e] active:scale-[0.99] transition-all"
            >
                <WhatsAppLogo className="w-6 h-6 text-white" />

                <span className="text-sm">
                    Bagikan ke WhatsApp
                </span>
            </button>

            <button
                onClick={onBackToHome}
                className="flex items-center gap-2 justify-center w-full py-3 rounded-xl text-md font-semibold active:scale-[0.99] transition-all"
            >
                <span className="material-symbols-outlined text-[20px]">
                    home
                </span>

                <span className="text-sm">
                    Kembali ke Beranda
                </span>
            </button>
        </div>
    )
}