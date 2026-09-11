import { useState } from "react";
import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useSessionManager } from "./hooks/useSessionManager";
import ProtectedRoute from "./components/ProtectedRoute";
import ConfirmationModal from "./components/ConfirmationModal";
import Header from "./components/Header";
import Home from "./pages/homes/Home";
import Participants from "./pages/participants/Participants";
import Bills from "./pages/bills/Bills";
import BillForm from "./pages/bills/BillForm";
import Result from "./pages/results/Result";

function App() {
	const {
		currentSession,
		savedSessions,
		handleStartSession,
		handleResumeSession,
		handleDiscardSession,
		handleAddParticipants,
		handleRemoveParticipant,
		handleSaveBill,
		handleDeleteBill,
		handleClearBillsAndBack,
		handleCalculateSession,
		handleOpenSession,
	} = useSessionManager();

	const navigate = useNavigate();
	const location = useLocation();

	const [isFormDirty, setIsFormDirty] = useState(false);
	const [isBackConfModalOpen, setIsBackConfModalOpen] = useState(false);

	const handleLogoClick = () => {
		if (isFormDirty) {
			setIsBackConfModalOpen(true);
		} else {
			if (location.pathname.startsWith('/result/')) {
				handleDiscardSession();
			}
			navigate('/');
		}
	};

	const handleBack = () => {
		setIsBackConfModalOpen(false);
		setIsFormDirty(false);
		navigate('/');
	};

	const handleCleanSession = () => {
		handleDiscardSession();
		navigate('/');
	};

	return (
		<>
			<div className="min-h-screen flex flex-col bg-surface text-on-surface">
				<Header onLogoClick={handleLogoClick} />

				<div className="flex-1 flex flex-col">
					<Routes>
						<Route path="*" element={<Navigate to="/" replace />} />

						<Route
							path="/"
							element={<Home
								onStartSession={handleStartSession}
								currentSession={currentSession}
								savedSessions={savedSessions}
								onOpenSession={handleOpenSession}
								onResumeSession={handleResumeSession}
								onDiscardSession={handleDiscardSession}
							/>}
						/>

						<Route
							path="/participants"
							element={
								<ProtectedRoute condition={Boolean(currentSession.name.trim())} redirectTo="/">
									<ProtectedRoute condition={Boolean(currentSession.bills.length === 0)} redirectTo="/bills">
										<Participants
											sessionName={currentSession.name}
											participants={currentSession.participants}
											onAddParticipant={handleAddParticipants}
											onRemoveParticipant={handleRemoveParticipant}
											onDirtyChange={setIsFormDirty}
											onNext={() => navigate('/bills')}
											onBack={handleCleanSession}
										/>
									</ProtectedRoute>
								</ProtectedRoute>
							}
						/>

						<Route
							path="/bills"
							element={
								<ProtectedRoute condition={currentSession.participants.length >= 2} redirectTo="/participants">
									<Bills
										session={currentSession}
										onAddBill={() => navigate('/bills/create')}
										onEditBill={(bill) => navigate(`/bills/edit/${bill.id}`)}
										onDeleteBill={handleDeleteBill}
										onCalculateSession={handleCalculateSession}
										onBack={handleClearBillsAndBack}
									/>
								</ProtectedRoute>
							}
						/>

						<Route
							path="/bills/create"
							element={
								<ProtectedRoute condition={currentSession.participants.length >= 2} redirectTo="/participants">
									<BillForm
										participants={currentSession.participants}
										onDirtyChange={setIsFormDirty}
										onSaveBill={handleSaveBill}
										onBack={() => navigate('/bills')}
									/>
								</ProtectedRoute>
							}
						/>

						<Route
							path="/bills/edit/:billId"
							element={
								<ProtectedRoute condition={currentSession.bills.length > 0} redirectTo="/bills">
									<BillForm
										participants={currentSession.participants}
										onDirtyChange={setIsFormDirty}
										bills={currentSession.bills}
										onSaveBill={handleSaveBill}
										onBack={() => navigate('/bills')}
									/>
								</ProtectedRoute>
							}
						/>

						<Route
							path="/result/:sessionId"
							element={
								<Result
									savedSessions={savedSessions}
									onBackToHome={handleCleanSession}
								/>
							}
						/>
					</Routes>
				</div>

			</div>

			{/* Back Confirmation Modal */}
			<ConfirmationModal
				isOpen={isBackConfModalOpen}
				onClose={() => setIsBackConfModalOpen(false)}
				onConfirm={handleBack}
				confirmationMessage="Perubahan yang belum disimpan akan hilang jika Anda kembali ke Beranda. Apakah Anda yakin ingin melanjutkan?"
			/>
		</>
	);
}

export default App;
