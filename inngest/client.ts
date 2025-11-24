// Inngest client disabled — this project now uses direct generation.
// Keep a minimal stub to avoid runtime import errors if any remain.
export const inngest = {
  send: async () => {
    throw new Error("Inngest is disabled. Use direct generation instead.");
  },
};
