import WhatsAppLogo from "../../../components/WhatsAppLogo";

export default function ResultActions({
    isCopied,
    onCopy,
    onShareWA,
    onBackToHome,
    onCopyLink,
    isLinkCopied,
    isSharingLink
}) {
    return (
        <div className="flex flex-col gap-2">
            {onCopyLink && (
                <button
                    type="button"
                    onClick={onCopyLink}
                    disabled={isSharingLink}
                    className={`flex items-center gap-2 justify-center w-full py-3 rounded-xl text-md font-semibold transition-all cursor-pointer active:scale-[0.99] border ${isLinkCopied
                            ? "bg-emerald-600 text-white border-transparent"
                            : "bg-surface-container-highest text-on-surface hover:bg-surface-container-high border-outline-variant/40"
                        }`}
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {isLinkCopied ? "check" : "link"}
                    </span>
                    <span className="text-sm font-bold">
                        {isLinkCopied ? "Tautan Berhasil Disalin!" : isSharingLink ? "Membuat Tautan..." : "Salin Tautan Patungan"}
                    </span>
                </button>
            )}

            {onCopy && (
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
            )}

            {onShareWA && (
                <button
                    onClick={onShareWA}
                    className="flex items-center gap-2 justify-center w-full py-3 rounded-xl bg-[#25d366] text-white text-md font-semibold hover:bg-[#128c7e] active:scale-[0.99] transition-all cursor-pointer"
                >
                    <WhatsAppLogo className="w-6 h-6 text-white" />

                    <span className="text-sm">
                        Bagikan ke WhatsApp
                    </span>
                </button>
            )}

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