import { useLocation, matchPath } from "react-router-dom";
import Logo from "./Logo";

export default function Header({ onLogoClick }) {
    const location = useLocation();

    const getPageTitle = () => {
        const pathname = location.pathname;

        if (pathname === "/") {
            return "Beranda";
        }

        if (pathname === "/participants") {
            return "Daftar Peserta";
        }

        if (pathname === "/bills") {
            return "Daftar Tagihan";
        }

        if (pathname === "/bills/create") {
            return "Tambah Tagihan";
        }

        if (matchPath("/bills/edit/:billId", pathname)) {
            return "Edit Tagihan";
        }

        if (matchPath("/result/:sessionId", pathname)) {
            return "Hasil Pembagian";
        }

        return "All Split";
    };

    return (
        <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-surface-container pt-safe">
            <div className="max-w-app mx-auto px-4 h-16 flex items-center justify-between">
                <div
                    onClick={onLogoClick}
                    className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
                >
                    <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center p-2">
                        <Logo className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-base font-bold text-on-surface tracking-tight">All Split</span>
                </div>

                <div className="flex items-center justify-center px-2 py-1 rounded-xl bg-primary/15">
                    <span className="text-sm font-semibold text-on-surface tracking-tight">
                        {getPageTitle()}
                    </span>
                </div>
            </div>
        </header>
    )
}