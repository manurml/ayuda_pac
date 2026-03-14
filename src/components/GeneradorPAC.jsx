import { useState, useRef } from "react";

// ─── Paleta y estilos globales ───────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --verde:   #2D5016;
    --verde2:  #4A7C2F;
    --verde3:  #7EB356;
    --crema:   #F5F0E8;
    --tierra:  #C4923A;
    --tierra2: #E8B86D;
    --gris:    #6B6558;
    --error:   #C0392B;
    --r: 10px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pac-wrap {
    font-family: 'DM Sans', sans-serif;
    background: var(--crema);
    min-height: 100vh;
    padding: 32px 16px 64px;
  }

  .pac-header {
    text-align: center;
    margin-bottom: 36px;
  }
  .pac-header h1 {
    font-family: 'Fraunces', serif;
    font-size: 2.1rem;
    font-weight: 600;
    color: var(--verde);
    line-height: 1.15;
  }
  .pac-header h1 em {
    font-style: italic;
    color: var(--tierra);
  }
  .pac-header p {
    color: var(--gris);
    font-size: 0.92rem;
    margin-top: 6px;
    font-weight: 300;
  }

  /* Stepper */
  .stepper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-bottom: 36px;
  }
  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    position: relative;
  }
  .step-circle {
    width: 36px; height: 36px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem;
    font-weight: 500;
    border: 2px solid #ccc;
    background: white;
    color: #aaa;
    transition: all .3s;
    z-index: 1;
  }
  .step-circle.active {
    background: var(--verde);
    border-color: var(--verde);
    color: white;
  }
  .step-circle.done {
    background: var(--verde3);
    border-color: var(--verde3);
    color: white;
  }
  .step-label {
    font-size: 0.7rem;
    color: var(--gris);
    font-weight: 400;
    text-align: center;
    max-width: 72px;
    line-height: 1.2;
  }
  .step-label.active { color: var(--verde); font-weight: 500; }
  .step-line {
    width: 60px; height: 2px;
    background: #ddd;
    margin-bottom: 20px;
    transition: background .3s;
  }
  .step-line.done { background: var(--verde3); }

  /* Card */
  .card {
    background: white;
    border-radius: var(--r);
    border: 1px solid #e2ddd4;
    padding: 32px 28px;
    max-width: 680px;
    margin: 0 auto 20px;
    box-shadow: 0 2px 12px rgba(45,80,22,.06);
  }

  .card-title {
    font-family: 'Fraunces', serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--verde);
    margin-bottom: 4px;
  }
  .card-sub {
    font-size: 0.82rem;
    color: var(--gris);
    margin-bottom: 24px;
    font-weight: 300;
  }

  /* Form */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .form-grid.cols1 { grid-template-columns: 1fr; }
  @media (max-width: 520px) { .form-grid { grid-template-columns: 1fr; } }

  .field { display: flex; flex-direction: column; gap: 5px; }
  .field.full { grid-column: 1 / -1; }

  label {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--verde);
    letter-spacing: .02em;
    text-transform: uppercase;
  }
  input, select, textarea {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.93rem;
    padding: 10px 12px;
    border: 1.5px solid #ddd;
    border-radius: 7px;
    background: var(--crema);
    color: #333;
    transition: border-color .2s;
    outline: none;
    width: 100%;
  }
  input:focus, select:focus, textarea:focus {
    border-color: var(--verde2);
    background: white;
  }
  .err { border-color: var(--error) !important; }
  .err-msg { font-size: 0.74rem; color: var(--error); }

  /* Parcelas */
  .parcela-card {
    background: var(--crema);
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    position: relative;
  }
  .parcela-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .parcela-num {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--verde);
    text-transform: uppercase;
    letter-spacing: .04em;
  }
  .btn-remove {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--error);
    font-size: 1.1rem;
    padding: 2px 6px;
    border-radius: 4px;
    line-height: 1;
  }
  .btn-remove:hover { background: #fde8e8; }

  .btn-add {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--verde2);
    background: none;
    border: 1.5px dashed var(--verde3);
    border-radius: 8px;
    padding: 10px 16px;
    cursor: pointer;
    width: 100%;
    justify-content: center;
    transition: background .2s;
    margin-top: 4px;
  }
  .btn-add:hover { background: #f0f8e8; }

  /* Ayudas checkboxes */
  .ayuda-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px;
    border: 1.5px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color .2s, background .2s;
    margin-bottom: 10px;
    background: var(--crema);
  }
  .ayuda-item.selected {
    border-color: var(--verde2);
    background: #f2f9ea;
  }
  .ayuda-item input[type=checkbox] {
    width: 18px; min-width: 18px; height: 18px;
    accent-color: var(--verde2);
    margin-top: 1px;
    cursor: pointer;
  }
  .ayuda-title { font-size: 0.9rem; font-weight: 500; color: var(--verde); }
  .ayuda-desc { font-size: 0.78rem; color: var(--gris); margin-top: 2px; font-weight: 300; }

  /* Resumen */
  .resumen-section { margin-bottom: 20px; }
  .resumen-label {
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--gris);
    text-transform: uppercase;
    letter-spacing: .05em;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #e2ddd4;
  }
  .resumen-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.87rem;
    padding: 5px 0;
    color: #444;
  }
  .resumen-row span:first-child { color: var(--gris); font-weight: 300; }
  .resumen-row span:last-child { font-weight: 500; color: var(--verde); }

  .resumen-parcela {
    background: var(--crema);
    border-radius: 6px;
    padding: 10px 12px;
    margin-bottom: 8px;
    font-size: 0.84rem;
  }

  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    background: #e8f4d9;
    color: var(--verde2);
    margin-right: 6px;
    margin-bottom: 4px;
  }

  /* Botones nav */
  .nav-btns {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    max-width: 680px;
    margin: 0 auto;
  }
  .btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 11px 24px;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    transition: all .2s;
  }
  .btn-secondary {
    background: white;
    border: 1.5px solid #ccc;
    color: var(--gris);
  }
  .btn-secondary:hover { border-color: var(--verde2); color: var(--verde); }
  .btn-primary {
    background: var(--verde);
    color: white;
  }
  .btn-primary:hover { background: var(--verde2); }
  .btn-export {
    background: var(--tierra);
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .btn-export:hover { background: #b07828; }

  /* Success */
  .success-wrap {
    text-align: center;
    padding: 20px;
  }
  .success-icon {
    font-size: 3rem;
    margin-bottom: 16px;
  }
  .success-wrap h2 {
    font-family: 'Fraunces', serif;
    font-size: 1.5rem;
    color: var(--verde);
    margin-bottom: 8px;
  }
  .success-wrap p {
    color: var(--gris);
    font-size: 0.9rem;
    font-weight: 300;
    margin-bottom: 24px;
  }

  /* PDF preview area (hidden, used for print) */
  @media print {
    .pac-wrap > *:not(.pdf-preview) { display: none; }
    .pdf-preview { display: block !important; }
  }
`;

// ─── Datos estáticos ─────────────────────────────────────────────────────────
const AYUDAS = [
  { id: "pago_basico", title: "Pago básico por superficie", desc: "Ayuda directa desvinculada por hectárea elegible declarada." },
  { id: "pago_verde", title: "Pago verde (Eco-esquemas)", desc: "Prácticas beneficiosas para el clima y el medio ambiente." },
  { id: "olivar_singular", title: "Ayuda olivar singular", desc: "Para olivares en pendiente o con baja densidad de plantación." },
  { id: "joven_agricultor", title: "Complemento joven agricultor", desc: "Para titulares menores de 41 años con primera instalación." },
  { id: "pequenio_agricultor", title: "Régimen pequeño agricultor", desc: "Para explotaciones que perciben menos de 1.250 € anuales." },
];

const PROVINCIAS = [
  "Jaén","Córdoba","Granada","Sevilla","Málaga","Almería","Huelva","Cádiz",
  "Toledo","Ciudad Real","Albacete","Cuenca","Badajoz","Cáceres","Lleida",
  "Tarragona","Zaragoza","Teruel","Huesca","Otras"
];

const STEP_LABELS = ["Titular", "Parcelas", "Ayudas", "Revisión"];

const emptyParcela = () => ({
  id: Date.now() + Math.random(),
  provincia: "", municipio: "", poligono: "", parcela: "", recinto: "",
  superficie: "", cultivo: "Olivar", variedad: ""
});

// ─── Validadores ─────────────────────────────────────────────────────────────
function validateTitular(d) {
  const e = {};
  if (!d.nombre?.trim()) e.nombre = "Obligatorio";
  if (!/^\d{8}[A-Z]$/.test(d.nif?.trim().toUpperCase())) e.nif = "NIF inválido (ej: 12345678A)";
  if (!d.telefono?.trim()) e.telefono = "Obligatorio";
  if (!d.municipio?.trim()) e.municipio = "Obligatorio";
  if (!d.provincia) e.provincia = "Selecciona una provincia";
  if (!d.num_explotacion?.trim()) e.num_explotacion = "Obligatorio";
  return e;
}
function validateParcelas(parcelas) {
  return parcelas.map(p => {
    const e = {};
    if (!p.poligono.trim()) e.poligono = "Obligatorio";
    if (!p.parcela.trim()) e.parcela = "Obligatorio";
    if (!p.recinto.trim()) e.recinto = "Obligatorio";
    if (!p.superficie || isNaN(p.superficie) || +p.superficie <= 0) e.superficie = "Superficie inválida";
    if (!p.provincia) e.provincia = "Selecciona provincia";
    if (!p.municipio.trim()) e.municipio = "Obligatorio";
    return e;
  });
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function GeneradorPAC() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [titular, setTitular] = useState({
    nombre: "", nif: "", telefono: "", email: "",
    municipio: "", provincia: "", cp: "", num_explotacion: "",
    banco_iban: ""
  });
  const [errTitular, setErrTitular] = useState({});

  const [parcelas, setParcelas] = useState([emptyParcela()]);
  const [errParcelas, setErrParcelas] = useState([{}]);

  const [ayudas, setAyudas] = useState(["pago_basico", "pago_verde"]);
  const [errAyudas, setErrAyudas] = useState("");

  const pdfRef = useRef();

  // ── Titular handlers ──
  const setT = (k, v) => {
    setTitular(t => ({ ...t, [k]: v }));
    if (errTitular[k]) setErrTitular(e => { const n = {...e}; delete n[k]; return n; });
  };

  // ── Parcela handlers ──
  const setP = (i, k, v) => {
    setParcelas(ps => ps.map((p, idx) => idx === i ? { ...p, [k]: v } : p));
    setErrParcelas(es => es.map((e, idx) => {
      if (idx !== i) return e;
      const n = {...e}; delete n[k]; return n;
    }));
  };
  const addParcela = () => {
    setParcelas(ps => [...ps, emptyParcela()]);
    setErrParcelas(es => [...es, {}]);
  };
  const removeParcela = i => {
    if (parcelas.length === 1) return;
    setParcelas(ps => ps.filter((_, idx) => idx !== i));
    setErrParcelas(es => es.filter((_, idx) => idx !== i));
  };

  // ── Ayuda handlers ──
  const toggleAyuda = id => {
    setAyudas(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
    setErrAyudas("");
  };

  // ── Navegación ──
  const goNext = () => {
    if (step === 0) {
      const e = validateTitular(titular);
      if (Object.keys(e).length) { setErrTitular(e); return; }
    }
    if (step === 1) {
      const es = validateParcelas(parcelas);
      if (es.some(e => Object.keys(e).length)) { setErrParcelas(es); return; }
    }
    if (step === 2) {
      if (ayudas.length === 0) { setErrAyudas("Selecciona al menos una ayuda"); return; }
    }
    if (step === 3) { setDone(true); return; }
    setStep(s => s + 1);
  };
  const goBack = () => setStep(s => s - 1);

  // ── Exportar PDF ──
  const exportarPDF = () => {
    const fecha = new Date().toLocaleDateString("es-ES");
    const superficieTotal = parcelas.reduce((s, p) => s + (parseFloat(p.superficie) || 0), 0).toFixed(2);
    const ayudasNombres = ayudas.map(id => AYUDAS.find(a => a.id === id)?.title).filter(Boolean);

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>Solicitud PAC - ${titular.nombre}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11px; color: #111; max-width: 800px; margin: 0 auto; padding: 20px; }
  .header-logo { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2D5016; padding-bottom: 10px; margin-bottom: 16px; }
  .org h2 { font-size: 13px; color: #2D5016; margin: 0 0 2px; }
  .org p { font-size: 10px; color: #666; margin: 0; }
  .doc-ref { text-align: right; font-size: 10px; color: #666; }
  .doc-ref strong { font-size: 12px; color: #2D5016; display: block; }
  h1 { text-align: center; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2D5016; border: 2px solid #2D5016; padding: 8px; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th { background: #2D5016; color: white; padding: 5px 8px; text-align: left; font-size: 10px; }
  td { border: 1px solid #ccc; padding: 5px 8px; font-size: 10px; }
  tr:nth-child(even) td { background: #f5f5f5; }
  .section-title { background: #e8f4d9; color: #2D5016; font-weight: bold; padding: 4px 8px; margin: 12px 0 6px; border-left: 3px solid #2D5016; font-size: 11px; }
  .firma { margin-top: 40px; display: flex; justify-content: space-between; }
  .firma-box { text-align: center; width: 45%; border-top: 1px solid #999; padding-top: 4px; font-size: 10px; color: #666; }
  .aviso { background: #fffbe6; border: 1px solid #e6cc00; padding: 6px 10px; font-size: 9px; color: #555; margin-bottom: 16px; }
  .badge { background: #e8f4d9; color: #2D5016; padding: 2px 8px; border-radius: 10px; font-size: 9px; margin-right: 4px; }
  @media print { body { padding: 10px; } }
</style>
</head>
<body>
<div class="header-logo">
  <div class="org">
    <h2>MINISTERIO DE AGRICULTURA, PESCA Y ALIMENTACIÓN</h2>
    <p>Fondo Español de Garantía Agraria (FEGA)</p>
    <p>Solicitud única de ayudas — Campaña ${new Date().getFullYear()}</p>
  </div>
  <div class="doc-ref">
    <strong>SOLICITUD ÚNICA PAC</strong>
    <span>Ref: PAC-${new Date().getFullYear()}-${titular.nif?.replace(/\D/g,"").slice(0,6)}</span><br/>
    <span>Fecha: ${fecha}</span>
  </div>
</div>

<h1>Solicitud Única de Ayudas Directas PAC — Campaña ${new Date().getFullYear()}</h1>

<div class="aviso">⚠ Este documento es un pre-formulario generado por la aplicación. Debe ser revisado y presentado oficialmente a través del sistema SIGPAC de su comunidad autónoma o en la oficina comarcal agraria correspondiente.</div>

<div class="section-title">1. DATOS DEL TITULAR / SOLICITANTE</div>
<table>
  <tr><td><strong>Nombre completo</strong></td><td>${titular.nombre}</td><td><strong>NIF/NIE</strong></td><td>${titular.nif?.toUpperCase()}</td></tr>
  <tr><td><strong>Teléfono</strong></td><td>${titular.telefono}</td><td><strong>Email</strong></td><td>${titular.email || "—"}</td></tr>
  <tr><td><strong>Municipio</strong></td><td>${titular.municipio}</td><td><strong>Provincia</strong></td><td>${titular.provincia}</td></tr>
  <tr><td><strong>Código postal</strong></td><td>${titular.cp || "—"}</td><td><strong>N.º explotación (REGA)</strong></td><td>${titular.num_explotacion}</td></tr>
  ${titular.banco_iban ? `<tr><td><strong>IBAN cuenta bancaria</strong></td><td colspan="3">${titular.banco_iban}</td></tr>` : ""}
</table>

<div class="section-title">2. RELACIÓN DE PARCELAS DECLARADAS</div>
<table>
  <tr>
    <th>Provincia</th><th>Municipio</th><th>Polígono</th><th>Parcela</th><th>Recinto</th>
    <th>Cultivo</th><th>Variedad</th><th>Superficie (ha)</th>
  </tr>
  ${parcelas.map(p => `
  <tr>
    <td>${p.provincia}</td><td>${p.municipio}</td><td>${p.poligono}</td><td>${p.parcela}</td>
    <td>${p.recinto}</td><td>${p.cultivo}</td><td>${p.variedad || "—"}</td>
    <td style="text-align:right">${parseFloat(p.superficie).toFixed(4)}</td>
  </tr>`).join("")}
  <tr style="font-weight:bold;background:#e8f4d9">
    <td colspan="7">SUPERFICIE TOTAL DECLARADA</td>
    <td style="text-align:right">${superficieTotal} ha</td>
  </tr>
</table>

<div class="section-title">3. AYUDAS SOLICITADAS</div>
<p style="padding: 6px 0">${ayudasNombres.map(n => `<span class="badge">${n}</span>`).join(" ")}</p>

<div class="section-title">4. DECLARACIÓN RESPONSABLE</div>
<p style="font-size:10px; line-height:1.6; margin-bottom:10px">
El solicitante declara bajo su responsabilidad que los datos consignados en este formulario son verídicos, 
que cumple los requisitos establecidos en la normativa vigente para la concesión de las ayudas solicitadas, 
y que las superficies declaradas se encuentran a su disposición en la fecha de presentación. 
Asimismo, autoriza a la Administración a verificar los datos declarados mediante los sistemas de teledetección y control SIGPAC.
</p>

<div class="firma">
  <div class="firma-box">
    <p>Firma del titular / representante</p>
    <p>${titular.nombre}</p>
    <p>D.N.I.: ${titular.nif?.toUpperCase()}</p>
  </div>
  <div class="firma-box">
    <p>Sello y firma de la oficina comarcal</p>
    <p>Fecha de presentación: ___/___/_____</p>
    <p>N.º registro entrada: ________________</p>
  </div>
</div>

<p style="margin-top:40px; font-size:9px; color:#999; text-align:center; border-top:1px solid #eee; padding-top:8px">
  Generado por OlivarApp · Protección de datos: RGPD (UE) 2016/679 · Los datos serán usados exclusivamente para la tramitación de ayudas agrícolas.
</p>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => { win.print(); };
    }
  };

  // ─── Renders por paso ─────────────────────────────────────────────────────

  const StepTitular = () => (
    <div className="card">
      <div className="card-title">Datos del titular</div>
      <div className="card-sub">Información personal y de la explotación agrícola</div>
      <div className="form-grid">
        <div className="field full">
          <label>Nombre y apellidos *</label>
          <input value={titular.nombre} onChange={e => setT("nombre", e.target.value)}
            placeholder="Juan García López" className={errTitular.nombre ? "err" : ""} />
          {errTitular.nombre && <span className="err-msg">{errTitular.nombre}</span>}
        </div>
        <div className="field">
          <label>NIF / NIE *</label>
          <input value={titular.nif} onChange={e => setT("nif", e.target.value.toUpperCase())}
            placeholder="12345678A" maxLength={9} className={errTitular.nif ? "err" : ""} />
          {errTitular.nif && <span className="err-msg">{errTitular.nif}</span>}
        </div>
        <div className="field">
          <label>Teléfono *</label>
          <input value={titular.telefono} onChange={e => setT("telefono", e.target.value)}
            placeholder="600 000 000" className={errTitular.telefono ? "err" : ""} />
          {errTitular.telefono && <span className="err-msg">{errTitular.telefono}</span>}
        </div>
        <div className="field full">
          <label>Correo electrónico</label>
          <input type="email" value={titular.email} onChange={e => setT("email", e.target.value)}
            placeholder="agricultor@ejemplo.com" />
        </div>
        <div className="field">
          <label>Municipio *</label>
          <input value={titular.municipio} onChange={e => setT("municipio", e.target.value)}
            placeholder="Nombre del municipio" className={errTitular.municipio ? "err" : ""} />
          {errTitular.municipio && <span className="err-msg">{errTitular.municipio}</span>}
        </div>
        <div className="field">
          <label>Provincia *</label>
          <select value={titular.provincia} onChange={e => setT("provincia", e.target.value)}
            className={errTitular.provincia ? "err" : ""}>
            <option value="">— Selecciona —</option>
            {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {errTitular.provincia && <span className="err-msg">{errTitular.provincia}</span>}
        </div>
        <div className="field">
          <label>Código postal</label>
          <input value={titular.cp} onChange={e => setT("cp", e.target.value)}
            placeholder="23000" maxLength={5} />
        </div>
        <div className="field">
          <label>N.º explotación (REGA) *</label>
          <input value={titular.num_explotacion} onChange={e => setT("num_explotacion", e.target.value)}
            placeholder="ES190123456789" className={errTitular.num_explotacion ? "err" : ""} />
          {errTitular.num_explotacion && <span className="err-msg">{errTitular.num_explotacion}</span>}
        </div>
        <div className="field full">
          <label>IBAN cuenta bancaria</label>
          <input value={titular.banco_iban} onChange={e => setT("banco_iban", e.target.value.toUpperCase())}
            placeholder="ES00 0000 0000 0000 0000 0000" />
        </div>
      </div>
    </div>
  );

  const StepParcelas = () => (
    <div className="card">
      <div className="card-title">Parcelas declaradas</div>
      <div className="card-sub">Referencia SIGPAC de cada parcela de olivar</div>
      {parcelas.map((p, i) => (
        <div key={p.id} className="parcela-card">
          <div className="parcela-header">
            <span className="parcela-num">Parcela {i + 1}</span>
            {parcelas.length > 1 && (
              <button className="btn-remove" onClick={() => removeParcela(i)} title="Eliminar parcela">✕</button>
            )}
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Provincia *</label>
              <select value={p.provincia} onChange={e => setP(i, "provincia", e.target.value)}
                className={errParcelas[i]?.provincia ? "err" : ""}>
                <option value="">— Selecciona —</option>
                {PROVINCIAS.map(pr => <option key={pr} value={pr}>{pr}</option>)}
              </select>
              {errParcelas[i]?.provincia && <span className="err-msg">{errParcelas[i].provincia}</span>}
            </div>
            <div className="field">
              <label>Municipio *</label>
              <input value={p.municipio} onChange={e => setP(i, "municipio", e.target.value)}
                placeholder="Nombre municipio" className={errParcelas[i]?.municipio ? "err" : ""} />
              {errParcelas[i]?.municipio && <span className="err-msg">{errParcelas[i].municipio}</span>}
            </div>
            <div className="field">
              <label>Polígono *</label>
              <input value={p.poligono} onChange={e => setP(i, "poligono", e.target.value)}
                placeholder="ej: 15" className={errParcelas[i]?.poligono ? "err" : ""} />
              {errParcelas[i]?.poligono && <span className="err-msg">{errParcelas[i].poligono}</span>}
            </div>
            <div className="field">
              <label>Parcela *</label>
              <input value={p.parcela} onChange={e => setP(i, "parcela", e.target.value)}
                placeholder="ej: 42" className={errParcelas[i]?.parcela ? "err" : ""} />
              {errParcelas[i]?.parcela && <span className="err-msg">{errParcelas[i].parcela}</span>}
            </div>
            <div className="field">
              <label>Recinto *</label>
              <input value={p.recinto} onChange={e => setP(i, "recinto", e.target.value)}
                placeholder="ej: 1" className={errParcelas[i]?.recinto ? "err" : ""} />
              {errParcelas[i]?.recinto && <span className="err-msg">{errParcelas[i].recinto}</span>}
            </div>
            <div className="field">
              <label>Superficie (ha) *</label>
              <input type="number" step="0.0001" min="0" value={p.superficie}
                onChange={e => setP(i, "superficie", e.target.value)}
                placeholder="ej: 3.5000" className={errParcelas[i]?.superficie ? "err" : ""} />
              {errParcelas[i]?.superficie && <span className="err-msg">{errParcelas[i].superficie}</span>}
            </div>
            <div className="field">
              <label>Cultivo</label>
              <select value={p.cultivo} onChange={e => setP(i, "cultivo", e.target.value)}>
                <option>Olivar</option>
                <option>Olivar en pendiente</option>
                <option>Olivar ecológico</option>
                <option>Olivar singular</option>
              </select>
            </div>
            <div className="field">
              <label>Variedad</label>
              <input value={p.variedad} onChange={e => setP(i, "variedad", e.target.value)}
                placeholder="Picual, Arbequina…" />
            </div>
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={addParcela}>+ Añadir otra parcela</button>
    </div>
  );

  const StepAyudas = () => (
    <div className="card">
      <div className="card-title">Ayudas a solicitar</div>
      <div className="card-sub">Selecciona todas las ayudas que correspondan a tu explotación</div>
      {AYUDAS.map(a => (
        <label key={a.id} className={`ayuda-item ${ayudas.includes(a.id) ? "selected" : ""}`}>
          <input type="checkbox" checked={ayudas.includes(a.id)} onChange={() => toggleAyuda(a.id)} />
          <div>
            <div className="ayuda-title">{a.title}</div>
            <div className="ayuda-desc">{a.desc}</div>
          </div>
        </label>
      ))}
      {errAyudas && <span className="err-msg" style={{marginTop:8, display:"block"}}>{errAyudas}</span>}
    </div>
  );

  const StepResumen = () => {
    const superficieTotal = parcelas.reduce((s, p) => s + (parseFloat(p.superficie) || 0), 0).toFixed(2);
    return (
      <div className="card">
        <div className="card-title">Revisión de la solicitud</div>
        <div className="card-sub">Comprueba los datos antes de exportar el documento</div>

        <div className="resumen-section">
          <div className="resumen-label">Titular</div>
          <div className="resumen-row"><span>Nombre</span><span>{titular.nombre}</span></div>
          <div className="resumen-row"><span>NIF</span><span>{titular.nif?.toUpperCase()}</span></div>
          <div className="resumen-row"><span>Municipio</span><span>{titular.municipio}, {titular.provincia}</span></div>
          <div className="resumen-row"><span>N.º explotación</span><span>{titular.num_explotacion}</span></div>
        </div>

        <div className="resumen-section">
          <div className="resumen-label">Parcelas ({parcelas.length}) — {superficieTotal} ha total</div>
          {parcelas.map((p, i) => (
            <div key={p.id} className="resumen-parcela">
              <strong>Parcela {i+1}:</strong> Pol. {p.poligono} / Par. {p.parcela} / Rec. {p.recinto} —&nbsp;
              {p.municipio} ({p.provincia}) — <strong>{parseFloat(p.superficie).toFixed(4)} ha</strong> — {p.cultivo}
              {p.variedad && ` (${p.variedad})`}
            </div>
          ))}
        </div>

        <div className="resumen-section">
          <div className="resumen-label">Ayudas solicitadas</div>
          <div style={{paddingTop:6}}>
            {ayudas.map(id => {
              const a = AYUDAS.find(x => x.id === id);
              return a ? <span key={id} className="badge">{a.title}</span> : null;
            })}
          </div>
        </div>
      </div>
    );
  };

  // ─── Done ─────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <>
        <style>{CSS}</style>
        <div className="pac-wrap">
          <div className="pac-header">
            <h1>Solicitud <em>PAC</em></h1>
          </div>
          <div className="card">
            <div className="success-wrap">
              <div className="success-icon">🫒</div>
              <h2>¡Solicitud lista para exportar!</h2>
              <p>Haz clic en el botón para generar el documento PDF.<br/>
              Imprímelo y preséntalo en tu oficina comarcal agraria o súbelo al sistema SIGPAC de tu comunidad autónoma.</p>
              <div style={{display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap"}}>
                <button className="btn btn-export" onClick={exportarPDF}>
                  📄 Exportar / Imprimir documento
                </button>
                <button className="btn btn-secondary" onClick={() => { setStep(0); setDone(false); }}>
                  Nueva solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── Render principal ─────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div className="pac-wrap">
        <div className="pac-header">
          <h1>Generador solicitud <em>PAC</em></h1>
          <p>Rellena los datos y exporta el formulario oficial — sin gestoría</p>
        </div>

        {/* Stepper */}
        <div className="stepper">
          {STEP_LABELS.map((label, i) => (
            <>
              <div key={i} className="step-item">
                <div className={`step-circle ${i === step ? "active" : i < step ? "done" : ""}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`step-label ${i === step ? "active" : ""}`}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div key={`line-${i}`} className={`step-line ${i < step ? "done" : ""}`} />
              )}
            </>
          ))}
        </div>

        {/* Contenido del paso */}
        {step === 0 && <StepTitular />}
        {step === 1 && <StepParcelas />}
        {step === 2 && <StepAyudas />}
        {step === 3 && <StepResumen />}

        {/* Navegación */}
        <div className="nav-btns">
          {step > 0 && (
            <button className="btn btn-secondary" onClick={goBack}>← Anterior</button>
          )}
          <button className="btn btn-primary" onClick={goNext}>
            {step === 3 ? "✓ Confirmar y exportar" : "Siguiente →"}
          </button>
        </div>
      </div>
    </>
  );
}
