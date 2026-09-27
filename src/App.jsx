import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, AlertCircle, FileText, Send, Award, 
  HelpCircle, ChevronRight, UserCheck, ShieldCheck, Download,
  ExternalLink, Sparkles, MessageCircle, Star, Phone, Mail, Building,
  Lock, LogOut, KeyRound, RefreshCw, Eye, Search, MapPin, Save, User, Calendar
} from 'lucide-react';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwTqdEZ3S1gyD2PbVYqpXJC7d9WElGletaN3ld8KGZFq2w0mr9qa6vSiab8_1lS18kFJQ/exec";
const ANALYST_SECRET_PIN = "sensa2026";

export default function App() {
  const [activeTab, setActiveTab] = useState('candidate');
  const [step, setStep] = useState(1);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Seguridad y datos del Analista
  const [isAnalystAuth, setIsAnalystAuth] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [accessPassword, setAccessPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  
  // Lista de postulantes
  const [candidatesList, setCandidatesList] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Formulario de Evaluación en Meet (por el analista)
  const [evaluatorName, setEvaluatorName] = useState('');
  const [evalDate, setEvalDate] = useState('');
  const [star1, setStar1] = useState('★★★★★ (Excelente)');
  const [star2, setStar2] = useState('★★★★★ (Excelente)');
  const [star3, setStar3] = useState('★★★★★ (Excelente)');
  const [star4, setStar4] = useState('★★★★★ (Excelente)');
  const [dictamen, setDictamen] = useState('Aprobado para Terna');
  const [executiveNotes, setExecutiveNotes] = useState('');
  const [isSavingEval, setIsSavingEval] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Inicializar fecha y hora actual para el analista
  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }) + 
                      ' ' + now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    setEvalDate(formatted);
  }, [selectedCandidate]);

  // Form State del Postulante
  const [formData, setFormData] = useState({
    fullName: '',
    dni: '',
    phone: '',
    email: '',
    district: '',
    address: '',
    position: 'Asesores de Ventas / Teleoperadores',
    hasChildren: 'No',
    childrenCount: '0',
    healthAdaptation: '',
    shortcutsScore: 0,
    psychometricScore: 0,
    psychologicalScore: 0,
    cvBase64: '',
    dniBase64: '',
    certijovenBase64: '',
    hijosBase64: ''
  });

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Atajos de Teclado
  const [shortcutsAnswers, setShortcutsAnswers] = useState({});
  const shortcutsQuestions = [
    { id: 's1', q: '¿Qué atajo de teclado se utiliza para COPIAR un texto o elemento?', options: ['A) Ctrl + V', 'B) Ctrl + C', 'C) Ctrl + X', 'D) Ctrl + Z'], correct: 1 },
    { id: 's2', q: '¿Qué combinación de teclas permite PEGAR información copiada?', options: ['A) Ctrl + P', 'B) Ctrl + C', 'C) Alt + V', 'D) Ctrl + V'], correct: 3 },
    { id: 's3', q: '¿Cuál es el comando estándar para DESHACER la última acción realizada?', options: ['A) Ctrl + Z', 'B) Ctrl + Y', 'C) Ctrl + D', 'D) Ctrl + Backspace'], correct: 0 },
    { id: 's4', q: '¿Qué combinación permite alternar o cambiar rápidamente entre ventanas abiertas en Windows?', options: ['A) Ctrl + Tab', 'B) Windows + L', 'C) Alt + Tab', 'D) Shift + Tab'], correct: 2 },
    { id: 's5', q: 'Para BUSCAR una palabra clave o dato dentro de una página web, documento o PDF:', options: ['A) Ctrl + B', 'B) Ctrl + S', 'C) Ctrl + F', 'D) Ctrl + H'], correct: 2 },
    { id: 's6', q: '¿Qué comando selecciona TODO el texto o todos los elementos de un documento/carpeta?', options: ['A) Ctrl + T', 'B) Ctrl + E (o Ctrl + A en inglés)', 'C) Shift + Flecha Abajo', 'D) Alt + A'], correct: 1 },
    { id: 's7', q: '¿Cómo puedes MINIMIZAR todas las ventanas abiertas al instante y mostrar el escritorio?', options: ['A) Windows + D', 'B) Ctrl + M', 'C) Alt + F4', 'D) Windows + Esc'], correct: 0 },
    { id: 's8', q: 'Para ABRIR el Administrador de Tareas directamente si un programa se congela:', options: ['A) Alt + Tab + Del', 'B) Ctrl + Alt + F4', 'C) Windows + R', 'D) Ctrl + Shift + Esc'], correct: 3 },
    { id: 's9', q: 'Para CERRAR la pestaña activa del navegador sin cerrar todo el programa:', options: ['A) Ctrl + Q', 'B) Ctrl + W', 'C) Alt + W', 'D) Ctrl + Shift + W'], correct: 1 },
    { id: 's10', q: '¿Qué tecla se presiona en el teclado para ACTUALIZAR o recargar una página web?', options: ['A) F2', 'B) F11', 'C) F5', 'D) F8'], correct: 2 }
  ];

  // Lógica y Razonamiento
  const [logicAnswers, setLogicAnswers] = useState({});
  const logicQuestions = [
    { id: 'l1', q: 'Si una empresa proyecta un presupuesto de S/ 8,000 y se reduce un 15%, ¿cuánto presupuesto queda disponible?', options: ['A) S/ 6,500', 'B) S/ 6,800', 'C) S/ 7,200', 'D) S/ 7,000'], correct: 1 },
    { id: 'l2', q: 'Si 4 analistas completan 20 revisiones en 2 horas, ¿cuántas revisiones completarán 8 analistas con el mismo ritmo en 2 horas?', options: ['A) 30', 'B) 50', 'C) 20', 'D) 40'], correct: 3 },
    { id: 'l3', q: 'Continúa la serie numérica: 3, 6, 12, 24, 48, ...', options: ['A) 96', 'B) 72', 'C) 84', 'D) 108'], correct: 0 },
    { id: 'l4', q: 'Si todos los supervisores son puntuales y Carlos no es puntual, podemos deducir que:', options: ['A) Carlos es supervisor suplente', 'B) Carlos trabaja horas extras', 'C) Carlos no es supervisor', 'D) Carlos es formador'], correct: 2 },
    { id: 'l5', q: 'Un equipo recibe 120 solicitudes en el día. Si el 25% requiere atención urgente, ¿cuántas solicitudes NO son urgentes?', options: ['A) 30', 'B) 80', 'C) 90', 'D) 100'], correct: 2 },
    { id: 'l6', q: 'Encuentra la analogía correspondiente: TECLADO es a ESCRIBIR como PANTALLA es a:', options: ['A) Escuchar', 'B) Visualizar', 'C) Conectar', 'D) Procesar'], correct: 1 },
    { id: 'l7', q: 'Si tienes 3 tareas críticas con vencimiento hoy y 2 tareas menores con plazo de 5 días, ¿cuál debe ser tu orden de ejecución?', options: ['A) Resolver primero las tareas con entrega hoy según prioridad de impacto', 'B) Iniciar por las de 5 días porque son más rápidas', 'C) Postergar todas para consultar en la siguiente reunión', 'D) Dividir el tiempo mitad y mitad'], correct: 0 },
    { id: 'l8', q: 'Si el costo unitario de un servicio baja de S/ 200 a S/ 150, ¿cuál es el porcentaje de reducción?', options: ['A) 20%', 'B) 30%', 'C) 33%', 'D) 25%'], correct: 3 },
    { id: 'l9', q: 'Si A es mayor que B, y B es mayor que C, ¿cuál es la afirmación correcta?', options: ['A) C es mayor que A', 'B) A es mayor que C', 'C) B es igual a A', 'D) No es posible saberlo'], correct: 1 },
    { id: 'l10', q: 'Completa la secuencia de letras: B, D, F, H, ...', options: ['A) I', 'B) K', 'C) J', 'D) L'], correct: 2 }
  ];

  // Psicológico / Conductual
  const [psychAnswers, setPsychAnswers] = useState({});
  const psychQuestions = [
    { id: 'p1', q: 'Frente a un día con múltiples imprevistos y cambios de prioridades por parte de gerencia, tu actitud habitual es:', options: ['A) Expresar molestia y exigir que no cambien los planes', 'B) Adaptarte con serenidad, reorganizar tu lista y avanzar por orden de relevancia', 'C) Dejar de trabajar hasta que definan algo fijo', 'D) Cumplir solo lo que te corresponde personalmente'], correct: 1 },
    { id: 'p2', q: 'Si notas que cometiste un error en un reporte que nadie más se ha dado cuenta, ¿qué decides hacer?', options: ['A) Ignorarlo esperando que nadie lo note', 'B) Culpar al sistema informático si alguien pregunta', 'C) Esperar a fin de mes para justificarlo', 'D) Comunicarlo de inmediato a tu superior con la corrección ya elaborada'], correct: 3 },
    { id: 'p3', q: 'Al recibir retroalimentación constructiva sobre aspectos por mejorar en tu rendimiento:', options: ['A) Escuchas con apertura, agradeces la observación y aplicas mejoras concretas', 'B) Te sientes atacado personalmente y guardas silencio', 'C) Buscas justificaciones externas para defenderte', 'D) Desestimas los comentarios de inmediato'], correct: 0 },
    { id: 'p4', q: 'Cuando un compañero de equipo solicita apoyo porque está saturado y tú ya terminaste tus labores:', options: ['A) Te desconectas antes de tiempo', 'B) Le dices que cada quien debe ver sus pendientes', 'C) Te ofreces a colaborar en tareas operativas para lograr el objetivo común', 'D) Avisas a su jefe para que lo sancionen'], correct: 2 },
    { id: 'p5', q: 'Frente a situaciones laborales donde las cosas no salen como las planificaste tras varios intentos:', options: ['A) Abandonas el proyecto y te enfocas en lo fácil', 'B) Te frustras y reduces tu ritmo de trabajo', 'C) Analizas qué factores fallaron, modificas la estrategia y perseveras', 'D) Esperas que otro compañero resuelva el problema'], correct: 2 },
    { id: 'p6', q: 'Si un usuario o cliente se comunica de manera agresiva o descortés, tu conducta profesional es:', options: ['A) Responder con el mismo tono para hacerte respetar', 'B) Mantener la calma, escuchar activamente y orientar la conversación hacia la solución', 'C) Colgar o cortar la comunicación de inmediato sin avisar', 'D) Ignorar sus consultas'], correct: 1 },
    { id: 'p7', q: 'Respecto al cumplimiento de horarios y compromisos laborales en modalidad remota o presencial:', options: ['A) Consideras que la puntualidad rigurosa refleja compromiso, respeto y profesionalismo', 'B) Crees que 15 o 20 minutos tarde no hacen diferencia', 'C) Te conectas a tiempo solo si hay supervisión directa', 'D) La puntualidad es secundaria frente a cualquier excusa'], correct: 0 },
    { id: 'p8', q: 'Cuando cumples tu meta u objetivo asignado antes de finalizar el plazo previsto:', options: ['A) Detienes tu producción para que no aumenten tus metas', 'B) Tomas tiempo libre sin reportarlo', 'C) Te quejas de que la meta era muy simple', 'D) Buscas superar el objetivo establecido o coordinas nuevas metas con tu líder'], correct: 3 },
    { id: 'p9', q: 'Si surge una discrepancia de opinión con un compañero de tu área de trabajo:', options: ['A) Generas comentarios con otros colegas sobre el problema', 'B) Conversas directamente y de forma respetuosa con él para buscar un acuerdo', 'C) Evitas hablarle en adelante', 'D) Llevas el caso a recursos humanos sin haber dialogado antes'], correct: 1 },
    { id: 'p10', q: '¿Qué describe mejor tu motivación principal en el ámbito laboral?', options: ['A) Trabajar únicamente el mínimo indispensable para no ser despedido', 'B) Buscar la salida más rápida de cada tarea', 'C) Crecer profesionalmente mediante el mérito, la superación continua y el aporte de valor', 'D) Evitar asumir cualquier tipo de responsabilidad'], correct: 2 }
  ];

  const calculateScores = () => {
    let sScore = 0;
    shortcutsQuestions.forEach(q => {
      if (shortcutsAnswers[q.id] === q.correct) sScore += 10;
    });

    let lScore = 0;
    logicQuestions.forEach(q => {
      if (logicAnswers[q.id] === q.correct) lScore += 10;
    });

    let pScore = 0;
    psychQuestions.forEach(q => {
      if (psychAnswers[q.id] === q.correct) pScore += 10;
    });

    return { sScore, lScore, pScore };
  };

  const handleNextStep = () => {
    if (step === 1 && !gdprAccepted) {
      alert('Debe aceptar la Cláusula de Tratamiento de Datos Personales para continuar.');
      return;
    }
    if (step === 1 && (!formData.fullName || !formData.dni || !formData.phone || !formData.district || !formData.address)) {
      alert('Por favor complete todos los datos obligatorios del Paso 1, incluyendo su distrito y dirección.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleFinishAssessment = async () => {
    setIsSubmitting(true);
    const { sScore, lScore, pScore } = calculateScores();
    const finalData = {
      ...formData,
      shortcutsScore: sScore,
      psychometricScore: lScore,
      psychologicalScore: pScore
    };
    setFormData(finalData);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
    } catch (err) {
      console.error("Error al enviar:", err);
    } finally {
      setIsSubmitting(false);
      setStep(6);
    }
  };

  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const res = await fetch(SCRIPT_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCandidatesList(data.reverse());
      }
    } catch (err) {
      console.error("Error al cargar postulantes:", err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    if (isAnalystAuth && activeTab === 'interviewer') {
      fetchCandidates();
    }
  }, [isAnalystAuth, activeTab]);

  const handleAnalystTabClick = () => {
    if (isAnalystAuth) {
      setActiveTab('interviewer');
    } else {
      setShowAuthModal(true);
      setAuthError(false);
      setAccessPassword('');
    }
  };

  const handleVerifyPassword = (e) => {
    e.preventDefault();
    if (accessPassword === ANALYST_SECRET_PIN) {
      setIsAnalystAuth(true);
      setShowAuthModal(false);
      setActiveTab('interviewer');
    } else {
      setAuthError(true);
    }
  };

  const handleLogoutAnalyst = () => {
    setIsAnalystAuth(false);
    setActiveTab('candidate');
    setSelectedCandidate(null);
  };

  // Guardar Evaluación del Analista en Google Sheets
  const handleSaveEvaluation = async () => {
    if (!evaluatorName.trim()) {
      alert("Por favor ingresa tu Nombre y Apellido de Analista antes de guardar.");
      return;
    }

    setIsSavingEval(true);
    setSaveSuccessMsg('');

    const evaluationPayload = {
      action: "save_evaluation",
      dni: selectedCandidate.dni,
      evaluatorName,
      evalDate,
      starScore1: star1,
      starScore2: star2,
      starScore3: star3,
      starScore4: star4,
      dictamen,
      executiveNotes
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluationPayload)
      });

      setSaveSuccessMsg('✓ ¡Evaluación guardada exitosamente en la base de datos de Google Drive / Sheets!');
      fetchCandidates();
    } catch (err) {
      console.error("Error al guardar evaluación:", err);
      alert("Hubo un error al guardar la evaluación. Intente nuevamente.");
    } finally {
      setIsSavingEval(false);
    }
  };

  const filteredCandidates = candidatesList.filter(c => 
    (c && c.fullName && c.fullName.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c && c.dni && c.dni.toString().includes(searchTerm)) ||
    (c && c.district && c.district.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c && c.position && c.position.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-[#0F1A14] font-sans pb-16">
      {/* Encabezado */}
      <header className="bg-white border-b border-[#E5E0D0] sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#1B3326] flex items-center justify-center text-[#C29F62] font-bold text-xl shadow">
              S
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wider text-[#1B3326] uppercase">SENSA PEOPLE</h1>
              <p className="text-[11px] text-[#C29F62] tracking-widest font-semibold uppercase">Talento con Sentido</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('candidate')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                activeTab === 'candidate' 
                  ? 'bg-[#1B3326] text-white shadow' 
                  : 'bg-white border border-[#1B3326]/20 text-[#1B3326] hover:bg-[#F7F5EE]'
              }`}
            >
              Portal del Postulante
            </button>
            <button
              onClick={handleAnalystTabClick}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition flex items-center space-x-1.5 ${
                activeTab === 'interviewer' 
                  ? 'bg-[#C29F62] text-white shadow' 
                  : 'bg-white border border-[#C29F62]/30 text-[#0F1A14] hover:bg-[#F7F5EE]'
              }`}
            >
              {isAnalystAuth ? <UserCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-gray-500" />}
              <span>Panel de Analista (Meet)</span>
            </button>

            {isAnalystAuth && (
              <button
                onClick={handleLogoutAnalyst}
                title="Cerrar sesión de analista"
                className="p-2 rounded-full text-xs text-red-600 bg-red-50 hover:bg-red-100 transition border border-red-200"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Contraseña */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200">
            <div className="w-12 h-12 rounded-full bg-[#1B3326]/10 text-[#1B3326] flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-center text-lg font-bold text-[#1B3326]">Acceso de Analista</h3>
            <p className="text-center text-xs text-gray-500 mt-1 mb-4">
              Área restringida para el equipo de selección de Sensa People. Ingresa tu clave para continuar.
            </p>

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Contraseña institucional"
                  value={accessPassword}
                  onChange={(e) => {
                    setAccessPassword(e.target.value);
                    if (authError) setAuthError(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#1B3326] focus:outline-none"
                />
                {authError && (
                  <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Clave incorrecta. Acceso denegado.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="w-1/2 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-semibold text-white bg-[#1B3326] rounded-lg hover:bg-[#14261C] transition"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contenedor Principal */}
      <main className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* POSTULANTE */}
        {activeTab === 'candidate' && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E0D0] p-6 sm:p-8">
            
            {step <= 5 && (
              <div className="mb-8">
                <div className="flex justify-between items-center text-xs font-bold text-[#1B3326]/60 mb-2">
                  <span>Paso {step} de 5</span>
                  <span className="text-[#C29F62]">
                    {step === 1 && 'Datos, Ubicación & Consentimiento'}
                    {step === 2 && 'Prueba 1: Atajos y PC'}
                    {step === 3 && 'Prueba 2: Lógica & Aptitud'}
                    {step === 4 && 'Prueba 3: Perfil Conductual'}
                    {step === 5 && 'Expediente & Documentos'}
                  </span>
                </div>
                <div className="w-full bg-[#E5E0D0] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#1B3326] h-full transition-all duration-300"
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* PASO 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1B3326]">Ficha de Registro y Postulación</h2>
                  <p className="text-sm text-gray-500">Completa tus datos personales y de residencia para formalizar tu expediente de evaluación.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Nombre Completo *</label>
                    <input 
                      type="text" 
                      placeholder="Nombres y Apellidos"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">DNI / Documento de Identidad *</label>
                    <input 
                      type="text" 
                      placeholder="8 dígitos de DNI o CE"
                      value={formData.dni}
                      onChange={(e) => setFormData({...formData, dni: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">WhatsApp / Celular de Contacto *</label>
                    <input 
                      type="text" 
                      placeholder="+51 9XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Correo Electrónico *</label>
                    <input 
                      type="email" 
                      placeholder="tu.correo@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1B3326] mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C29F62]" /> Distrito / Ciudad de Residencia *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej. Miraflores, San Juan de Lurigancho, Trujillo"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1B3326] mb-1">
                      Dirección Exacta o Referencia *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej. Av. Larco 450 Dpto 301 / Altura cruce Benavides"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Puesto al que Postula</label>
                    <select 
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm bg-white"
                    >
                      <option>Asesores de Ventas / Teleoperadores</option>
                      <option>Supervisores de Ventas / Team Leaders</option>
                      <option>Formadores / Capacitadores</option>
                      <option>Mandos Medios / Administrativos</option>
                      <option>Otros perfiles especializados</option>
                    </select>
                  </div>
                </div>

                <div className="bg-[#F7F5EE] p-4 rounded-xl border border-[#E5E0D0] space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1B3326] mb-1">
                        ¿Tiene hijos menores a 18 años de edad? *
                      </label>
                      <select 
                        value={formData.hasChildren}
                        onChange={(e) => setFormData({...formData, hasChildren: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
                      >
                        <option value="No">No</option>
                        <option value="Sí">Sí</option>
                      </select>
                    </div>

                    {formData.hasChildren === 'Sí' && (
                      <div>
                        <label className="block text-xs font-bold text-[#1B3326] mb-1">
                          ¿Cuántos hijos menores a 18 años tiene?
                        </label>
                        <input 
                          type="number" 
                          min="1"
                          placeholder="Ej. 1, 2"
                          value={formData.childrenCount}
                          onChange={(e) => setFormData({...formData, childrenCount: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B3326] mb-1">
                      ¿Requiere alguna condición ergonómica o adaptación de salud para el puesto? (Opcional)
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej. Silla ergonómica, pausas activas, estado de gestación u otro (confidencial)"
                      value={formData.healthAdaptation}
                      onChange={(e) => setFormData({...formData, healthAdaptation: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
                    />
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-xl bg-gray-50 flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    id="gdpr"
                    checked={gdprAccepted}
                    onChange={(e) => setGdprAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#1B3326] rounded border-gray-300 focus:ring-[#1B3326]"
                  />
                  <label htmlFor="gdpr" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                    <span className="font-semibold text-gray-800">Consentimiento de Tratamiento de Datos (Ley N° 29733):</span> Autorizo de manera libre, previa e informada a <strong>Sensa People</strong> para tratar, verificar y transferir mis datos personales, antecedentes y resultados evaluativos a las empresas clientes con la finalidad exclusiva de intermediación laboral y selección de personal.
                  </label>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleNextStep}
                    className="bg-[#1B3326] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#14261C] transition flex items-center space-x-2"
                  >
                    <span>Iniciar Evaluaciones</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="bg-[#1B3326]/10 text-[#1B3326] text-xs font-bold px-2.5 py-1 rounded-full uppercase">Evaluación Técnica</span>
                  <h2 className="text-xl font-bold text-[#1B3326] mt-2">Prueba de Habilidades Digitales & Atajos de Teclado</h2>
                  <p className="text-sm text-gray-500">Selecciona la opción correcta en cada una de las 10 preguntas.</p>
                </div>

                <div className="space-y-4">
                  {shortcutsQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl border border-gray-200 bg-white">
                      <p className="text-sm font-semibold text-gray-900 mb-3">{idx + 1}. {q.q}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => setShortcutsAnswers({...shortcutsAnswers, [q.id]: optIdx})}
                            className={`text-left text-xs p-3 rounded-lg border transition ${
                              shortcutsAnswers[q.id] === optIdx
                                ? 'bg-[#1B3326] text-white border-[#1B3326] font-semibold'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleNextStep}
                    className="bg-[#1B3326] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#14261C] transition flex items-center space-x-2"
                  >
                    <span>Siguiente: Lógica & Razonamiento</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="bg-[#C29F62]/20 text-[#8E7036] text-xs font-bold px-2.5 py-1 rounded-full uppercase">Psicométrico Universal</span>
                  <h2 className="text-xl font-bold text-[#1B3326] mt-2">Prueba de Lógica, Razonamiento & Resolución de Problemas</h2>
                  <p className="text-sm text-gray-500">Preguntas de deducción, proporciones y secuencias universales.</p>
                </div>

                <div className="space-y-4">
                  {logicQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl border border-gray-200 bg-white">
                      <p className="text-sm font-semibold text-gray-900 mb-3">{idx + 1}. {q.q}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => setLogicAnswers({...logicAnswers, [q.id]: optIdx})}
                            className={`text-left text-xs p-3 rounded-lg border transition ${
                              logicAnswers[q.id] === optIdx
                                ? 'bg-[#1B3326] text-white border-[#1B3326] font-semibold'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleNextStep}
                    className="bg-[#1B3326] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#14261C] transition flex items-center space-x-2"
                  >
                    <span>Siguiente: Perfil Conductual</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 4 */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Evaluación Psicológica</span>
                  <h2 className="text-xl font-bold text-[#1B3326] mt-2">Prueba Conductual, Resiliencia & Trabajo en Equipo</h2>
                  <p className="text-sm text-gray-500">Selecciona la respuesta que mejor describa tu forma genuina de actuar.</p>
                </div>

                <div className="space-y-4">
                  {psychQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl border border-gray-200 bg-white">
                      <p className="text-sm font-semibold text-gray-900 mb-3">{idx + 1}. {q.q}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => setPsychAnswers({...psychAnswers, [q.id]: optIdx})}
                            className={`w-full text-left text-xs p-3 rounded-lg border transition ${
                              psychAnswers[q.id] === optIdx
                                ? 'bg-[#1B3326] text-white border-[#1B3326] font-semibold'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleNextStep}
                    className="bg-[#1B3326] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#14261C] transition flex items-center space-x-2"
                  >
                    <span>Siguiente: Subida de Documentos</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 5 */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1B3326]">Expediente Digital de Postulación</h2>
                  <p className="text-sm text-gray-500">Adjunta tus documentos obligatorios para validar tu postulación.</p>
                </div>

                <div className="bg-[#1B3326]/5 border border-[#1B3326]/20 p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <ShieldCheck className="w-6 h-6 text-[#1B3326] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1B3326] uppercase">¿Cómo obtener tu Certijoven / Certificado Único Laboral (CUL)?</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Es un certificado 100% oficial y gratuito emitido por el MTPE. Contiene antecedentes policiales, penales y trayectoria laboral formal:
                      </p>
                      <ol className="text-xs text-gray-600 list-decimal list-inside mt-2 space-y-1 font-medium">
                        <li>Ingresa a: <a href="https://www.empleosperu.gob.pe" target="_blank" rel="noreferrer" className="text-[#C29F62] underline font-bold">empleosperu.gob.pe</a></li>
                        <li>Inicia sesión con tu DNI y contraseña.</li>
                        <li>Haz clic en <strong>"Solicitar Certificado Único Laboral"</strong> y descarga el PDF.</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#1B3326] transition">
                    <FileText className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs font-bold text-gray-700">Currículum Vitae (CV)</p>
                    <p className="text-[11px] text-gray-400 mb-2">Formato PDF actualizado</p>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, 'cvBase64')}
                      className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-[#1B3326] file:text-white" 
                    />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#1B3326] transition">
                    <FileText className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs font-bold text-gray-700">DNI Ambos Lados</p>
                    <p className="text-[11px] text-gray-400 mb-2">Foto clara o PDF legible</p>
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e, 'dniBase64')}
                      className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-[#1B3326] file:text-white" 
                    />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#1B3326] transition sm:col-span-2">
                    <FileText className="w-6 h-6 mx-auto text-[#C29F62] mb-2" />
                    <p className="text-xs font-bold text-gray-700">Certijoven / Certificado Único Laboral (CUL)</p>
                    <p className="text-[11px] text-gray-400 mb-2">Descargado de empleosperu.gob.pe (Oficial MTPE)</p>
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e, 'certijovenBase64')}
                      className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-[#C29F62] file:text-white" 
                    />
                  </div>

                  {formData.hasChildren === 'Sí' && (
                    <div className="border-2 border-dashed border-amber-300 bg-amber-50/50 rounded-xl p-4 text-center hover:border-amber-500 transition sm:col-span-2">
                      <FileText className="w-6 h-6 mx-auto text-amber-600 mb-2" />
                      <p className="text-xs font-bold text-gray-700">DNI de los Hijos Menores de 18 años</p>
                      <p className="text-[11px] text-gray-500 mb-2">Requerido para asignación familiar</p>
                      <input 
                        type="file" 
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload(e, 'hijosBase64')}
                        className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-amber-600 file:text-white" 
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleFinishAssessment}
                    disabled={isSubmitting}
                    className="bg-[#1B3326] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#14261C] transition shadow-md flex items-center space-x-2 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Subiendo archivos y registrando...' : 'Finalizar y Enviar Evaluación'}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#C29F62]" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 6 */}
            {step === 6 && (
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 bg-[#1B3326]/10 text-[#1B3326] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-[#1B3326]" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#1B3326]">¡Evaluación Completada con Éxito!</h2>
                  <p className="text-sm text-gray-600 max-w-md mx-auto mt-1">
                    Tu postulación para <strong>{formData.position}</strong> ha sido registrada en el sistema de selección de Sensa People.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                  <div className="p-4 bg-[#F7F5EE] border border-[#E5E0D0] rounded-xl text-center">
                    <p className="text-[11px] font-bold uppercase text-gray-500">Atajos & PC</p>
                    <p className="text-2xl font-black text-[#1B3326] mt-1">{formData.shortcutsScore}%</p>
                  </div>
                  <div className="p-4 bg-[#F7F5EE] border border-[#E5E0D0] rounded-xl text-center">
                    <p className="text-[11px] font-bold uppercase text-gray-500">Lógica & Aptitud</p>
                    <p className="text-2xl font-black text-[#1B3326] mt-1">{formData.psychometricScore}%</p>
                  </div>
                  <div className="p-4 bg-[#F7F5EE] border border-[#E5E0D0] rounded-xl text-center">
                    <p className="text-[11px] font-bold uppercase text-gray-500">Conductual</p>
                    <p className="text-2xl font-black text-[#C29F62] mt-1">{formData.psychologicalScore}%</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-w-md mx-auto text-left text-xs space-y-1 text-gray-600">
                  <p><strong>Postulante:</strong> {formData.fullName}</p>
                  <p><strong>DNI:</strong> {formData.dni}</p>
                  <p><strong>Residencia:</strong> {formData.district} ({formData.address})</p>
                  <p><strong>Carga Familiar:</strong> {formData.hasChildren === 'Sí' ? `${formData.childrenCount} hijo(s) menor(es)` : 'Sin hijos menores'}</p>
                  <p><strong>Estado Legal:</strong> Consentimiento Ley 29733 Aceptado</p>
                </div>

                <div>
                  <a
                    href={`https://wa.me/51967255622?text=Hola%20Sensa%20People,%20completé%20mi%20evaluación%20digital.%20Nombre:%20${encodeURIComponent(formData.fullName)}%20-%20DNI:%20${encodeURIComponent(formData.dni)}%20-%20Distrito:%20${encodeURIComponent(formData.district)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#1B3326] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#14261C] transition shadow"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Notificar al Analista por WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANALISTA */}
        {activeTab === 'interviewer' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E0D0] p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="bg-[#C29F62]/20 text-[#8E7036] text-xs font-bold px-2.5 py-1 rounded-full uppercase">Área de Selección</span>
                <h2 className="text-xl font-bold text-[#1B3326] mt-1">Bandeja de Postulantes en Tiempo Real</h2>
                <p className="text-xs text-gray-500">Datos sincronizados directamente desde tu Base de Google Sheets.</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchCandidates}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition flex items-center space-x-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingCandidates ? 'animate-spin' : ''}`} />
                  <span>Actualizar Lista</span>
                </button>
                <button
                  onClick={handleLogoutAnalyst}
                  className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition flex items-center space-x-1 shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#E5E0D0] p-4 flex items-center space-x-3">
              <Search className="w-4 h-4 text-gray-400 ml-1" />
              <input
                type="text"
                placeholder="Buscar por Nombre, DNI, Distrito o Puesto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* TABLA DE POSTULANTES */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E0D0] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Postulantes Registrados ({filteredCandidates.length})
                </h3>
                <span className="text-[11px] text-gray-500">Haz clic en un postulante para abrir su ficha y evaluar en Meet</span>
              </div>

              {loadingCandidates ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#1B3326] mb-2" />
                  Cargando postulaciones desde Google Sheets...
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  No hay postulaciones registradas aún en tu hoja de cálculo.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-[#1B3326]/5 text-[#1B3326] uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Postulante</th>
                        <th className="py-3 px-4">Ubicación</th>
                        <th className="py-3 px-4">Puesto</th>
                        <th className="py-3 px-4 text-center">Atajos</th>
                        <th className="py-3 px-4 text-center">Lógica</th>
                        <th className="py-3 px-4 text-center">Conductual</th>
                        <th className="py-3 px-4 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredCandidates.map((cand, idx) => (
                        <tr 
                          key={idx} 
                          onClick={() => {
                            setSelectedCandidate(cand);
                            setSaveSuccessMsg('');
                          }}
                          className={`hover:bg-[#F7F5EE] cursor-pointer transition ${
                            selectedCandidate && selectedCandidate.dni === cand?.dni ? 'bg-amber-50/80 font-medium' : ''
                          }`}
                        >
                          <td className="py-3 px-4 text-[11px] text-gray-500 whitespace-nowrap">
                            {cand?.fecha ? cand.fecha.toString().substring(0, 10) : 'Reciente'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#1B3326]">{cand?.fullName || 'Sin nombre'}</div>
                            <div className="text-[11px] text-gray-500">DNI: {cand?.dni || '-'} | Cel: {cand?.phone || '-'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-gray-800">{cand?.district || 'No especificado'}</div>
                            <div className="text-[10px] text-gray-500 truncate max-w-[150px]">{cand?.address || ''}</div>
                          </td>
                          <td className="py-3 px-4 text-[11px] text-gray-600">{cand?.position || '-'}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-800">
                              {cand?.shortcutsScore ?? 0}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800">
                              {cand?.psychometricScore ?? 0}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800">
                              {cand?.psychologicalScore ?? 0}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCandidate(cand);
                                setSaveSuccessMsg('');
                              }}
                              className="px-2.5 py-1 rounded bg-[#1B3326] text-white text-[11px] font-semibold hover:bg-[#14261C] transition inline-flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Evaluar</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* FICHA DETALLADA Y SCORECARD DE ENTREVISTA EN VIVO */}
            {selectedCandidate && (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-[#1B3326]/30 p-6 sm:p-8 space-y-6">
                
                {/* Cabecera */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <span className="bg-[#1B3326] text-[#C29F62] text-[10px] font-bold px-2 py-0.5 rounded uppercase">Expediente Activo</span>
                    <h3 className="text-2xl font-bold text-[#1B3326] mt-1">{selectedCandidate?.fullName || 'Postulante'}</h3>
                    <p className="text-xs text-gray-500">
                      DNI: <strong>{selectedCandidate?.dni || '-'}</strong> | Celular: <strong>{selectedCandidate?.phone || '-'}</strong> | Correo: <strong>{selectedCandidate?.email || '-'}</strong>
                    </p>
                    <p className="text-xs text-[#1B3326] font-medium mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C29F62]" /> 
                      <strong>Distrito:</strong> {selectedCandidate?.district || 'No especificado'} &nbsp;|&nbsp; <strong>Dirección:</strong> {selectedCandidate?.address || 'No especificada'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${selectedCandidate?.phone ? selectedCandidate.phone.toString().replace(/[^0-9]/g, '') : ''}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:opacity-90 transition flex items-center space-x-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="px-3 py-1.5 rounded-lg border text-xs text-gray-500 hover:bg-gray-50 transition"
                    >
                      Cerrar Ficha
                    </button>
                  </div>
                </div>

                {/* Resumen de Notas */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl border text-center">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Atajos / PC</span>
                    <p className="text-xl font-black text-[#1B3326]">{selectedCandidate?.shortcutsScore ?? 0}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border text-center">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Lógica Universal</span>
                    <p className="text-xl font-black text-blue-900">{selectedCandidate?.psychometricScore ?? 0}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border text-center">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Perfil Conductual</span>
                    <p className="text-xl font-black text-[#C29F62]">{selectedCandidate?.psychologicalScore ?? 0}%</p>
                  </div>
                  <div className="p-3 bg-[#F7F5EE] rounded-xl border text-center">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Hijos Menores</span>
                    <p className="text-sm font-bold text-gray-800 mt-1">
                      {selectedCandidate?.hasChildren === 'Sí' ? `${selectedCandidate.childrenCount} hijo(s)` : 'Sin hijos'}
                    </p>
                  </div>
                </div>

                {/* Documentos Adjuntos */}
                <div className="border-t pt-4">
                  <h4 className="text-xs font-bold text-[#1B3326] uppercase tracking-wider mb-3">
                    Documentos y Expediente del Postulante
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedCandidate?.cvUrl && selectedCandidate.cvUrl.toString().startsWith('http') ? (
                      <a 
                        href={selectedCandidate.cvUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 border rounded-xl bg-gray-50 hover:bg-[#1B3326]/5 flex items-center justify-between transition text-xs font-semibold text-[#1B3326]"
                      >
                        <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#1B3326]" /> Ver Currículum (CV)</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                      </a>
                    ) : (
                      <div className="p-3 border rounded-xl bg-gray-50 text-xs text-gray-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-gray-400" /> CV: No disponible
                      </div>
                    )}

                    {selectedCandidate?.dniUrl && selectedCandidate.dniUrl.toString().startsWith('http') ? (
                      <a 
                        href={selectedCandidate.dniUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 border rounded-xl bg-gray-50 hover:bg-[#1B3326]/5 flex items-center justify-between transition text-xs font-semibold text-[#1B3326]"
                      >
                        <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#1B3326]" /> Ver DNI (Ambos Lados)</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                      </a>
                    ) : (
                      <div className="p-3 border rounded-xl bg-gray-50 text-xs text-gray-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-gray-400" /> DNI: No disponible
                      </div>
                    )}

                    {selectedCandidate?.certijovenUrl && selectedCandidate.certijovenUrl.toString().startsWith('http') ? (
                      <a 
                        href={selectedCandidate.certijovenUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 border rounded-xl bg-gray-50 hover:bg-[#1B3326]/5 flex items-center justify-between transition text-xs font-semibold text-[#C29F62]"
                      >
                        <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#C29F62]" /> Ver Certijoven / CUL</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                      </a>
                    ) : (
                      <div className="p-3 border rounded-xl bg-gray-50 text-xs text-gray-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-gray-400" /> Certijoven: No disponible
                      </div>
                    )}
                  </div>
                </div>

                {/* DATOS DEL ANALISTA & FECHA DE EVALUACIÓN */}
                <div className="bg-[#1B3326]/5 p-4 rounded-xl border border-[#1B3326]/20">
                  <h4 className="text-xs font-bold text-[#1B3326] uppercase tracking-wider mb-3">
                    Datos del Evaluador (Analista de Sensa)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#1B3326]" /> Nombre y Apellido del Analista *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Ana Pérez Mendoza"
                        value={evaluatorName}
                        onChange={(e) => setEvaluatorName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B3326] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#1B3326]" /> Fecha y Hora de la Evaluación
                      </label>
                      <input
                        type="text"
                        value={evalDate}
                        onChange={(e) => setEvalDate(e.target.value)}
                        className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg text-xs text-gray-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SCORECARD UNIVERSAL (APTO PARA CUALQUIER CARGO) */}
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-xs font-bold text-[#1B3326] uppercase tracking-wider">
                    Scorecard de Calificación en Vivo (Entrevista Meet)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 border rounded-xl bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-700">1. Comunicación & Articulación</span>
                        <select 
                          value={star1}
                          onChange={(e) => setStar1(e.target.value)}
                          className="text-xs border rounded p-1 font-bold text-[#C29F62] bg-white"
                        >
                          <option>★★★★★ (Excelente)</option>
                          <option>★★★★☆ (Muy Bueno)</option>
                          <option>★★★☆☆ (Aceptable)</option>
                          <option>★★☆☆☆ (Deficiente)</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-gray-500">Claridad de ideas, seguridad, escucha activa y dicción.</p>
                    </div>

                    <div className="p-3 border rounded-xl bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-700">2. Resolución de Problemas (STAR)</span>
                        <select 
                          value={star2}
                          onChange={(e) => setStar2(e.target.value)}
                          className="text-xs border rounded p-1 font-bold text-[#C29F62] bg-white"
                        >
                          <option>★★★★★ (Excelente)</option>
                          <option>★★★★☆ (Muy Bueno)</option>
                          <option>★★★☆☆ (Aceptable)</option>
                          <option>★★☆☆☆ (Deficiente)</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-gray-500">Capacidad para afrontar situaciones críticas y lograr soluciones.</p>
                    </div>

                    <div className="p-3 border rounded-xl bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-700">3. Tolerancia a la Presión</span>
                        <select 
                          value={star3}
                          onChange={(e) => setStar3(e.target.value)}
                          className="text-xs border rounded p-1 font-bold text-[#C29F62] bg-white"
                        >
                          <option>★★★★★ (Excelente)</option>
                          <option>★★★★☆ (Muy Bueno)</option>
                          <option>★★★☆☆ (Aceptable)</option>
                          <option>★★☆☆☆ (Deficiente)</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-gray-500">Manejo emocional frente a cargas laborales altas o cambios imprevistos.</p>
                    </div>

                    <div className="p-3 border rounded-xl bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-700">4. Compromiso & Motivación</span>
                        <select 
                          value={star4}
                          onChange={(e) => setStar4(e.target.value)}
                          className="text-xs border rounded p-1 font-bold text-[#C29F62] bg-white"
                        >
                          <option>★★★★★ (Excelente)</option>
                          <option>★★★★☆ (Muy Bueno)</option>
                          <option>★★★☆☆ (Aceptable)</option>
                          <option>★★☆☆☆ (Deficiente)</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-gray-500">Interés genuino en el puesto, conformidad con horarios y metas.</p>
                    </div>
                  </div>
                </div>

                {/* Dictamen del Analista */}
                <div className="space-y-2 border-t pt-4">
                  <label className="block text-xs font-bold uppercase text-gray-600">Dictamen Final del Analista</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      type="button"
                      onClick={() => setDictamen('Aprobado para Terna')}
                      className={`py-2.5 text-xs font-bold rounded-lg border-2 transition ${
                        dictamen === 'Aprobado para Terna'
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow'
                          : 'border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      ✓ Aprobado para Terna
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDictamen('Banco de Reserva')}
                      className={`py-2.5 text-xs font-bold rounded-lg border-2 transition ${
                        dictamen === 'Banco de Reserva'
                          ? 'border-amber-500 bg-amber-500 text-white shadow'
                          : 'border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      ⚠ Banco de Reserva
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDictamen('Descartado')}
                      className={`py-2.5 text-xs font-bold rounded-lg border-2 transition ${
                        dictamen === 'Descartado'
                          ? 'border-red-600 bg-red-600 text-white shadow'
                          : 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      ✕ Descartado
                    </button>
                  </div>
                </div>

                {/* Notas Ejecutivas */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Notas Ejecutivas & Observaciones de Condiciones
                  </label>
                  <textarea 
                    rows="3" 
                    value={executiveNotes}
                    onChange={(e) => setExecutiveNotes(e.target.value)}
                    placeholder="Ej. Postulante con 2 años de experiencia. Excelente articulación de ideas. Acepta sueldo y horarios; indica disponibilidad inmediata. Certijoven limpio."
                    className="w-full p-3 border rounded-lg text-xs focus:ring-2 focus:ring-[#1B3326]"
                  />
                </div>

                {/* MENSAJE DE CONFIRMACIÓN */}
                {saveSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                {/* BOTÓN OFICIAL DE GUARDAR */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveEvaluation}
                    disabled={isSavingEval}
                    className="bg-[#1B3326] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#14261C] transition shadow-lg flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 text-[#C29F62]" />
                    <span>{isSavingEval ? 'Guardando en Google Sheets...' : 'Guardar Evaluación de Entrevista'}</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, AlertCircle, FileText, Send, Award, 
  HelpCircle, ChevronRight, UserCheck, ShieldCheck, Download,
  ExternalLink, Sparkles, MessageCircle, Star, Phone, Mail, Building,
  Lock, LogOut, KeyRound, RefreshCw, Eye, Search, MapPin, Save, User, Calendar
} from 'lucide-react';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwTqdEZ3S1gyD2PbVYqpXJC7d9WElGletaN3ld8KGZFq2w0mr9qa6vSiab8_1lS18kFJQ/exec";
const ANALYST_SECRET_PIN = "sensa2026";

export default function App() {
  const [activeTab, setActiveTab] = useState('candidate');
  const [step, setStep] = useState(1);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Seguridad y datos del Analista
  const [isAnalystAuth, setIsAnalystAuth] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [accessPassword, setAccessPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  
  // Lista de postulantes
  const [candidatesList, setCandidatesList] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Formulario de Evaluación en Meet (por el analista)
  const [evaluatorName, setEvaluatorName] = useState('');
  const [evalDate, setEvalDate] = useState('');
  const [star1, setStar1] = useState('★★★★★ (Excelente)');
  const [star2, setStar2] = useState('★★★★★ (Excelente)');
  const [star3, setStar3] = useState('★★★★★ (Excelente)');
  const [star4, setStar4] = useState('★★★★★ (Excelente)');
  const [dictamen, setDictamen] = useState('Aprobado para Terna');
  const [executiveNotes, setExecutiveNotes] = useState('');
  const [isSavingEval, setIsSavingEval] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Inicializar fecha y hora actual para el analista
  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }) + 
                      ' ' + now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    setEvalDate(formatted);
  }, [selectedCandidate]);

  // Form State del Postulante
  const [formData, setFormData] = useState({
    fullName: '',
    dni: '',
    phone: '',
    email: '',
    district: '',
    address: '',
    position: 'Asesores de Ventas / Teleoperadores',
    hasChildren: 'No',
    childrenCount: '0',
    healthAdaptation: '',
    shortcutsScore: 0,
    psychometricScore: 0,
    psychologicalScore: 0,
    cvBase64: '',
    dniBase64: '',
    certijovenBase64: '',
    hijosBase64: ''
  });

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Atajos de Teclado
  const [shortcutsAnswers, setShortcutsAnswers] = useState({});
  const shortcutsQuestions = [
    { id: 's1', q: '¿Qué atajo de teclado se utiliza para COPIAR un texto o elemento?', options: ['A) Ctrl + V', 'B) Ctrl + C', 'C) Ctrl + X', 'D) Ctrl + Z'], correct: 1 },
    { id: 's2', q: '¿Qué combinación de teclas permite PEGAR información copiada?', options: ['A) Ctrl + P', 'B) Ctrl + C', 'C) Alt + V', 'D) Ctrl + V'], correct: 3 },
    { id: 's3', q: '¿Cuál es el comando estándar para DESHACER la última acción realizada?', options: ['A) Ctrl + Z', 'B) Ctrl + Y', 'C) Ctrl + D', 'D) Ctrl + Backspace'], correct: 0 },
    { id: 's4', q: '¿Qué combinación permite alternar o cambiar rápidamente entre ventanas abiertas en Windows?', options: ['A) Ctrl + Tab', 'B) Windows + L', 'C) Alt + Tab', 'D) Shift + Tab'], correct: 2 },
    { id: 's5', q: 'Para BUSCAR una palabra clave o dato dentro de una página web, documento o PDF:', options: ['A) Ctrl + B', 'B) Ctrl + S', 'C) Ctrl + F', 'D) Ctrl + H'], correct: 2 },
    { id: 's6', q: '¿Qué comando selecciona TODO el texto o todos los elementos de un documento/carpeta?', options: ['A) Ctrl + T', 'B) Ctrl + E (o Ctrl + A en inglés)', 'C) Shift + Flecha Abajo', 'D) Alt + A'], correct: 1 },
    { id: 's7', q: '¿Cómo puedes MINIMIZAR todas las ventanas abiertas al instante y mostrar el escritorio?', options: ['A) Windows + D', 'B) Ctrl + M', 'C) Alt + F4', 'D) Windows + Esc'], correct: 0 },
    { id: 's8', q: 'Para ABRIR el Administrador de Tareas directamente si un programa se congela:', options: ['A) Alt + Tab + Del', 'B) Ctrl + Alt + F4', 'C) Windows + R', 'D) Ctrl + Shift + Esc'], correct: 3 },
    { id: 's9', q: 'Para CERRAR la pestaña activa del navegador sin cerrar todo el programa:', options: ['A) Ctrl + Q', 'B) Ctrl + W', 'C) Alt + W', 'D) Ctrl + Shift + W'], correct: 1 },
    { id: 's10', q: '¿Qué tecla se presiona en el teclado para ACTUALIZAR o recargar una página web?', options: ['A) F2', 'B) F11', 'C) F5', 'D) F8'], correct: 2 }
  ];

  // Lógica y Razonamiento
  const [logicAnswers, setLogicAnswers] = useState({});
  const logicQuestions = [
    { id: 'l1', q: 'Si una empresa proyecta un presupuesto de S/ 8,000 y se reduce un 15%, ¿cuánto presupuesto queda disponible?', options: ['A) S/ 6,500', 'B) S/ 6,800', 'C) S/ 7,200', 'D) S/ 7,000'], correct: 1 },
    { id: 'l2', q: 'Si 4 analistas completan 20 revisiones en 2 horas, ¿cuántas revisiones completarán 8 analistas con el mismo ritmo en 2 horas?', options: ['A) 30', 'B) 50', 'C) 20', 'D) 40'], correct: 3 },
    { id: 'l3', q: 'Continúa la serie numérica: 3, 6, 12, 24, 48, ...', options: ['A) 96', 'B) 72', 'C) 84', 'D) 108'], correct: 0 },
    { id: 'l4', q: 'Si todos los supervisores son puntuales y Carlos no es puntual, podemos deducir que:', options: ['A) Carlos es supervisor suplente', 'B) Carlos trabaja horas extras', 'C) Carlos no es supervisor', 'D) Carlos es formador'], correct: 2 },
    { id: 'l5', q: 'Un equipo recibe 120 solicitudes en el día. Si el 25% requiere atención urgente, ¿cuántas solicitudes NO son urgentes?', options: ['A) 30', 'B) 80', 'C) 90', 'D) 100'], correct: 2 },
    { id: 'l6', q: 'Encuentra la analogía correspondiente: TECLADO es a ESCRIBIR como PANTALLA es a:', options: ['A) Escuchar', 'B) Visualizar', 'C) Conectar', 'D) Procesar'], correct: 1 },
    { id: 'l7', q: 'Si tienes 3 tareas críticas con vencimiento hoy y 2 tareas menores con plazo de 5 días, ¿cuál debe ser tu orden de ejecución?', options: ['A) Resolver primero las tareas con entrega hoy según prioridad de impacto', 'B) Iniciar por las de 5 días porque son más rápidas', 'C) Postergar todas para consultar en la siguiente reunión', 'D) Dividir el tiempo mitad y mitad'], correct: 0 },
    { id: 'l8', q: 'Si el costo unitario de un servicio baja de S/ 200 a S/ 150, ¿cuál es el porcentaje de reducción?', options: ['A) 20%', 'B) 30%', 'C) 33%', 'D) 25%'], correct: 3 },
    { id: 'l9', q: 'Si A es mayor que B, y B es mayor que C, ¿cuál es la afirmación correcta?', options: ['A) C es mayor que A', 'B) A es mayor que C', 'C) B es igual a A', 'D) No es posible saberlo'], correct: 1 },
    { id: 'l10', q: 'Completa la secuencia de letras: B, D, F, H, ...', options: ['A) I', 'B) K', 'C) J', 'D) L'], correct: 2 }
  ];

  // Psicológico / Conductual
  const [psychAnswers, setPsychAnswers] = useState({});
  const psychQuestions = [
    { id: 'p1', q: 'Frente a un día con múltiples imprevistos y cambios de prioridades por parte de gerencia, tu actitud habitual es:', options: ['A) Expresar molestia y exigir que no cambien los planes', 'B) Adaptarte con serenidad, reorganizar tu lista y avanzar por orden de relevancia', 'C) Dejar de trabajar hasta que definan algo fijo', 'D) Cumplir solo lo que te corresponde personalmente'], correct: 1 },
    { id: 'p2', q: 'Si notas que cometiste un error en un reporte que nadie más se ha dado cuenta, ¿qué decides hacer?', options: ['A) Ignorarlo esperando que nadie lo note', 'B) Culpar al sistema informático si alguien pregunta', 'C) Esperar a fin de mes para justificarlo', 'D) Comunicarlo de inmediato a tu superior con la corrección ya elaborada'], correct: 3 },
    { id: 'p3', q: 'Al recibir retroalimentación constructiva sobre aspectos por mejorar en tu rendimiento:', options: ['A) Escuchas con apertura, agradeces la observación y aplicas mejoras concretas', 'B) Te sientes atacado personalmente y guardas silencio', 'C) Buscas justificaciones externas para defenderte', 'D) Desestimas los comentarios de inmediato'], correct: 0 },
    { id: 'p4', q: 'Cuando un compañero de equipo solicita apoyo porque está saturado y tú ya terminaste tus labores:', options: ['A) Te desconectas antes de tiempo', 'B) Le dices que cada quien debe ver sus pendientes', 'C) Te ofreces a colaborar en tareas operativas para lograr el objetivo común', 'D) Avisas a su jefe para que lo sancionen'], correct: 2 },
    { id: 'p5', q: 'Frente a situaciones laborales donde las cosas no salen como las planificaste tras varios intentos:', options: ['A) Abandonas el proyecto y te enfocas en lo fácil', 'B) Te frustras y reduces tu ritmo de trabajo', 'C) Analizas qué factores fallaron, modificas la estrategia y perseveras', 'D) Esperas que otro compañero resuelva el problema'], correct: 2 },
    { id: 'p6', q: 'Si un usuario o cliente se comunica de manera agresiva o descortés, tu conducta profesional es:', options: ['A) Responder con el mismo tono para hacerte respetar', 'B) Mantener la calma, escuchar activamente y orientar la conversación hacia la solución', 'C) Colgar o cortar la comunicación de inmediato sin avisar', 'D) Ignorar sus consultas'], correct: 1 },
    { id: 'p7', q: 'Respecto al cumplimiento de horarios y compromisos laborales en modalidad remota o presencial:', options: ['A) Consideras que la puntualidad rigurosa refleja compromiso, respeto y profesionalismo', 'B) Crees que 15 o 20 minutos tarde no hacen diferencia', 'C) Te conectas a tiempo solo si hay supervisión directa', 'D) La puntualidad es secundaria frente a cualquier excusa'], correct: 0 },
    { id: 'p8', q: 'Cuando cumples tu meta u objetivo asignado antes de finalizar el plazo previsto:', options: ['A) Detienes tu producción para que no aumenten tus metas', 'B) Tomas tiempo libre sin reportarlo', 'C) Te quejas de que la meta era muy simple', 'D) Buscas superar el objetivo establecido o coordinas nuevas metas con tu líder'], correct: 3 },
    { id: 'p9', q: 'Si surge una discrepancia de opinión con un compañero de tu área de trabajo:', options: ['A) Generas comentarios con otros colegas sobre el problema', 'B) Conversas directamente y de forma respetuosa con él para buscar un acuerdo', 'C) Evitas hablarle en adelante', 'D) Llevas el caso a recursos humanos sin haber dialogado antes'], correct: 1 },
    { id: 'p10', q: '¿Qué describe mejor tu motivación principal en el ámbito laboral?', options: ['A) Trabajar únicamente el mínimo indispensable para no ser despedido', 'B) Buscar la salida más rápida de cada tarea', 'C) Crecer profesionalmente mediante el mérito, la superación continua y el aporte de valor', 'D) Evitar asumir cualquier tipo de responsabilidad'], correct: 2 }
  ];

  const calculateScores = () => {
    let sScore = 0;
    shortcutsQuestions.forEach(q => {
      if (shortcutsAnswers[q.id] === q.correct) sScore += 10;
    });

    let lScore = 0;
    logicQuestions.forEach(q => {
      if (logicAnswers[q.id] === q.correct) lScore += 10;
    });

    let pScore = 0;
    psychQuestions.forEach(q => {
      if (psychAnswers[q.id] === q.correct) pScore += 10;
    });

    return { sScore, lScore, pScore };
  };

  const handleNextStep = () => {
    if (step === 1 && !gdprAccepted) {
      alert('Debe aceptar la Cláusula de Tratamiento de Datos Personales para continuar.');
      return;
    }
    if (step === 1 && (!formData.fullName || !formData.dni || !formData.phone || !formData.district || !formData.address)) {
      alert('Por favor complete todos los datos obligatorios del Paso 1, incluyendo su distrito y dirección.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleFinishAssessment = async () => {
    setIsSubmitting(true);
    const { sScore, lScore, pScore } = calculateScores();
    const finalData = {
      ...formData,
      shortcutsScore: sScore,
      psychometricScore: lScore,
      psychologicalScore: pScore
    };
    setFormData(finalData);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
    } catch (err) {
      console.error("Error al enviar:", err);
    } finally {
      setIsSubmitting(false);
      setStep(6);
    }
  };

  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const res = await fetch(SCRIPT_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCandidatesList(data.reverse());
      }
    } catch (err) {
      console.error("Error al cargar postulantes:", err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    if (isAnalystAuth && activeTab === 'interviewer') {
      fetchCandidates();
    }
  }, [isAnalystAuth, activeTab]);

  const handleAnalystTabClick = () => {
    if (isAnalystAuth) {
      setActiveTab('interviewer');
    } else {
      setShowAuthModal(true);
      setAuthError(false);
      setAccessPassword('');
    }
  };

  const handleVerifyPassword = (e) => {
    e.preventDefault();
    if (accessPassword === ANALYST_SECRET_PIN) {
      setIsAnalystAuth(true);
      setShowAuthModal(false);
      setActiveTab('interviewer');
    } else {
      setAuthError(true);
    }
  };

  const handleLogoutAnalyst = () => {
    setIsAnalystAuth(false);
    setActiveTab('candidate');
    setSelectedCandidate(null);
  };

  // Guardar Evaluación del Analista en Google Sheets
  const handleSaveEvaluation = async () => {
    if (!evaluatorName.trim()) {
      alert("Por favor ingresa tu Nombre y Apellido de Analista antes de guardar.");
      return;
    }

    setIsSavingEval(true);
    setSaveSuccessMsg('');

    const evaluationPayload = {
      action: "save_evaluation",
      dni: selectedCandidate.dni,
      evaluatorName,
      evalDate,
      starScore1: star1,
      starScore2: star2,
      starScore3: star3,
      starScore4: star4,
      dictamen,
      executiveNotes
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluationPayload)
      });

      setSaveSuccessMsg('✓ ¡Evaluación guardada exitosamente en la base de datos de Google Drive / Sheets!');
      fetchCandidates();
    } catch (err) {
      console.error("Error al guardar evaluación:", err);
      alert("Hubo un error al guardar la evaluación. Intente nuevamente.");
    } finally {
      setIsSavingEval(false);
    }
  };

  const filteredCandidates = candidatesList.filter(c => 
    (c && c.fullName && c.fullName.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c && c.dni && c.dni.toString().includes(searchTerm)) ||
    (c && c.district && c.district.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c && c.position && c.position.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-[#0F1A14] font-sans pb-16">
      {/* Encabezado */}
      <header className="bg-white border-b border-[#E5E0D0] sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#1B3326] flex items-center justify-center text-[#C29F62] font-bold text-xl shadow">
              S
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wider text-[#1B3326] uppercase">SENSA PEOPLE</h1>
              <p className="text-[11px] text-[#C29F62] tracking-widest font-semibold uppercase">Talento con Sentido</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('candidate')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                activeTab === 'candidate' 
                  ? 'bg-[#1B3326] text-white shadow' 
                  : 'bg-white border border-[#1B3326]/20 text-[#1B3326] hover:bg-[#F7F5EE]'
              }`}
            >
              Portal del Postulante
            </button>
            <button
              onClick={handleAnalystTabClick}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition flex items-center space-x-1.5 ${
                activeTab === 'interviewer' 
                  ? 'bg-[#C29F62] text-white shadow' 
                  : 'bg-white border border-[#C29F62]/30 text-[#0F1A14] hover:bg-[#F7F5EE]'
              }`}
            >
              {isAnalystAuth ? <UserCheck className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-gray-500" />}
              <span>Panel de Analista (Meet)</span>
            </button>

            {isAnalystAuth && (
              <button
                onClick={handleLogoutAnalyst}
                title="Cerrar sesión de analista"
                className="p-2 rounded-full text-xs text-red-600 bg-red-50 hover:bg-red-100 transition border border-red-200"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Contraseña */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200">
            <div className="w-12 h-12 rounded-full bg-[#1B3326]/10 text-[#1B3326] flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-center text-lg font-bold text-[#1B3326]">Acceso de Analista</h3>
            <p className="text-center text-xs text-gray-500 mt-1 mb-4">
              Área restringida para el equipo de selección de Sensa People. Ingresa tu clave para continuar.
            </p>

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Contraseña institucional"
                  value={accessPassword}
                  onChange={(e) => {
                    setAccessPassword(e.target.value);
                    if (authError) setAuthError(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#1B3326] focus:outline-none"
                />
                {authError && (
                  <p className="text-red-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Clave incorrecta. Acceso denegado.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="w-1/2 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-semibold text-white bg-[#1B3326] rounded-lg hover:bg-[#14261C] transition"
                >
                  Ingresar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contenedor Principal */}
      <main className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* POSTULANTE */}
        {activeTab === 'candidate' && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E0D0] p-6 sm:p-8">
            
            {step <= 5 && (
              <div className="mb-8">
                <div className="flex justify-between items-center text-xs font-bold text-[#1B3326]/60 mb-2">
                  <span>Paso {step} de 5</span>
                  <span className="text-[#C29F62]">
                    {step === 1 && 'Datos, Ubicación & Consentimiento'}
                    {step === 2 && 'Prueba 1: Atajos y PC'}
                    {step === 3 && 'Prueba 2: Lógica & Aptitud'}
                    {step === 4 && 'Prueba 3: Perfil Conductual'}
                    {step === 5 && 'Expediente & Documentos'}
                  </span>
                </div>
                <div className="w-full bg-[#E5E0D0] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#1B3326] h-full transition-all duration-300"
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* PASO 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1B3326]">Ficha de Registro y Postulación</h2>
                  <p className="text-sm text-gray-500">Completa tus datos personales y de residencia para formalizar tu expediente de evaluación.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Nombre Completo *</label>
                    <input 
                      type="text" 
                      placeholder="Nombres y Apellidos"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">DNI / Documento de Identidad *</label>
                    <input 
                      type="text" 
                      placeholder="8 dígitos de DNI o CE"
                      value={formData.dni}
                      onChange={(e) => setFormData({...formData, dni: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">WhatsApp / Celular de Contacto *</label>
                    <input 
                      type="text" 
                      placeholder="+51 9XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Correo Electrónico *</label>
                    <input 
                      type="email" 
                      placeholder="tu.correo@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1B3326] mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C29F62]" /> Distrito / Ciudad de Residencia *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej. Miraflores, San Juan de Lurigancho, Trujillo"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1B3326] mb-1">
                      Dirección Exacta o Referencia *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej. Av. Larco 450 Dpto 301 / Altura cruce Benavides"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Puesto al que Postula</label>
                    <select 
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B3326] text-sm bg-white"
                    >
                      <option>Asesores de Ventas / Teleoperadores</option>
                      <option>Supervisores de Ventas / Team Leaders</option>
                      <option>Formadores / Capacitadores</option>
                      <option>Mandos Medios / Administrativos</option>
                      <option>Otros perfiles especializados</option>
                    </select>
                  </div>
                </div>

                <div className="bg-[#F7F5EE] p-4 rounded-xl border border-[#E5E0D0] space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1B3326] mb-1">
                        ¿Tiene hijos menores a 18 años de edad? *
                      </label>
                      <select 
                        value={formData.hasChildren}
                        onChange={(e) => setFormData({...formData, hasChildren: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
                      >
                        <option value="No">No</option>
                        <option value="Sí">Sí</option>
                      </select>
                    </div>

                    {formData.hasChildren === 'Sí' && (
                      <div>
                        <label className="block text-xs font-bold text-[#1B3326] mb-1">
                          ¿Cuántos hijos menores a 18 años tiene?
                        </label>
                        <input 
                          type="number" 
                          min="1"
                          placeholder="Ej. 1, 2"
                          value={formData.childrenCount}
                          onChange={(e) => setFormData({...formData, childrenCount: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B3326] mb-1">
                      ¿Requiere alguna condición ergonómica o adaptación de salud para el puesto? (Opcional)
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej. Silla ergonómica, pausas activas, estado de gestación u otro (confidencial)"
                      value={formData.healthAdaptation}
                      onChange={(e) => setFormData({...formData, healthAdaptation: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white"
                    />
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-xl bg-gray-50 flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    id="gdpr"
                    checked={gdprAccepted}
                    onChange={(e) => setGdprAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#1B3326] rounded border-gray-300 focus:ring-[#1B3326]"
                  />
                  <label htmlFor="gdpr" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                    <span className="font-semibold text-gray-800">Consentimiento de Tratamiento de Datos (Ley N° 29733):</span> Autorizo de manera libre, previa e informada a <strong>Sensa People</strong> para tratar, verificar y transferir mis datos personales, antecedentes y resultados evaluativos a las empresas clientes con la finalidad exclusiva de intermediación laboral y selección de personal.
                  </label>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleNextStep}
                    className="bg-[#1B3326] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#14261C] transition flex items-center space-x-2"
                  >
                    <span>Iniciar Evaluaciones</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="bg-[#1B3326]/10 text-[#1B3326] text-xs font-bold px-2.5 py-1 rounded-full uppercase">Evaluación Técnica</span>
                  <h2 className="text-xl font-bold text-[#1B3326] mt-2">Prueba de Habilidades Digitales & Atajos de Teclado</h2>
                  <p className="text-sm text-gray-500">Selecciona la opción correcta en cada una de las 10 preguntas.</p>
                </div>

                <div className="space-y-4">
                  {shortcutsQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl border border-gray-200 bg-white">
                      <p className="text-sm font-semibold text-gray-900 mb-3">{idx + 1}. {q.q}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => setShortcutsAnswers({...shortcutsAnswers, [q.id]: optIdx})}
                            className={`text-left text-xs p-3 rounded-lg border transition ${
                              shortcutsAnswers[q.id] === optIdx
                                ? 'bg-[#1B3326] text-white border-[#1B3326] font-semibold'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleNextStep}
                    className="bg-[#1B3326] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#14261C] transition flex items-center space-x-2"
                  >
                    <span>Siguiente: Lógica & Razonamiento</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="bg-[#C29F62]/20 text-[#8E7036] text-xs font-bold px-2.5 py-1 rounded-full uppercase">Psicométrico Universal</span>
                  <h2 className="text-xl font-bold text-[#1B3326] mt-2">Prueba de Lógica, Razonamiento & Resolución de Problemas</h2>
                  <p className="text-sm text-gray-500">Preguntas de deducción, proporciones y secuencias universales.</p>
                </div>

                <div className="space-y-4">
                  {logicQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl border border-gray-200 bg-white">
                      <p className="text-sm font-semibold text-gray-900 mb-3">{idx + 1}. {q.q}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => setLogicAnswers({...logicAnswers, [q.id]: optIdx})}
                            className={`text-left text-xs p-3 rounded-lg border transition ${
                              logicAnswers[q.id] === optIdx
                                ? 'bg-[#1B3326] text-white border-[#1B3326] font-semibold'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleNextStep}
                    className="bg-[#1B3326] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#14261C] transition flex items-center space-x-2"
                  >
                    <span>Siguiente: Perfil Conductual</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 4 */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Evaluación Psicológica</span>
                  <h2 className="text-xl font-bold text-[#1B3326] mt-2">Prueba Conductual, Resiliencia & Trabajo en Equipo</h2>
                  <p className="text-sm text-gray-500">Selecciona la respuesta que mejor describa tu forma genuina de actuar.</p>
                </div>

                <div className="space-y-4">
                  {psychQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl border border-gray-200 bg-white">
                      <p className="text-sm font-semibold text-gray-900 mb-3">{idx + 1}. {q.q}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => setPsychAnswers({...psychAnswers, [q.id]: optIdx})}
                            className={`w-full text-left text-xs p-3 rounded-lg border transition ${
                              psychAnswers[q.id] === optIdx
                                ? 'bg-[#1B3326] text-white border-[#1B3326] font-semibold'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleNextStep}
                    className="bg-[#1B3326] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#14261C] transition flex items-center space-x-2"
                  >
                    <span>Siguiente: Subida de Documentos</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 5 */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1B3326]">Expediente Digital de Postulación</h2>
                  <p className="text-sm text-gray-500">Adjunta tus documentos obligatorios para validar tu postulación.</p>
                </div>

                <div className="bg-[#1B3326]/5 border border-[#1B3326]/20 p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <ShieldCheck className="w-6 h-6 text-[#1B3326] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1B3326] uppercase">¿Cómo obtener tu Certijoven / Certificado Único Laboral (CUL)?</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Es un certificado 100% oficial y gratuito emitido por el MTPE. Contiene antecedentes policiales, penales y trayectoria laboral formal:
                      </p>
                      <ol className="text-xs text-gray-600 list-decimal list-inside mt-2 space-y-1 font-medium">
                        <li>Ingresa a: <a href="https://www.empleosperu.gob.pe" target="_blank" rel="noreferrer" className="text-[#C29F62] underline font-bold">empleosperu.gob.pe</a></li>
                        <li>Inicia sesión con tu DNI y contraseña.</li>
                        <li>Haz clic en <strong>"Solicitar Certificado Único Laboral"</strong> y descarga el PDF.</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#1B3326] transition">
                    <FileText className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs font-bold text-gray-700">Currículum Vitae (CV)</p>
                    <p className="text-[11px] text-gray-400 mb-2">Formato PDF actualizado</p>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, 'cvBase64')}
                      className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-[#1B3326] file:text-white" 
                    />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#1B3326] transition">
                    <FileText className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs font-bold text-gray-700">DNI Ambos Lados</p>
                    <p className="text-[11px] text-gray-400 mb-2">Foto clara o PDF legible</p>
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e, 'dniBase64')}
                      className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-[#1B3326] file:text-white" 
                    />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#1B3326] transition sm:col-span-2">
                    <FileText className="w-6 h-6 mx-auto text-[#C29F62] mb-2" />
                    <p className="text-xs font-bold text-gray-700">Certijoven / Certificado Único Laboral (CUL)</p>
                    <p className="text-[11px] text-gray-400 mb-2">Descargado de empleosperu.gob.pe (Oficial MTPE)</p>
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e, 'certijovenBase64')}
                      className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-[#C29F62] file:text-white" 
                    />
                  </div>

                  {formData.hasChildren === 'Sí' && (
                    <div className="border-2 border-dashed border-amber-300 bg-amber-50/50 rounded-xl p-4 text-center hover:border-amber-500 transition sm:col-span-2">
                      <FileText className="w-6 h-6 mx-auto text-amber-600 mb-2" />
                      <p className="text-xs font-bold text-gray-700">DNI de los Hijos Menores de 18 años</p>
                      <p className="text-[11px] text-gray-500 mb-2">Requerido para asignación familiar</p>
                      <input 
                        type="file" 
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload(e, 'hijosBase64')}
                        className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-amber-600 file:text-white" 
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleFinishAssessment}
                    disabled={isSubmitting}
                    className="bg-[#1B3326] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#14261C] transition shadow-md flex items-center space-x-2 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Subiendo archivos y registrando...' : 'Finalizar y Enviar Evaluación'}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#C29F62]" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 6 */}
            {step === 6 && (
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 bg-[#1B3326]/10 text-[#1B3326] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-[#1B3326]" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#1B3326]">¡Evaluación Completada con Éxito!</h2>
                  <p className="text-sm text-gray-600 max-w-md mx-auto mt-1">
                    Tu postulación para <strong>{formData.position}</strong> ha sido registrada en el sistema de selección de Sensa People.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                  <div className="p-4 bg-[#F7F5EE] border border-[#E5E0D0] rounded-xl text-center">
                    <p className="text-[11px] font-bold uppercase text-gray-500">Atajos & PC</p>
                    <p className="text-2xl font-black text-[#1B3326] mt-1">{formData.shortcutsScore}%</p>
                  </div>
                  <div className="p-4 bg-[#F7F5EE] border border-[#E5E0D0] rounded-xl text-center">
                    <p className="text-[11px] font-bold uppercase text-gray-500">Lógica & Aptitud</p>
                    <p className="text-2xl font-black text-[#1B3326] mt-1">{formData.psychometricScore}%</p>
                  </div>
                  <div className="p-4 bg-[#F7F5EE] border border-[#E5E0D0] rounded-xl text-center">
                    <p className="text-[11px] font-bold uppercase text-gray-500">Conductual</p>
                    <p className="text-2xl font-black text-[#C29F62] mt-1">{formData.psychologicalScore}%</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-w-md mx-auto text-left text-xs space-y-1 text-gray-600">
                  <p><strong>Postulante:</strong> {formData.fullName}</p>
                  <p><strong>DNI:</strong> {formData.dni}</p>
                  <p><strong>Residencia:</strong> {formData.district} ({formData.address})</p>
                  <p><strong>Carga Familiar:</strong> {formData.hasChildren === 'Sí' ? `${formData.childrenCount} hijo(s) menor(es)` : 'Sin hijos menores'}</p>
                  <p><strong>Estado Legal:</strong> Consentimiento Ley 29733 Aceptado</p>
                </div>

                <div>
                  <a
                    href={`https://wa.me/51967255622?text=Hola%20Sensa%20People,%20completé%20mi%20evaluación%20digital.%20Nombre:%20${encodeURIComponent(formData.fullName)}%20-%20DNI:%20${encodeURIComponent(formData.dni)}%20-%20Distrito:%20${encodeURIComponent(formData.district)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#1B3326] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#14261C] transition shadow"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Notificar al Analista por WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANALISTA */}
        {activeTab === 'interviewer' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E0D0] p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="bg-[#C29F62]/20 text-[#8E7036] text-xs font-bold px-2.5 py-1 rounded-full uppercase">Área de Selección</span>
                <h2 className="text-xl font-bold text-[#1B3326] mt-1">Bandeja de Postulantes en Tiempo Real</h2>
                <p className="text-xs text-gray-500">Datos sincronizados directamente desde tu Base de Google Sheets.</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchCandidates}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition flex items-center space-x-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingCandidates ? 'animate-spin' : ''}`} />
                  <span>Actualizar Lista</span>
                </button>
                <button
                  onClick={handleLogoutAnalyst}
                  className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition flex items-center space-x-1 shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#E5E0D0] p-4 flex items-center space-x-3">
              <Search className="w-4 h-4 text-gray-400 ml-1" />
              <input
                type="text"
                placeholder="Buscar por Nombre, DNI, Distrito o Puesto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* TABLA DE POSTULANTES */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5E0D0] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Postulantes Registrados ({filteredCandidates.length})
                </h3>
                <span className="text-[11px] text-gray-500">Haz clic en un postulante para abrir su ficha y evaluar en Meet</span>
              </div>

              {loadingCandidates ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#1B3326] mb-2" />
                  Cargando postulaciones desde Google Sheets...
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  No hay postulaciones registradas aún en tu hoja de cálculo.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-[#1B3326]/5 text-[#1B3326] uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Postulante</th>
                        <th className="py-3 px-4">Ubicación</th>
                        <th className="py-3 px-4">Puesto</th>
                        <th className="py-3 px-4 text-center">Atajos</th>
                        <th className="py-3 px-4 text-center">Lógica</th>
                        <th className="py-3 px-4 text-center">Conductual</th>
                        <th className="py-3 px-4 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredCandidates.map((cand, idx) => (
                        <tr 
                          key={idx} 
                          onClick={() => {
                            setSelectedCandidate(cand);
                            setSaveSuccessMsg('');
                          }}
                          className={`hover:bg-[#F7F5EE] cursor-pointer transition ${
                            selectedCandidate && selectedCandidate.dni === cand?.dni ? 'bg-amber-50/80 font-medium' : ''
                          }`}
                        >
                          <td className="py-3 px-4 text-[11px] text-gray-500 whitespace-nowrap">
                            {cand?.fecha ? cand.fecha.toString().substring(0, 10) : 'Reciente'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#1B3326]">{cand?.fullName || 'Sin nombre'}</div>
                            <div className="text-[11px] text-gray-500">DNI: {cand?.dni || '-'} | Cel: {cand?.phone || '-'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-gray-800">{cand?.district || 'No especificado'}</div>
                            <div className="text-[10px] text-gray-500 truncate max-w-[150px]">{cand?.address || ''}</div>
                          </td>
                          <td className="py-3 px-4 text-[11px] text-gray-600">{cand?.position || '-'}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-800">
                              {cand?.shortcutsScore ?? 0}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800">
                              {cand?.psychometricScore ?? 0}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800">
                              {cand?.psychologicalScore ?? 0}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCandidate(cand);
                                setSaveSuccessMsg('');
                              }}
                              className="px-2.5 py-1 rounded bg-[#1B3326] text-white text-[11px] font-semibold hover:bg-[#14261C] transition inline-flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Evaluar</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* FICHA DETALLADA Y SCORECARD DE ENTREVISTA EN VIVO */}
            {selectedCandidate && (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-[#1B3326]/30 p-6 sm:p-8 space-y-6">
                
                {/* Cabecera */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <span className="bg-[#1B3326] text-[#C29F62] text-[10px] font-bold px-2 py-0.5 rounded uppercase">Expediente Activo</span>
                    <h3 className="text-2xl font-bold text-[#1B3326] mt-1">{selectedCandidate?.fullName || 'Postulante'}</h3>
                    <p className="text-xs text-gray-500">
                      DNI: <strong>{selectedCandidate?.dni || '-'}</strong> | Celular: <strong>{selectedCandidate?.phone || '-'}</strong> | Correo: <strong>{selectedCandidate?.email || '-'}</strong>
                    </p>
                    <p className="text-xs text-[#1B3326] font-medium mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C29F62]" /> 
                      <strong>Distrito:</strong> {selectedCandidate?.district || 'No especificado'} &nbsp;|&nbsp; <strong>Dirección:</strong> {selectedCandidate?.address || 'No especificada'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${selectedCandidate?.phone ? selectedCandidate.phone.toString().replace(/[^0-9]/g, '') : ''}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:opacity-90 transition flex items-center space-x-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="px-3 py-1.5 rounded-lg border text-xs text-gray-500 hover:bg-gray-50 transition"
                    >
                      Cerrar Ficha
                    </button>
                  </div>
                </div>

                {/* Resumen de Notas */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl border text-center">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Atajos / PC</span>
                    <p className="text-xl font-black text-[#1B3326]">{selectedCandidate?.shortcutsScore ?? 0}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border text-center">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Lógica Universal</span>
                    <p className="text-xl font-black text-blue-900">{selectedCandidate?.psychometricScore ?? 0}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border text-center">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Perfil Conductual</span>
                    <p className="text-xl font-black text-[#C29F62]">{selectedCandidate?.psychologicalScore ?? 0}%</p>
                  </div>
                  <div className="p-3 bg-[#F7F5EE] rounded-xl border text-center">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Hijos Menores</span>
                    <p className="text-sm font-bold text-gray-800 mt-1">
                      {selectedCandidate?.hasChildren === 'Sí' ? `${selectedCandidate.childrenCount} hijo(s)` : 'Sin hijos'}
                    </p>
                  </div>
                </div>

                {/* Documentos Adjuntos */}
                <div className="border-t pt-4">
                  <h4 className="text-xs font-bold text-[#1B3326] uppercase tracking-wider mb-3">
                    Documentos y Expediente del Postulante
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedCandidate?.cvUrl && selectedCandidate.cvUrl.toString().startsWith('http') ? (
                      <a 
                        href={selectedCandidate.cvUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 border rounded-xl bg-gray-50 hover:bg-[#1B3326]/5 flex items-center justify-between transition text-xs font-semibold text-[#1B3326]"
                      >
                        <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#1B3326]" /> Ver Currículum (CV)</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                      </a>
                    ) : (
                      <div className="p-3 border rounded-xl bg-gray-50 text-xs text-gray-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-gray-400" /> CV: No disponible
                      </div>
                    )}

                    {selectedCandidate?.dniUrl && selectedCandidate.dniUrl.toString().startsWith('http') ? (
                      <a 
                        href={selectedCandidate.dniUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 border rounded-xl bg-gray-50 hover:bg-[#1B3326]/5 flex items-center justify-between transition text-xs font-semibold text-[#1B3326]"
                      >
                        <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#1B3326]" /> Ver DNI (Ambos Lados)</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                      </a>
                    ) : (
                      <div className="p-3 border rounded-xl bg-gray-50 text-xs text-gray-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-gray-400" /> DNI: No disponible
                      </div>
                    )}

                    {selectedCandidate?.certijovenUrl && selectedCandidate.certijovenUrl.toString().startsWith('http') ? (
                      <a 
                        href={selectedCandidate.certijovenUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 border rounded-xl bg-gray-50 hover:bg-[#1B3326]/5 flex items-center justify-between transition text-xs font-semibold text-[#C29F62]"
                      >
                        <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#C29F62]" /> Ver Certijoven / CUL</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                      </a>
                    ) : (
                      <div className="p-3 border rounded-xl bg-gray-50 text-xs text-gray-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-gray-400" /> Certijoven: No disponible
                      </div>
                    )}
                  </div>
                </div>

                {/* DATOS DEL ANALISTA & FECHA DE EVALUACIÓN */}
                <div className="bg-[#1B3326]/5 p-4 rounded-xl border border-[#1B3326]/20">
                  <h4 className="text-xs font-bold text-[#1B3326] uppercase tracking-wider mb-3">
                    Datos del Evaluador (Analista de Sensa)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#1B3326]" /> Nombre y Apellido del Analista *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Ana Pérez Mendoza"
                        value={evaluatorName}
                        onChange={(e) => setEvaluatorName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1B3326] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#1B3326]" /> Fecha y Hora de la Evaluación
                      </label>
                      <input
                        type="text"
                        value={evalDate}
                        onChange={(e) => setEvalDate(e.target.value)}
                        className="w-full p-2.5 bg-gray-100 border border-gray-300 rounded-lg text-xs text-gray-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SCORECARD UNIVERSAL (APTO PARA CUALQUIER CARGO) */}
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-xs font-bold text-[#1B3326] uppercase tracking-wider">
                    Scorecard de Calificación en Vivo (Entrevista Meet)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 border rounded-xl bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-700">1. Comunicación & Articulación</span>
                        <select 
                          value={star1}
                          onChange={(e) => setStar1(e.target.value)}
                          className="text-xs border rounded p-1 font-bold text-[#C29F62] bg-white"
                        >
                          <option>★★★★★ (Excelente)</option>
                          <option>★★★★☆ (Muy Bueno)</option>
                          <option>★★★☆☆ (Aceptable)</option>
                          <option>★★☆☆☆ (Deficiente)</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-gray-500">Claridad de ideas, seguridad, escucha activa y dicción.</p>
                    </div>

                    <div className="p-3 border rounded-xl bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-700">2. Resolución de Problemas (STAR)</span>
                        <select 
                          value={star2}
                          onChange={(e) => setStar2(e.target.value)}
                          className="text-xs border rounded p-1 font-bold text-[#C29F62] bg-white"
                        >
                          <option>★★★★★ (Excelente)</option>
                          <option>★★★★☆ (Muy Bueno)</option>
                          <option>★★★☆☆ (Aceptable)</option>
                          <option>★★☆☆☆ (Deficiente)</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-gray-500">Capacidad para afrontar situaciones críticas y lograr soluciones.</p>
                    </div>

                    <div className="p-3 border rounded-xl bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-700">3. Tolerancia a la Presión</span>
                        <select 
                          value={star3}
                          onChange={(e) => setStar3(e.target.value)}
                          className="text-xs border rounded p-1 font-bold text-[#C29F62] bg-white"
                        >
                          <option>★★★★★ (Excelente)</option>
                          <option>★★★★☆ (Muy Bueno)</option>
                          <option>★★★☆☆ (Aceptable)</option>
                          <option>★★☆☆☆ (Deficiente)</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-gray-500">Manejo emocional frente a cargas laborales altas o cambios imprevistos.</p>
                    </div>

                    <div className="p-3 border rounded-xl bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-700">4. Compromiso & Motivación</span>
                        <select 
                          value={star4}
                          onChange={(e) => setStar4(e.target.value)}
                          className="text-xs border rounded p-1 font-bold text-[#C29F62] bg-white"
                        >
                          <option>★★★★★ (Excelente)</option>
                          <option>★★★★☆ (Muy Bueno)</option>
                          <option>★★★☆☆ (Aceptable)</option>
                          <option>★★☆☆☆ (Deficiente)</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-gray-500">Interés genuino en el puesto, conformidad con horarios y metas.</p>
                    </div>
                  </div>
                </div>

                {/* Dictamen del Analista */}
                <div className="space-y-2 border-t pt-4">
                  <label className="block text-xs font-bold uppercase text-gray-600">Dictamen Final del Analista</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      type="button"
                      onClick={() => setDictamen('Aprobado para Terna')}
                      className={`py-2.5 text-xs font-bold rounded-lg border-2 transition ${
                        dictamen === 'Aprobado para Terna'
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow'
                          : 'border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      ✓ Aprobado para Terna
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDictamen('Banco de Reserva')}
                      className={`py-2.5 text-xs font-bold rounded-lg border-2 transition ${
                        dictamen === 'Banco de Reserva'
                          ? 'border-amber-500 bg-amber-500 text-white shadow'
                          : 'border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      ⚠ Banco de Reserva
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDictamen('Descartado')}
                      className={`py-2.5 text-xs font-bold rounded-lg border-2 transition ${
                        dictamen === 'Descartado'
                          ? 'border-red-600 bg-red-600 text-white shadow'
                          : 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      ✕ Descartado
                    </button>
                  </div>
                </div>

                {/* Notas Ejecutivas */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Notas Ejecutivas & Observaciones de Condiciones
                  </label>
                  <textarea 
                    rows="3" 
                    value={executiveNotes}
                    onChange={(e) => setExecutiveNotes(e.target.value)}
                    placeholder="Ej. Postulante con 2 años de experiencia. Excelente articulación de ideas. Acepta sueldo y horarios; indica disponibilidad inmediata. Certijoven limpio."
                    className="w-full p-3 border rounded-lg text-xs focus:ring-2 focus:ring-[#1B3326]"
                  />
                </div>

                {/* MENSAJE DE CONFIRMACIÓN */}
                {saveSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                {/* BOTÓN OFICIAL DE GUARDAR */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveEvaluation}
                    disabled={isSavingEval}
                    className="bg-[#1B3326] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#14261C] transition shadow-lg flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 text-[#C29F62]" />
                    <span>{isSavingEval ? 'Guardando en Google Sheets...' : 'Guardar Evaluación de Entrevista'}</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}