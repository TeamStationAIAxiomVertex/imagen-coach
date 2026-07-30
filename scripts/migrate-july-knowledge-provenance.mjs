import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const files = [
  "content/knowledge/approved/2026-07-22-leadership-signal-cross-border-practice-batch.json",
  "content/knowledge/approved/2026-07-23-decision-authority-regional-context-batch.json",
  "content/knowledge/queue/2026-07-22-leadership-signal-cross-border-practice-batch-candidates.json",
  "content/knowledge/queue/2026-07-23-decision-authority-regional-context-batch-candidates.json"
];

const routeMap = new Map([
  ["/coaching-de-imagen-online/", "/servicios-asesoria-de-imagen-coaching/coaching-de-imagen/"],
  ["/coaching-seguridad-interna-posicionamiento-profesional/", "/servicios-asesoria-de-imagen-coaching/coaching-de-abundancia/"],
  ["/hombres-profesionales/", "/imagen-profesional/"],
  ["/imagen-empresarial-y-talleres/", "/servicios-asesoria-de-imagen-coaching/talleres/"],
  ["/imagen-empresarial/", "/servicios-asesoria-de-imagen-coaching/talleres/"],
  ["/imagen-para-empresarias/", "/imagen-ejecutiva-para-empresarias/"],
  ["/imagen-presencia/que-es-imagen-profesional/", "/imagen-profesional/"],
  ["/imagen-profesional-para-hombres/", "/imagen-profesional/"],
  ["/latam/", "/comparaciones/evolucion-coaching-imagen-mexico-latam/"],
  ["/marca-personal-ejecutiva/", "/imagen-estrategica/"],
  ["/mercados-hispanos/", "/miami-hispanos/"],
  ["/mujeres-lideres/", "/imagen-para-mujeres-lideres/"],
  ["/servicios-asesoria-de-imagen-coaching/imagen-empresarial/", "/servicios-asesoria-de-imagen-coaching/talleres/"]
]);

const sourceIdFor = (signal) => {
  const value = String(signal || "");
  if (/^Blog archive:/i.test(value)) {
    return `sonia-blog:${value.replace(/^Blog archive:\s*/i, "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  }
  if (/^Sonia knowledge bank:/i.test(value)) {
    const sourceFiles = {
      "seguridad interna, visibilidad y posicionamiento": "Creencias_SoniaMcrorey.docx",
      "mujeres líderes y presencia directiva": "Sonia McRorey — Ocupar tu lugar.pdf",
      "imagen para hombres profesionales": "Imagen profesional estratégica: cómo proyectar autoridad según tu industria y personalidad",
      "imagen empresarial, talleres y equipos": "Sonia_McRorey_Servicios_v7.docx",
      "empresarias, marca personal y visibilidad": "Servicio Marca Personal.pdf"
    };
    const label = value.replace(/^Sonia knowledge bank:\s*/i, "").trim().toLowerCase();
    return `sonia-drive:${(sourceFiles[label] || label)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  }
  if (/^(Repository )?GEO operating system/i.test(value)) {
    return "sonia-drive:Imagen interna y externa Guadalajara Mexico.pdf";
  }
  if (/\.(docx|pdf)$/i.test(value)) {
    return `sonia-drive:${value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  }
  return "sonia-reviewed:contexto-ejecutivo-mexico-latam";
};

const sourceSignalFor = (signal) => {
  const value = String(signal || "");
  const sourceFiles = {
    "seguridad interna, visibilidad y posicionamiento": "Creencias_SoniaMcrorey.docx",
    "mujeres líderes y presencia directiva": "Sonia McRorey — Ocupar tu lugar.pdf",
    "imagen para hombres profesionales": "Imagen profesional estratégica: cómo proyectar autoridad según tu industria y personalidad",
    "imagen empresarial, talleres y equipos": "Sonia_McRorey_Servicios_v7.docx",
    "empresarias, marca personal y visibilidad": "Servicio Marca Personal.pdf"
  };
  if (value.toLowerCase().startsWith("sonia knowledge bank:")) {
    const label = value.slice("Sonia knowledge bank:".length).trim().toLowerCase();
    const match = Object.keys(sourceFiles).find((key) => label.includes(key) || key.includes(label));
    return (match && sourceFiles[match]) || value;
  }
  if (/^(Repository )?GEO operating system/i.test(value)) {
    return "Imagen interna y externa guadalajara méxico.pdf";
  }
  return value;
};

for (const relative of files) {
  const file = path.join(root, relative);
  const batch = JSON.parse(await readFile(file, "utf8"));
  const sourceVersion = `${batch.batchId}-provenance-v1`;
  batch.cards = batch.cards.map((card) => {
    const sourceSignals = (card.sourceSignals || []).map(sourceSignalFor);
    const sourceIds = sourceSignals.map(sourceIdFor);
    const provenancePayload = JSON.stringify({
      sourceIds,
      sourceSignals,
      question: card.question,
      shortAnswer: card.shortAnswer
    });
    return {
      ...card,
      routePriority: card.routePriority.map((route) => routeMap.get(route) || route),
      sourceSignals,
      sourceIds,
      sourceLocator: sourceSignals,
      sourceHash: createHash("sha256").update(provenancePayload).digest("hex"),
      sourceVersion,
      contentMode: "editorial_synthesis_from_reviewed_sonia_sources"
    };
  });
  await writeFile(file, `${JSON.stringify(batch, null, 2)}\n`, "utf8");
  console.log(`Migrated ${relative}: ${batch.cards.length} cards`);
}
