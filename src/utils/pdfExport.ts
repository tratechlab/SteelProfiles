import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EurocodeResult } from '../types/steel';
import { Project, StructuralMember, UserProfile } from '../types/project';

export function exportCalculationToPDF(
  result: EurocodeResult,
  project?: Project,
  member?: StructuralMember,
  user?: UserProfile
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
  const accentColor: [number, number, number] = [37, 99, 235]; // Blue 600
  const passColor: [number, number, number] = [22, 163, 74]; // Green 600
  const failColor: [number, number, number] = [220, 38, 38]; // Red 600

  // 1. Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('STAHLEURO · STATIČKI PRORAČUN ČELIČNIH NOSAČA', 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(186, 230, 253);
  doc.text('Eurocode 3 (EN 1993-1-1:2005) · Proračun nosivosti i uporabivosti elemenata', 14, 18);

  const currentDate = new Date().toLocaleDateString('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  doc.setTextColor(255, 255, 255);
  doc.text(`Datum: ${currentDate}`, 170, 18);

  // 2. Project & Engineer Details Box
  let y = 30;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 26, 2, 2, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PROJEKT:', 18, y + 6);
  doc.text('POZICIJA:', 18, y + 13);
  doc.text('INŽENJER:', 18, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.text(project ? `${project.title} (${project.location || 'Hrvatska'})` : 'Glavni projekt konstrukcije hale', 42, y + 6);
  doc.text(member ? `${member.mark} — ${member.name}` : 'POS G-101 — Glavni krovni nosač', 42, y + 13);
  doc.text(user ? `${user.name}, ${user.title} (${user.licenseNumber || 'HR-G'})` : 'Ing. Emir Ibrahimović, Ovlašteni inženjer građevinarstva', 42, y + 20);

  doc.setFont('helvetica', 'bold');
  doc.text('INVESTITOR:', 115, y + 6);
  doc.text('STANDARDI:', 115, y + 13);
  doc.text('STATUS:', 115, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.text(project ? project.client : 'Privatni investitor', 142, y + 6);
  doc.text(`${result.profile.standard} / HRN EN 1993`, 142, y + 13);
  
  if (result.isSatisfied) {
    doc.setTextColor(...passColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`ZADOVOLJAVA (η = ${(result.criticalRatio * 100).toFixed(1)}%)`, 142, y + 20);
  } else {
    doc.setTextColor(...failColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`PREKORAČENO (η = ${(result.criticalRatio * 100).toFixed(1)}%)`, 142, y + 20);
  }

  // 3. Section Title: Karakteristike Profila i Materijala
  y = 62;
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. Geometrijske i Mehaničke Karakteristike Poprečnog Presjeka', 14, y);

  const profileData = [
    [
      'Profil:', result.profile.name,
      'Kvaliteta čelika:', `${result.grade.name} (fy = ${result.grade.fy} MPa)`,
    ],
    [
      'Visina (h):', `${result.profile.h} mm`,
      'Granica razvlačenja (fy):', `${result.grade.fy} N/mm²`,
    ],
    [
      'Širina (b):', `${result.profile.b} mm`,
      'Vlačna čvrstoća (fu):', `${result.grade.fu} N/mm²`,
    ],
    [
      'Debljina hrpta (tw):', `${result.profile.tw} mm`,
      'Modul elastičnosti (E):', `${result.grade.E.toLocaleString()} N/mm²`,
    ],
    [
      'Debljina pojasnice (tf):', `${result.profile.tf} mm`,
      'Masa po metru (G):', `${result.profile.G} kg/m`,
    ],
    [
      'Površina presjeka (A):', `${result.profile.A} cm²`,
      'Posmična površina (Avz):', `${result.profile.Avz} cm²`,
    ],
    [
      'Moment tromosti (Iy):', `${result.profile.Iy.toLocaleString()} cm⁴`,
      'Moment tromosti (Iz):', `${result.profile.Iz.toLocaleString()} cm⁴`,
    ],
    [
      'Elastični otpor (Wel,y):', `${result.profile.Wely} cm³`,
      'Plastični otpor (Wpl,y):', `${result.profile.Wply} cm³`,
    ],
    [
      'Krivulje izvijanja (y/z):', `${result.profile.curveY} / ${result.profile.curveZ}`,
      'Klasa poprečnog presjeka:', `Klasa ${result.crossSectionClass}`,
    ],
  ];

  autoTable(doc, {
    startY: y + 3,
    body: profileData,
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 1.5, textColor: [51, 65, 85] },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [15, 23, 42], cellWidth: 42 },
      1: { cellWidth: 48 },
      2: { fontStyle: 'bold', textColor: [15, 23, 42], cellWidth: 44 },
      3: { cellWidth: 48 },
    },
    margin: { left: 14, right: 14 },
  });

  // 4. Section Title: Mjerodavna Opterećenja i Geometrija
  const finalY1 = (doc as any).lastAutoTable.finalY + 8;
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. Mjerodavna Proračunska Djelovanja (ULS) i Uporabivost (SLS)', 14, finalY1);

  const loadsData = [
    [
      'Uzdužna sila (N_Ed):', `${result.loads.Ned > 0 ? '+' : ''}${result.loads.Ned} kN (${result.loads.Ned > 0 ? 'Tlak' : result.loads.Ned < 0 ? 'Vlak' : 'Bez uzdužne sile'})`,
      'Raspon nosača (L):', `${result.loads.L} m`,
    ],
    [
      'Moment savijanja (M_y,Ed):', `${result.loads.Myed} kNm`,
      'Duljina izvijanja y-y (L_cr,y):', `${result.loads.Lcry} m`,
    ],
    [
      'Moment savijanja (M_z,Ed):', `${result.loads.Mzed} kNm`,
      'Duljina izvijanja z-z (L_cr,z):', `${result.loads.Lcrz} m`,
    ],
    [
      'Posmična sila (V_z,Ed):', `${result.loads.Vzed} kN`,
      'Bočno nepridržana duljina (L_LT):', `${result.loads.Llt} m`,
    ],
    [
      'Kontinuirano opterećenje (q):', `${result.loads.q} kN/m`,
      'Koncentrirana sila (F):', `${result.loads.F} kN`,
    ],
    [
      'Granica progiba (SLS):', `L / ${result.loads.deflectionLimit}`,
      'Parcijalni koeficijenti:', `γM0 = ${result.grade.gammaM0}, γM1 = ${result.grade.gammaM1}`,
    ],
  ];

  autoTable(doc, {
    startY: finalY1 + 3,
    body: loadsData,
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 1.5, textColor: [51, 65, 85] },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [15, 23, 42], cellWidth: 46 },
      1: { cellWidth: 44 },
      2: { fontStyle: 'bold', textColor: [15, 23, 42], cellWidth: 48 },
      3: { cellWidth: 44 },
    },
    margin: { left: 14, right: 14 },
  });

  // 5. Section Title: Tablica Dokaza Nosivosti (Eurocode 3)
  const finalY2 = (doc as any).lastAutoTable.finalY + 8;
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. Sažetak Dokaza Nosivosti i Uporabivosti (EN 1993-1-1)', 14, finalY2);

  const checksRows = result.checks.map((c) => {
    const isOk = c.isSatisfied;
    const ratioText = `${(c.ratio * 100).toFixed(1)}%`;
    return [
      c.title,
      c.standardClause,
      `${c.demandValue.toFixed(1)} ${c.demandUnit}`,
      `${c.capacityValue.toFixed(1)} ${c.capacityUnit}`,
      ratioText,
      isOk ? 'ZADOVOLJAVA' : 'PREKORAČENO',
    ];
  });

  autoTable(doc, {
    startY: finalY2 + 3,
    head: [['Dokaz nosivosti', 'Članak EN 1993', 'Djelovanje (Ed)', 'Otpornost (Rd)', 'Iskorištenost (η)', 'Status']],
    body: checksRows,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 32 },
      2: { halign: 'right', cellWidth: 28 },
      3: { halign: 'right', cellWidth: 28 },
      4: { halign: 'right', fontStyle: 'bold', cellWidth: 22 },
      5: { halign: 'center', fontStyle: 'bold', cellWidth: 22 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 5) {
        if (data.cell.raw === 'ZADOVOLJAVA') {
          data.cell.styles.textColor = passColor;
        } else {
          data.cell.styles.textColor = failColor;
        }
      }
      if (data.section === 'body' && data.column.index === 4) {
        const val = parseFloat(String(data.cell.raw));
        if (val > 100) {
          data.cell.styles.textColor = failColor;
        } else if (val > 90) {
          data.cell.styles.textColor = [217, 119, 6]; // amber
        } else {
          data.cell.styles.textColor = [15, 23, 42];
        }
      }
    },
    margin: { left: 14, right: 14 },
  });

  // 6. Conclusion & Signature Stamp Box
  const finalY3 = (doc as any).lastAutoTable.finalY + 8;
  const stampBoxY = Math.min(finalY3, 240);

  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(14, stampBoxY, 182, 34, 2, 2, 'FD');

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ZAKLJUČAK I INŽENJERSKA OVJERA:', 18, stampBoxY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const conclusionText = result.isSatisfied
    ? `Čelični profil ${result.profile.name} (kvaliteta ${result.grade.name}) ZADOVOLJAVA sve propisane granične uvjete nosivosti (ULS) i granična stanja uporabivosti (SLS) prema normi EN 1993-1-1. Maksimalni stupanj iskoristivosti iznosi ${(result.criticalRatio * 100).toFixed(1)}% i mjerodavan je dokaz: ${result.governingCheck}.`
    : `UPOZORENJE: Čelični profil ${result.profile.name} (kvaliteta ${result.grade.name}) NE ZADOVOLJAVA propisana opterećenja prema normi EN 1993-1-1! Mjerodavni stupanj iskorištenosti iznosi ${(result.criticalRatio * 100).toFixed(1)}% (${result.governingCheck}). Potrebno je odabrati veći profil ili smanjiti opterećenje.`;

  const splitText = doc.splitTextToSize(conclusionText, 110);
  doc.text(splitText, 18, stampBoxY + 12);

  // Engineer Stamp / Signature line
  doc.setDrawColor(148, 163, 184);
  doc.line(138, stampBoxY + 24, 188, stampBoxY + 24);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('M.P. i potpis odgovornog statičara', 138, stampBoxY + 28);
  doc.text(user?.name || 'Ovlašteni inženjer', 138, stampBoxY + 20);

  // Footer page
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('StahlEuro Civil & Structural Engine · Izrađeno u skladu s EN 1993-1-1 / EN 10365', 14, 290);
  doc.text('Stranica 1 / 1', 182, 290);

  // Save PDF
  const filename = `StahlEuro_${result.profile.name.replace(/\s+/g, '_')}_${member?.mark ? member.mark.replace(/\s+/g, '_') : 'POS'}.pdf`;
  doc.save(filename);
}
