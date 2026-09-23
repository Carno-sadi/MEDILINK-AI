import { jsPDF } from "jspdf";
import { ChatSession, Profile } from "@/types";

function stripMarkdown(text: string): string {
  let clean = text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/^\|---[-|]*\|$/gm, '') // Remove table divider rows
    .trim();

  // Clean up extra empty lines
  clean = clean.replace(/\n\s*\n\s*\n/g, '\n\n');

  return clean;
}

export function exportChatToPDF(
  session: ChatSession,
  profile?: Profile | null
): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 22;

  // Header Bar
  doc.setFillColor(23, 120, 111); // #17786F (Brand Teal)
  doc.rect(margin, cursorY - 6, contentWidth, 14, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("MediLink — AI Health Guidance Report", margin + 4, cursorY + 3);

  cursorY += 16;

  // Metadata
  doc.setTextColor(91, 107, 133); // #5B6B85
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleString("en-GB")}`, margin, cursorY);
  doc.text(
    `Model: ${session.modelUsed === "med1-pro" ? "Med-1 Pro (Detailed)" : "Med-1 Flash (Quick)"}`,
    pageWidth - margin - 45,
    cursorY
  );

  cursorY += 8;

  // Profile Context Block
  if (profile && profile.name) {
    doc.setDrawColor(217, 230, 242); // #D9E6F2
    doc.setFillColor(240, 250, 246); // #F0FAF6
    doc.roundedRect(margin, cursorY, contentWidth, 20, 2, 2, "FD");

    doc.setTextColor(26, 43, 76); // #1A2B4C
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Patient: ${profile.name} (${profile.area || "Area not set"})`, margin + 4, cursorY + 6);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(91, 107, 133);
    const conditions =
      profile.diseases && profile.diseases.length > 0
        ? profile.diseases.join(", ")
        : "None reported";
    const allergies =
      profile.allergies && profile.allergies.length > 0
        ? profile.allergies.join(", ")
        : "None reported";
    doc.text(`Known Conditions: ${conditions}  |  Allergies: ${allergies}`, margin + 4, cursorY + 14);

    cursorY += 26;
  }

  // Conversation Heading
  doc.setTextColor(26, 43, 76);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(session.title || "Consultation Transcript", margin, cursorY);
  cursorY += 6;

  // Messages Loop
  session.messages.forEach((msg) => {
    const isUser = msg.role === "user";

    // Check page overflow
    if (cursorY > 260) {
      doc.addPage();
      cursorY = 20;
    }

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    if (isUser) {
      doc.setTextColor(23, 120, 111);
      doc.text("You:", margin, cursorY);
    } else {
      doc.setTextColor(26, 43, 76);
      doc.text("Dr MediLink:", margin, cursorY);
    }
    cursorY += 4.5;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(26, 43, 76);

    // Strip markdown for assistant, keep plain text for user. Preserve ⚡.
    const textToPrint = isUser ? msg.content : stripMarkdown(msg.content);
    const splitText = doc.splitTextToSize(textToPrint, contentWidth - 4);

    for (let i = 0; i < splitText.length; i++) {
      if (cursorY > 275) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(splitText[i], margin + 2, cursorY);
      cursorY += 4.2;
    }

    cursorY += 4; // spacing between messages
  });

  // Footer Disclaimer
  if (cursorY > 265) {
    doc.addPage();
    cursorY = 20;
  }

  cursorY += 6;
  doc.setDrawColor(217, 230, 242);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 5;

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(91, 107, 133);
  const disclaimer =
    "Disclaimer: MediLink provides general health guidance and is not a substitute for a licensed medical professional. In case of emergency, call 999 immediately.";
  const splitDisclaimer = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(splitDisclaimer, margin, cursorY);

  const safeTitle = (session.title || "chat")
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase();
  doc.save(`medilink-consultation-${safeTitle}.pdf`);
}
