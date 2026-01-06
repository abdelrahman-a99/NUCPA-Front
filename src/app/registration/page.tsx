"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PixelButton from "@/components/ui/PixelButton";
import TeamView from "@/components/registration/TeamView";
import RegistrationForm from "@/components/registration/RegistrationForm";
import { useRegistration } from "@/hooks/useRegistration";
import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function RegistrationPage() {
  const {
    phase, setPhase, error, team, teamName, setTeamName, members, setMembers, fieldErrors,
    startGoogleLogin, isGoogleLoading, googleError, checkTeam, submitRegistration,
    deleteTeam, startEditing, logout, handleBlur
  } = useRegistration();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isLoggedIn = phase !== "idle" && phase !== "checking" && phase !== "error";

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Navbar
        isLoggedIn={isLoggedIn}
        showAuthButton={true}
        onSignIn={startGoogleLogin}
      />
      <main className="flex-grow bg-dots-about relative overflow-hidden">
        <div className="container-lg py-12 relative z-10 px-4">
          <header className="text-center mb-10">
            <h1 className="font-pixel text-4xl sm:text-6xl text-teal-bright pixel-outline drop-shadow-sm">
              REGISTRATION
            </h1>
            <div className="h-1 w-24 bg-teal-bright mx-auto mt-4 rounded-full opacity-60"></div>
          </header>

          {(error || googleError) && (
            <div className="mb-8 rounded-2xl border border-red/20 bg-red/5 p-4 text-sm text-red font-semibold text-center animate-pulse">
              {error || googleError}
            </div>
          )}

          <div className="rounded-xl2 border border-line/60 bg-white shadow-soft transition-all duration-300 hover:shadow-lg p-5 sm:p-12">
            {phase === "idle" && (
              <div className="flex flex-col items-center gap-8 text-center py-8">
                <div className="bg-teal-bright/10 p-6 rounded-full mb-2">
                  <div className="w-12 h-12 rounded-full bg-teal-bright animate-bounce" style={{ animationDuration: "3s" }} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-ink font-pixel">Welcome, Challenger!</h2>
                  <p className="text-muted max-w-md mx-auto font-medium">
                    To assume your position in the arena, please authenticate with your Google account.
                  </p>
                </div>
                <div className="flex flex-row flex-wrap justify-center gap-4 mt-2">
                  <PixelButton onClick={startGoogleLogin} variant="primary" size="sm">
                    {isGoogleLoading ? "CONNECTING..." : "LOGIN WITH GOOGLE"}
                  </PixelButton>
                  <PixelButton href="/" variant="outline-red" size="sm">
                    RETURN HOME
                  </PixelButton>
                </div>
              </div>
            )}

            {phase === "checking" && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 border-4 border-teal-bright border-t-transparent rounded-full animate-spin"></div>
                <p className="text-ink font-pixel animate-pulse">Retrieving Data...</p>
              </div>
            )}

            {phase === "hasTeam" && team && (
              <TeamView
                team={team}
                onLogout={logout}
                onEdit={startEditing}
                onDelete={() => setIsDeleteModalOpen(true)}
              />
            )}

            {(phase === "noTeam" || phase === "editing") && (
              <RegistrationForm
                isEditing={phase === "editing"}
                teamName={teamName}
                setTeamName={setTeamName}
                members={members}
                setMembers={setMembers}
                fieldErrors={fieldErrors}
                onSubmit={submitRegistration}
                onLogout={logout}
                onCancel={phase === "editing" ? () => setPhase("hasTeam") : undefined}
                onBlurField={handleBlur}
              />
            )}

            {phase === "error" && (
              <div className="text-center py-12">
                <p className="font-pixel text-red font-bold text-lg mb-6">Something went wrong.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <PixelButton onClick={checkTeam} variant="primary" size="sm">
                    RETRY
                  </PixelButton>
                  <PixelButton onClick={logout} variant="ghost" size="sm">
                    LOGOUT SESSION
                  </PixelButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="DELETE TEAM?"
        message="Are you sure you want to delete your team? This will remove all your data and you will need to register again."
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          deleteTeam();
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmLabel="YES, DELETE"
        cancelLabel="KEEP TEAM"
        variant="danger"
      />

      <Footer />
    </div>
  );
}
