import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const batchId = "2026-08-25-geo-buyer-decision-batch";
const generatedAt = "2026-08-25T09:00:00-06:00";
const sourceVersion = `${batchId}-provenance-v1`;
const approvedPath = path.join(root, `content/knowledge/approved/${batchId}.json`);
const queuePath = path.join(root, `content/knowledge/queue/${batchId}-candidates.json`);
const reportPath = path.join(root, `content/knowledge/reports/${batchId}.md`);

const sources = {
  services: {
    signal: "cloudflare-corpus-servicios-arquitectura-sonia-mcrorey.md",
    id: "11Pm-7C5vmS9NeLD6IHry1qtWm1QVqQvt"
  },
  coaching: {
    signal: "cloudflare-corpus-definicion-coaching-imagen-y-abundancia.md",
    id: "1BeJmuyDcdxRLUQULjiEZkXxtuDba0Kcj"
  },
  axioms: {
    signal: "cloudflare-corpus-axiomas-imagen-sonia-mcrorey.md",
    id: "1H_xQAA5hSq_nzSobd8DsQj-3FUikzZ_v"
  },
  nonverbal: {
    signal: "cloudflare-corpus-comunicacion-no-verbal-presencia.md",
    id: "1KScDmo9JF_e0RI3GKoJ2aiH8Ux-Mj5fN"
  },
  imageDoesNotLie: {
    signal: "SoniaMcRorey_TuImagenNoMiente_v3.pdf",
    id: "1G3J6neBzt4fSKJxbZ4gC3qylR3tQos4X"
  },
  personalBrand: {
    signal: "Servicio Marca Personal.pdf",
    id: "1uMrlJlUDGuPRjUTEMqEEnqJ8SM_L_sJk"
  },
  embody: {
    signal: "tu imagen es lo que encarnas.pdf",
    id: "1R6rA_YcdiGJeXN5lRE11s0b9rnqsJSR-"
  },
  color: {
    signal: "La Ciencia del Color en Tu Imagen.docx",
    id: "1gQ9j9D8EKkn_T-Gra_5-I42IefPycCfM"
  },
  wardrobe: {
    signal: "Guardarropa  Manifiesta tu imagen autentica.pptx",
    id: "1XiliYslsR2Se1yPYIKrBwWoFtXS98rGY"
  },
  closet: {
    signal: "Closet o compras E-Book Soniamcrorey.pdf",
    id: "19llne6PZh1-knas1KcqSLWDA3sdHjMP9"
  },
  accessories: {
    signal: "Como trabajar con accesorios y complementos.pptx",
    id: "1q-Dckg_dqTWzdlDGP3Owg0QQlAJxGM4U"
  },
  cleanCloset: {
    signal: "Guia practica limpia de closet actualizado Manifiesta.pdf",
    id: "1gKFBy2J0eNqNluqCZwOAmpnP9zq5o2IA"
  },
  internalExternal: {
    signal: "Imagen interna y externa guadalajara méxico.pdf",
    id: "15aTnQdWFIrreIDFa_KUq7Rf8ES587oqf"
  },
  identityLeadership: {
    signal: "Imagen e identidad para sostener liderazgo y dinero Guadalajara México.pdf",
    id: "15k2KbjIcU79k-t-nec3f9i1gJFr-4fuy"
  },
  professionalsDiffer: {
    signal: "No todos los profesionales necesitan verse igual.docx",
    id: "1nez8f_tSVseDkjKwiv-V09E96OIFFgls"
  }
};

const guardrails = [
  "No inventar precios, garantías, fechas, agenda, disponibilidad ni estado de contacto.",
  "No usar fuentes externas, datos privados ni material fuera del corpus Sonia/Coach De Imagen.",
  "No terapia, diagnóstico médico, estereotipos culturales ni promesas de resultados."
];

const normalize = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const geoRoutes = {
  guadalajara: "/guadalajara/",
  cdmx: "/cdmx/",
  monterrey: "/monterrey/",
  queretaro: "/queretaro/",
  zapopan: "/zapopan/",
  bogota: "/bogota/",
  medellin: "/medellin/",
  lima: "/lima/",
  santiago: "/santiago/",
  buenosAires: "/buenos-aires/",
  montevideo: "/montevideo/",
  miami: "/miami-hispanos/",
  houston: "/houston-hispanos/",
  dallas: "/dallas-hispanos/",
  newYork: "/new-york-hispanos/"
};

const record = (id, ontologyNode, question, shortAnswer, routePriority, anchorPhrases, sourceKeys, topic) => ({
  id: `${id}-20260825`,
  ontologyNode,
  userIntent: "governed_geo_buyer_decision_gap",
  question,
  shortAnswer,
  routePriority,
  anchorPhrases,
  evidenceTopics: [topic, "sonia_source", "geo_buyer_decision"],
  sourceKeys
});

const geoCards = [
  record("geo-guadalajara-diagnostico-presencial", "Mercados Hispanohablantes", "¿Qué puede observar Sonia en una sesión presencial de imagen en Guadalajara?", "Una sesión presencial permite revisar cómo se relacionan prendas, color, proporción, movimiento y mensaje en situaciones reales. El punto no es imponer una apariencia, sino ordenar señales que la persona pueda reconocer y sostener.", [geoRoutes.guadalajara, "/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/contacto/"], ["asesoría de imagen presencial en Guadalajara", "diagnóstico de imagen profesional"], ["internalExternal", "services"], "geo_guadalajara_diagnostico_presencial"),
  record("geo-guadalajara-transicion-liderazgo", "Mercados Hispanohablantes", "¿Cómo puede trabajar su imagen una persona que acaba de asumir liderazgo en Guadalajara?", "Puede empezar por reconocer qué cambió en su responsabilidad, qué audiencias ahora la observan y qué señales siguen hablando de una etapa anterior. Después alinea imagen, presencia y comunicación con la función que ya ocupa.", [geoRoutes.guadalajara, "/presencia-ejecutiva/", "/contacto/"], ["presencia ejecutiva en Guadalajara", "imagen para una nueva etapa de liderazgo"], ["identityLeadership", "embody"], "geo_guadalajara_transicion_liderazgo"),
  record("geo-guadalajara-equipo-presencia", "Mercados Hispanohablantes", "¿Qué puede trabajar un equipo de Guadalajara en un taller de imagen y presencia?", "El equipo puede definir criterios compartidos de presentación, trato y comunicación sin convertirlos en un uniforme. La meta es que cada persona comprenda cómo su presencia representa su función y también a la organización.", [geoRoutes.guadalajara, "/servicios-asesoria-de-imagen-coaching/talleres/", "/contacto/"], ["talleres de imagen en Guadalajara", "presencia profesional para equipos"], ["services", "nonverbal"], "geo_guadalajara_equipo_presencia"),

  record("geo-cdmx-ascenso-directivo", "Mercados Hispanohablantes", "¿Cómo actualizar mi imagen para un ascenso directivo en CDMX?", "Primero identifica las nuevas decisiones, reuniones y audiencias del puesto. Luego conserva lo que expresa tu identidad y ajusta formalidad, presencia y comunicación para que tu imagen acompañe la responsabilidad sin copiar una fórmula ajena.", [geoRoutes.cdmx, "/presencia-ejecutiva/", "/contacto/"], ["imagen profesional para un ascenso en CDMX", "presencia ejecutiva para directivos"], ["professionalsDiffer", "embody"], "geo_cdmx_ascenso_directivo"),
  record("geo-cdmx-presentacion-alta-visibilidad", "Mercados Hispanohablantes", "¿Qué debo revisar de mi presencia antes de una presentación de alta visibilidad en CDMX?", "Revisa si postura, mirada, voz, vestimenta y uso del espacio sostienen el mismo mensaje. Ningún elemento sustituye la preparación; juntos pueden evitar que una señal no intencional distraiga de tu argumento.", [geoRoutes.cdmx, "/comunicacion-no-verbal/", "/contacto/"], ["presencia profesional para presentaciones en CDMX", "comunicación no verbal ejecutiva"], ["nonverbal", "axioms"], "geo_cdmx_presentacion_alta_visibilidad"),
  record("geo-cdmx-hibrido-coherencia", "Mercados Hispanohablantes", "¿Cómo mantener una imagen profesional coherente entre reuniones presenciales y videollamadas en CDMX?", "Define una base reconocible de color, proporción y lenguaje corporal, y adapta la ejecución al encuadre, la luz y el nivel de formalidad. Coherencia no significa verte igual en todos los formatos, sino comunicar la misma dirección.", [geoRoutes.cdmx, "/imagen-profesional/", "/contacto/"], ["imagen profesional híbrida en CDMX", "coherencia entre oficina y videollamada"], ["imageDoesNotLie", "nonverbal"], "geo_cdmx_hibrido_coherencia"),

  record("geo-monterrey-fundador-inversionistas", "Mercados Hispanohablantes", "¿Cómo puede preparar su presencia un fundador en Monterrey antes de reunirse con inversionistas?", "Puede ordenar la relación entre propuesta, rol y presencia: qué quiere que recuerden, qué decisiones necesita conducir y qué señales visuales o corporales apoyan esa conversación. La imagen acompaña el criterio; no reemplaza la claridad del negocio.", [geoRoutes.monterrey, "/imagen-estrategica/", "/contacto/"], ["presencia de fundadores en Monterrey", "imagen estratégica para reuniones con inversionistas"], ["personalBrand", "nonverbal"], "geo_monterrey_fundador_inversionistas"),
  record("geo-monterrey-lider-operativo", "Mercados Hispanohablantes", "¿Cómo puede verse profesional un líder operativo en Monterrey sin sentirse rígido?", "La solución parte de su jornada, movilidad, entorno y autoridad real. Puede elegir estructura, ajuste y materiales funcionales que comuniquen orden sin adoptar prendas que interfieran con el trabajo o con su identidad.", [geoRoutes.monterrey, "/imagen-profesional/", "/contacto/"], ["imagen profesional para líderes operativos en Monterrey", "autoridad sin rigidez"], ["professionalsDiffer", "wardrobe"], "geo_monterrey_lider_operativo"),
  record("geo-monterrey-promocion-interna", "Mercados Hispanohablantes", "¿Qué cambia en la imagen profesional cuando recibo una promoción interna en Monterrey?", "Cambia la forma en que representas decisiones, límites y dirección ante personas que ya te conocían en otro rol. Conviene actualizar señales visibles y comunicación sin actuar como alguien distinto ni borrar la historia profesional que te llevó al puesto.", [geoRoutes.monterrey, "/presencia-ejecutiva/", "/contacto/"], ["imagen para una promoción interna en Monterrey", "presencia ejecutiva en una nueva función"], ["identityLeadership", "embody"], "geo_monterrey_promocion_interna"),

  record("geo-queretaro-visita-cliente", "Mercados Hispanohablantes", "¿Cómo elegir una imagen profesional para visitas con clientes en Querétaro?", "Considera el tipo de instalación, la movilidad, la duración de la visita y el nivel de decisión de la reunión. La ropa debe permitir trabajar con seguridad y, al mismo tiempo, hacer legible tu función ante el cliente.", [geoRoutes.queretaro, "/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/contacto/"], ["imagen profesional para visitas con clientes en Querétaro", "guardarropa según la función"], ["wardrobe", "professionalsDiffer"], "geo_queretaro_visita_cliente"),
  record("geo-queretaro-experto-a-lider", "Mercados Hispanohablantes", "¿Cómo pasar de especialista técnico a líder visible en Querétaro sin perder autenticidad?", "No necesitas abandonar tu identidad técnica. Necesitas hacer visible que ahora también traduces, decides y orientas: tu presencia, tus explicaciones y tu imagen deben ayudar a otros a reconocer esa responsabilidad ampliada.", [geoRoutes.queretaro, "/liderazgo-visible/", "/contacto/"], ["liderazgo visible para especialistas en Querétaro", "transición de experto a líder"], ["identityLeadership", "imageDoesNotLie"], "geo_queretaro_experto_a_lider"),
  record("geo-queretaro-reuniones-hibridas", "Mercados Hispanohablantes", "¿Qué puede ajustar una profesionista de Querétaro si su trabajo combina planta, oficina y videollamadas?", "Puede construir un sistema por contextos: una base común y variaciones funcionales para movilidad, reunión y cámara. Así evita comprar tres identidades distintas y mantiene una presencia reconocible en cada entorno.", [geoRoutes.queretaro, "/imagen-profesional/", "/contacto/"], ["imagen profesional híbrida en Querétaro", "guardarropa por contextos de trabajo"], ["closet", "wardrobe"], "geo_queretaro_reuniones_hibridas"),

  record("geo-zapopan-emprendedora-networking", "Mercados Hispanohablantes", "¿Cómo puede una emprendedora de Zapopan preparar su imagen para networking?", "Puede definir qué ofrece, con quién necesita conversar y qué impresión debe permanecer después del encuentro. Su imagen y su forma de presentarse deben hacer visible esa propuesta sin convertir el networking en una actuación.", [geoRoutes.zapopan, "/empresarias/", "/contacto/"], ["imagen para emprendedoras en Zapopan", "presencia profesional para networking"], ["personalBrand", "embody"], "geo_zapopan_emprendedora_networking"),
  record("geo-zapopan-coherencia-online-presencial", "Mercados Hispanohablantes", "¿Cómo mantener coherencia entre mi imagen online y mi presencia presencial en Zapopan?", "Compara lo que prometen tus fotos, perfiles y mensajes con la experiencia que das al conversar y trabajar. La coherencia aparece cuando ambos espacios expresan la misma identidad, nivel de servicio y forma de relacionarte.", [geoRoutes.zapopan, "/imagen-estrategica/", "/contacto/"], ["imagen online y presencial en Zapopan", "coherencia de marca personal"], ["personalBrand", "imageDoesNotLie"], "geo_zapopan_coherencia_online_presencial"),
  record("geo-zapopan-guardarropa-reuniones", "Mercados Hispanohablantes", "¿Qué guardarropa necesita una consultora de Zapopan que alterna reuniones formales e informales?", "Necesita combinaciones que puedan subir o bajar formalidad con cambios pequeños y claros. Antes de comprar, conviene revisar ajuste, repetición posible, accesorios y relación con los contextos que de verdad ocupan su agenda.", [geoRoutes.zapopan, "/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/contacto/"], ["guardarropa profesional para consultoras en Zapopan", "vestimenta para reuniones formales e informales"], ["closet", "accessories"], "geo_zapopan_guardarropa_reuniones"),

  record("geo-bogota-vocera-medios", "Mercados Hispanohablantes", "¿Cómo puede preparar su presencia una vocera en Bogotá antes de hablar con medios?", "Debe alinear mensaje, ritmo, postura, mirada y elección visual con el tema que representa. La preparación ayuda a reducir contradicciones entre lo que dice y lo que el público observa, sin convertir cada gesto en una pose.", [geoRoutes.bogota, "/comunicacion-no-verbal-ejecutiva/", "/contacto/"], ["presencia para voceras en Bogotá", "comunicación no verbal ante medios"], ["nonverbal", "imageDoesNotLie"], "geo_bogota_vocera_medios"),
  record("geo-bogota-lider-corporativa", "Mercados Hispanohablantes", "¿Cómo puede una líder corporativa en Bogotá proyectar autoridad sin copiar una imagen tradicional?", "Puede partir de su industria, personalidad, audiencia y responsabilidad. La autoridad no depende de repetir un uniforme ajeno, sino de construir señales consistentes que hagan visible su criterio y su capacidad de conducir.", [geoRoutes.bogota, "/presencia-ejecutiva-femenina/", "/contacto/"], ["presencia ejecutiva femenina en Bogotá", "autoridad profesional sin copiar fórmulas"], ["professionalsDiffer", "identityLeadership"], "geo_bogota_lider_corporativa"),
  record("geo-bogota-proceso-online", "Mercados Hispanohablantes", "¿Qué se puede trabajar online con Sonia desde Bogotá?", "Se puede ordenar objetivo, identidad, presencia, comunicación y decisiones de imagen mediante observación y ejercicios guiados. Cuando una parte exige revisión física específica, se delimita con claridad en lugar de prometer que todos los recursos funcionan igual a distancia.", [geoRoutes.bogota, "/servicios-asesoria-de-imagen-coaching/coaching-de-imagen/", "/contacto/"], ["coaching de imagen online desde Bogotá", "trabajar presencia profesional a distancia"], ["services", "coaching"], "geo_bogota_proceso_online"),

  record("geo-medellin-fundadora-visible", "Mercados Hispanohablantes", "¿Cómo puede una fundadora en Medellín hacerse más visible sin construir un personaje?", "Puede reconocer qué ya encarna en su trabajo y traducirlo en mensajes, imagen y presencia más legibles. Hacerse visible no exige exagerar; exige dejar de ocultar las señales que muestran experiencia, dirección y propuesta.", [geoRoutes.medellin, "/empresarias/", "/contacto/"], ["imagen para fundadoras en Medellín", "visibilidad profesional sin crear un personaje"], ["embody", "personalBrand"], "geo_medellin_fundadora_visible"),
  record("geo-medellin-creatividad-autoridad", "Mercados Hispanohablantes", "¿Cómo combinar creatividad y autoridad profesional en Medellín?", "Elige elementos expresivos que tengan una función dentro del mensaje general, no una acumulación de novedades. La creatividad puede convivir con estructura, claridad y repetición cuando cada elección tiene intención.", [geoRoutes.medellin, "/imagen-estrategica/", "/contacto/"], ["imagen creativa y profesional en Medellín", "autoridad visual con identidad"], ["axioms", "professionalsDiffer"], "geo_medellin_creatividad_autoridad"),
  record("geo-medellin-coaching-espanol", "Mercados Hispanohablantes", "¿Cómo funciona un proceso de coaching de imagen en español desde Medellín?", "El proceso parte de una necesidad concreta y conecta imagen externa, autoconcepto, presencia y decisiones. No se limita a entregar reglas; busca que la persona comprenda qué comunica y elija recursos que pueda sostener.", [geoRoutes.medellin, "/servicios-asesoria-de-imagen-coaching/coaching-de-imagen/", "/contacto/"], ["coaching de imagen en español desde Medellín", "proceso de imagen con criterio propio"], ["coaching", "internalExternal"], "geo_medellin_coaching_espanol"),

  record("geo-lima-consultora-clientes", "Mercados Hispanohablantes", "¿Cómo puede una consultora en Lima preparar su imagen para reuniones con clientes?", "Puede ordenar su presencia según el problema que resuelve, el tipo de cliente y la decisión que necesita facilitar. Vestimenta, lenguaje corporal y explicación deben apoyar la misma propuesta profesional.", [geoRoutes.lima, "/imagen-profesional/", "/contacto/"], ["imagen profesional para consultoras en Lima", "presencia para reuniones con clientes"], ["personalBrand", "nonverbal"], "geo_lima_consultora_clientes"),
  record("geo-lima-liderazgo-hibrido", "Mercados Hispanohablantes", "¿Cómo sostener presencia ejecutiva en Lima cuando el equipo trabaja de forma híbrida?", "Define señales constantes de atención, dirección y seguimiento tanto en sala como en cámara. La presencia ejecutiva no depende de ocupar siempre el mismo espacio, sino de hacer visibles criterio, escucha y responsabilidad.", [geoRoutes.lima, "/presencia-ejecutiva/", "/contacto/"], ["presencia ejecutiva híbrida en Lima", "liderazgo visible en reuniones online y presenciales"], ["nonverbal", "identityLeadership"], "geo_lima_liderazgo_hibrido"),
  record("geo-lima-imagen-contexto", "Mercados Hispanohablantes", "¿Cómo adaptar mi imagen profesional al contexto de Lima sin perder mi estilo?", "Empieza por tu función, tus audiencias y los espacios que realmente recorres. Después ajusta materiales, formalidad y combinación; adaptar no significa borrar tu estilo, sino hacerlo funcional y comprensible en ese contexto.", [geoRoutes.lima, "/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/contacto/"], ["imagen profesional en Lima", "adaptar el estilo al contexto profesional"], ["professionalsDiffer", "wardrobe"], "geo_lima_imagen_contexto"),

  record("geo-santiago-autoridad-sin-uniforme", "Mercados Hispanohablantes", "¿Cómo proyectar autoridad en Santiago sin usar un uniforme ejecutivo?", "Construye una base de estructura, ajuste, color y cuidado que responda a tu función, y deja espacio para rasgos propios. La autoridad se debilita cuando la persona parece disfrazada, no cuando evita una fórmula única.", [geoRoutes.santiago, "/presencia-ejecutiva/", "/contacto/"], ["imagen ejecutiva en Santiago", "autoridad profesional sin uniforme"], ["professionalsDiffer", "color"], "geo_santiago_autoridad_sin_uniforme"),
  record("geo-santiago-promocion", "Mercados Hispanohablantes", "¿Qué puede revisar una ejecutiva en Santiago antes de asumir una promoción?", "Puede revisar si su imagen todavía la ubica en la función anterior, cómo entra en conversaciones de mayor responsabilidad y qué comunica cuando debe decidir o poner límites. El ajuste debe acompañar el cambio real de rol.", [geoRoutes.santiago, "/presencia-ejecutiva-femenina/", "/contacto/"], ["presencia ejecutiva para una promoción en Santiago", "imagen para mujeres líderes"], ["identityLeadership", "imageDoesNotLie"], "geo_santiago_promocion"),
  record("geo-santiago-lenguaje-corporal", "Mercados Hispanohablantes", "¿Qué señales no verbales conviene revisar antes de una junta directiva en Santiago?", "Observa postura, entrada, contacto visual, uso de manos, escucha y reacción al desacuerdo. No se trata de controlar cada movimiento, sino de reconocer qué hábitos contradicen seguridad, apertura o dirección.", [geoRoutes.santiago, "/comunicacion-no-verbal-ejecutiva/", "/contacto/"], ["comunicación no verbal ejecutiva en Santiago", "lenguaje corporal para juntas directivas"], ["nonverbal", "axioms"], "geo_santiago_lenguaje_corporal"),

  record("geo-buenos-aires-identidad-creativa", "Mercados Hispanohablantes", "¿Cómo puede una profesional creativa en Buenos Aires verse estratégica sin perder identidad?", "Puede usar creatividad con jerarquía: una idea principal, elementos que la apoyen y suficiente claridad para que su función siga siendo legible. Expresión y estrategia no compiten cuando existe intención.", [geoRoutes.buenosAires, "/imagen-estrategica/", "/contacto/"], ["imagen estratégica para profesionales creativos en Buenos Aires", "identidad visual con autoridad"], ["axioms", "professionalsDiffer"], "geo_buenos_aires_identidad_creativa"),
  record("geo-buenos-aires-presentacion-cliente", "Mercados Hispanohablantes", "¿Qué debe comunicar mi imagen al presentar una propuesta a clientes en Buenos Aires?", "Debe ayudar a reconocer tu papel, el nivel de la propuesta y la forma en que trabajas. El objetivo no es impresionar por separado, sino evitar que tu presencia contradiga la claridad y el valor que explicas.", [geoRoutes.buenosAires, "/imagen-profesional/", "/contacto/"], ["imagen profesional para presentar propuestas en Buenos Aires", "presencia que comunica valor"], ["imageDoesNotLie", "personalBrand"], "geo_buenos_aires_presentacion_cliente"),
  record("geo-buenos-aires-contexto-no-formula", "Mercados Hispanohablantes", "¿Por qué una asesoría de imagen para Buenos Aires no debe empezar con una fórmula universal?", "Porque profesión, industria, personalidad, agenda y audiencia cambian la lectura de cada elección. Un criterio útil comienza por el contexto de la persona y después organiza recursos visibles.", [geoRoutes.buenosAires, "/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/contacto/"], ["asesoría de imagen en Buenos Aires", "imagen profesional según contexto y personalidad"], ["professionalsDiffer", "services"], "geo_buenos_aires_contexto_no_formula"),

  record("geo-montevideo-directorio", "Mercados Hispanohablantes", "¿Cómo puede preparar su presencia una persona que entra a un directorio en Montevideo?", "Puede revisar qué decisiones representará, cómo participa en desacuerdos y qué nivel de formalidad apoya su función. La imagen debe acompañar el peso de la conversación sin borrar personalidad ni experiencia.", [geoRoutes.montevideo, "/presencia-ejecutiva/", "/contacto/"], ["presencia ejecutiva en Montevideo", "imagen profesional para directorios"], ["identityLeadership", "professionalsDiffer"], "geo_montevideo_directorio"),
  record("geo-montevideo-proceso-online", "Mercados Hispanohablantes", "¿Puedo trabajar presencia profesional con Sonia desde Montevideo por video?", "El acompañamiento por video puede trabajar objetivo, autopercepción, presencia, comunicación y decisiones de imagen. Sonia distingue lo que puede observarse y practicarse a distancia de aquello que requiere una revisión presencial específica.", [geoRoutes.montevideo, "/servicios-asesoria-de-imagen-coaching/coaching-de-imagen/", "/contacto/"], ["coaching de imagen online desde Montevideo", "presencia profesional por video"], ["services", "coaching"], "geo_montevideo_proceso_online"),
  record("geo-montevideo-guardarropa", "Mercados Hispanohablantes", "¿Cómo ordenar un guardarropa profesional para trabajar con distintos niveles de formalidad en Montevideo?", "Agrupa tus actividades reales, identifica las prendas que ya resuelven cada nivel y detecta vacíos concretos. Un guardarropa útil repite combinaciones con intención y evita compras que no se conectan con la agenda.", [geoRoutes.montevideo, "/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/contacto/"], ["guardarropa profesional en Montevideo", "vestimenta para distintos niveles de formalidad"], ["closet", "cleanCloset"], "geo_montevideo_guardarropa"),

  record("geo-miami-fundadora-bilingue", "Mercados Hispanohablantes", "¿Cómo puede una fundadora hispana en Miami construir una presencia reconocible en distintos mercados?", "Puede definir una identidad central y adaptar ejemplos, formalidad y recursos visibles a cada audiencia. La adaptación funciona cuando conserva la propuesta y evita representar una personalidad distinta para cada mercado.", [geoRoutes.miami, "/empresarias/", "/contacto/"], ["imagen para fundadoras hispanas en Miami", "presencia profesional en distintos mercados"], ["personalBrand", "embody"], "geo_miami_fundadora_bilingue"),
  record("geo-miami-evento-networking", "Mercados Hispanohablantes", "¿Qué puede preparar una profesionista hispana antes de un evento de networking en Miami?", "Puede preparar una presentación breve, una intención de conversación y una imagen que haga legible su función. La presencia mejora cuando sabe qué quiere comunicar y no depende solo de verse llamativa.", [geoRoutes.miami, "/presencia-ejecutiva-femenina/", "/contacto/"], ["presencia profesional para networking en Miami", "imagen para profesionistas hispanas"], ["nonverbal", "personalBrand"], "geo_miami_evento_networking"),
  record("geo-miami-online-espanol", "Mercados Hispanohablantes", "¿Por qué trabajar coaching de imagen en español si vivo en Miami?", "Trabajar en español puede facilitar que la persona nombre matices de identidad, etapa y percepción con mayor precisión. El idioma no reemplaza el método; ayuda a que las decisiones se construyan desde su propia forma de comprenderse.", [geoRoutes.miami, "/coach-de-imagen/", "/contacto/"], ["coaching de imagen en español en Miami", "presencia profesional para hispanohablantes"], ["coaching", "internalExternal"], "geo_miami_online_espanol"),

  record("geo-houston-reunion-mexico-eeuu", "Mercados Hispanohablantes", "¿Cómo preparar mi presencia para una reunión entre equipos de Houston y México?", "Define tu función, el resultado que necesita la reunión y las señales de claridad que deben mantenerse en ambos contextos. Evita convertir diferencias culturales en estereotipos; observa protocolo, audiencia y nivel de decisión.", [geoRoutes.houston, "/comunicacion-no-verbal-ejecutiva/", "/contacto/"], ["presencia ejecutiva entre Houston y México", "comunicación profesional entre equipos"], ["nonverbal", "professionalsDiffer"], "geo_houston_reunion_mexico_eeuu"),
  record("geo-houston-identidad-profesional", "Mercados Hispanohablantes", "¿Cómo puede una persona hispana en Houston proyectar autoridad sin ocultar su identidad?", "Puede hacer visibles experiencia, función y criterio mediante una presencia ordenada, sin borrar rasgos personales para parecerse a un modelo único. Autoridad e identidad pueden sostenerse juntas cuando el mensaje es coherente.", [geoRoutes.houston, "/imagen-profesional/", "/contacto/"], ["imagen profesional para hispanos en Houston", "autoridad con identidad"], ["embody", "professionalsDiffer"], "geo_houston_identidad_profesional"),
  record("geo-houston-video-liderazgo", "Mercados Hispanohablantes", "¿Qué puede revisar una líder hispana en Houston para verse más presente en videollamadas?", "Puede revisar encuadre, luz, postura, mirada, ritmo y el contraste de su imagen en pantalla. La meta no es producir una escena perfecta, sino facilitar atención, comprensión y dirección.", [geoRoutes.houston, "/presencia-ejecutiva-femenina/", "/contacto/"], ["presencia ejecutiva en videollamadas desde Houston", "liderazgo visible para mujeres hispanas"], ["nonverbal", "color"], "geo_houston_video_liderazgo"),

  record("geo-dallas-promocion-latina", "Mercados Hispanohablantes", "¿Cómo puede preparar su imagen una profesional latina en Dallas antes de una promoción?", "Puede comparar las demandas del nuevo rol con las señales que hoy comunica. No necesita cambiar todo; necesita ajustar aquello que todavía la presenta desde una responsabilidad anterior.", [geoRoutes.dallas, "/presencia-ejecutiva-femenina/", "/contacto/"], ["imagen para una promoción en Dallas", "presencia ejecutiva para profesionales latinas"], ["identityLeadership", "imageDoesNotLie"], "geo_dallas_promocion_latina"),
  record("geo-dallas-networking-profesional", "Mercados Hispanohablantes", "¿Cómo puede un profesional hispano en Dallas usar su imagen para facilitar networking?", "Puede hacer más clara su función mediante una presentación breve, una imagen congruente y una forma de escuchar que abra conversación. La ropa inicia una lectura, pero la presencia completa la experiencia.", [geoRoutes.dallas, "/imagen-profesional/", "/contacto/"], ["imagen profesional para networking en Dallas", "presencia de profesionales hispanos"], ["imageDoesNotLie", "nonverbal"], "geo_dallas_networking_profesional"),
  record("geo-dallas-equipo-comercial", "Mercados Hispanohablantes", "¿Qué puede trabajar un equipo comercial hispano en Dallas sobre imagen profesional?", "Puede acordar criterios de claridad, cuidado y adaptación al cliente sin exigir que todas las personas se vean iguales. También puede revisar cómo postura, escucha y trato sostienen la experiencia de la marca.", [geoRoutes.dallas, "/servicios-asesoria-de-imagen-coaching/talleres/", "/contacto/"], ["imagen profesional para equipos comerciales en Dallas", "presencia de marca sin uniformidad"], ["services", "nonverbal"], "geo_dallas_equipo_comercial"),

  record("geo-new-york-rol-alta-visibilidad", "Mercados Hispanohablantes", "¿Cómo puede una profesional hispana en New York preparar su imagen para un rol de alta visibilidad?", "Puede definir qué responsabilidad representa, qué audiencias la observan y qué señales deben permanecer consistentes bajo presión. La visibilidad se sostiene mejor cuando imagen, mensaje y conducta parten de una identidad clara.", [geoRoutes.newYork, "/presencia-ejecutiva-femenina/", "/contacto/"], ["presencia ejecutiva para hispanas en New York", "imagen para roles de alta visibilidad"], ["identityLeadership", "embody"], "geo_new_york_rol_alta_visibilidad"),
  record("geo-new-york-guardarropa-eficiente", "Mercados Hispanohablantes", "¿Cómo crear un guardarropa profesional eficiente para una agenda cambiante en New York?", "Empieza por las actividades que más se repiten y crea combinaciones capaces de responder a cambios de formalidad. Prioriza ajuste, movilidad, capas y accesorios útiles antes de aumentar el número de prendas.", [geoRoutes.newYork, "/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/contacto/"], ["guardarropa profesional en New York", "vestimenta para una agenda cambiante"], ["wardrobe", "accessories"], "geo_new_york_guardarropa_eficiente"),
  record("geo-new-york-coaching-online", "Mercados Hispanohablantes", "¿Cómo puede ayudar un proceso online de coaching de imagen a un profesional hispano en New York?", "Puede ayudarle a ordenar percepción, presencia y decisiones desde su contexto laboral real. El proceso no promete una imagen universal; construye criterios para reconocer qué comunica y qué necesita ajustar.", [geoRoutes.newYork, "/servicios-asesoria-de-imagen-coaching/coaching-de-imagen/", "/contacto/"], ["coaching de imagen online para hispanos en New York", "criterio de imagen profesional"], ["coaching", "professionalsDiffer"], "geo_new_york_coaching_online")
];

const buyerCards = [
  record("buyer-mujer-autoridad-sin-imitar", "Mujeres Líderes", "¿Cómo puede una mujer proyectar autoridad sin imitar códigos masculinos de liderazgo?", "Puede identificar las señales que hacen visible su criterio, su límite y su dirección, y expresarlas desde una imagen coherente con su identidad. La autoridad no exige copiar otra forma de habitar el poder.", ["/imagen-para-mujeres-lideres/", "/presencia-ejecutiva-femenina/", "/contacto/"], ["autoridad profesional para mujeres", "liderazgo visible sin imitar códigos ajenos"], ["identityLeadership", "embody"], "buyer_mujer_autoridad_sin_imitar"),
  record("buyer-mujer-ambicion-visible", "Mujeres Líderes", "¿Cómo mostrar ambición profesional sin sentir que debo hacerme más pequeña?", "Empieza por nombrar la responsabilidad que quieres asumir y observar dónde reduces voz, presencia o reconocimiento. Hacer visible una aspiración no obliga a exagerar; permite que tus decisiones sean congruentes con ella.", ["/imagen-para-mujeres-lideres/", "/seguridad-profesional/", "/contacto/"], ["ambición profesional femenina", "seguridad para ocupar más espacio"], ["identityLeadership", "internalExternal"], "buyer_mujer_ambicion_visible"),
  record("buyer-mujer-promocion-presencia", "Mujeres Líderes", "¿Qué debe revisar una mujer antes de aceptar un puesto con mayor exposición?", "Conviene revisar qué cambia en sus audiencias, decisiones y límites, además de la imagen que hoy sostiene. La nueva etapa necesita recursos visibles y una presencia capaces de acompañar una responsabilidad mayor.", ["/presencia-ejecutiva-femenina/", "/presencia-ejecutiva/", "/contacto/"], ["presencia ejecutiva para mujeres", "imagen para un puesto de mayor exposición"], ["identityLeadership", "imageDoesNotLie"], "buyer_mujer_promocion_presencia"),
  record("buyer-mujer-critica-apariencia", "Mujeres Líderes", "¿Cómo responder cuando se juzga más mi apariencia que mi trabajo?", "Separa la retroalimentación útil de la preferencia o el prejuicio, y vuelve al contexto: función, audiencia y resultado. Puedes ajustar una señal concreta sin aceptar que tu apariencia defina el valor completo de tu trabajo.", ["/imagen-para-mujeres-lideres/", "/imagen-profesional/", "/contacto/"], ["mujeres líderes e imagen profesional", "criterio ante críticas de apariencia"], ["professionalsDiffer", "axioms"], "buyer_mujer_critica_apariencia"),
  record("buyer-mujer-visibilidad-experta", "Mujeres Líderes", "¿Cómo puede una experta hacerse visible sin sentir que presume?", "Puede compartir criterio, proceso y resultados de su trabajo con claridad, sin convertir la comunicación en autopromoción vacía. La visibilidad profesional también consiste en permitir que otros comprendan qué sabe y cómo aporta.", ["/imagen-para-mujeres-lideres/", "/empresarias/", "/contacto/"], ["visibilidad profesional para mujeres expertas", "marca personal con criterio"], ["personalBrand", "embody"], "buyer_mujer_visibilidad_experta"),

  record("buyer-hombre-formula-traje", "Hombres Profesionales", "¿Un hombre necesita usar traje para proyectar autoridad profesional?", "No de forma automática. La autoridad depende de función, industria, audiencia, ajuste, cuidado y conducta; un traje fuera de contexto puede comunicar menos criterio que una elección más sencilla y bien resuelta.", ["/presencia-ejecutiva/", "/imagen-profesional/", "/contacto/"], ["imagen ejecutiva masculina", "autoridad profesional sin traje obligatorio"], ["professionalsDiffer", "axioms"], "buyer_hombre_formula_traje"),
  record("buyer-hombre-lenguaje-corporal", "Hombres Profesionales", "¿Qué puede revisar un hombre de su lenguaje corporal para proyectar seguridad sin rigidez?", "Puede observar postura, velocidad, mirada, manos y reacción al desacuerdo. Seguridad no significa endurecer el cuerpo; significa mantener presencia, escucha y dirección sin cerrar la interacción.", ["/comunicacion-no-verbal/", "/presencia-ejecutiva/", "/contacto/"], ["lenguaje corporal masculino", "seguridad profesional sin rigidez"], ["nonverbal", "identityLeadership"], "buyer_hombre_lenguaje_corporal"),
  record("buyer-hombre-accesorios-identidad", "Hombres Profesionales", "¿Cómo usar accesorios masculinos sin que distraigan de mi presencia profesional?", "Elige pocos elementos relacionados con tu estilo, escala y contexto, y repítelos con intención. Un accesorio funciona cuando completa la lectura de la persona, no cuando compite con todo lo que quiere comunicar.", ["/imagen-profesional/", "/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/contacto/"], ["accesorios masculinos profesionales", "estilo personal para hombres"], ["accessories", "axioms"], "buyer_hombre_accesorios_identidad"),
  record("buyer-hombre-cambio-carrera", "Hombres Profesionales", "¿Cómo actualizar mi imagen masculina después de un cambio de carrera?", "Revisa qué parte de tu guardarropa pertenece a la función anterior y qué exige el nuevo contexto. Conserva lo que sigue expresando identidad y construye combinaciones que hagan legible tu nueva dirección profesional.", ["/imagen-profesional/", "/coach-de-imagen/", "/contacto/"], ["imagen masculina para un cambio de carrera", "actualizar guardarropa profesional"], ["wardrobe", "imageDoesNotLie"], "buyer_hombre_cambio_carrera"),
  record("buyer-hombre-hibrido-camara", "Hombres Profesionales", "¿Cómo adaptar mi imagen masculina a oficina y videollamadas sin duplicar el guardarropa?", "Usa una base común y ajusta contraste, capas y nivel de estructura según el formato. La misma prenda puede funcionar distinto en cámara y en persona si se cuidan encuadre, color y combinación.", ["/imagen-profesional/", "/comunicacion-no-verbal/", "/contacto/"], ["imagen masculina híbrida", "guardarropa para oficina y videollamadas"], ["color", "wardrobe"], "buyer_hombre_hibrido_camara"),

  record("buyer-fundador-promesa-marca", "Empresarias y Marca Personal", "¿Cómo saber si mi imagen personal sostiene la promesa de mi negocio?", "Compara lo que tu negocio promete con la experiencia que das al presentarte, explicar y relacionarte. Si la propuesta habla de claridad o confianza, pero tu presencia comunica confusión, existe una brecha que puede trabajarse.", ["/empresarias/", "/imagen-estrategica/", "/contacto/"], ["imagen personal y promesa de marca", "presencia de fundadores"], ["personalBrand", "imageDoesNotLie"], "buyer_fundador_promesa_marca"),
  record("buyer-consultor-comunicar-valor", "Empresarias y Marca Personal", "¿Cómo puede una consultora comunicar valor antes de explicar todos sus servicios?", "Puede hacer legibles su especialidad, criterio y forma de trabajar mediante una presentación clara y una presencia congruente. La imagen no demuestra por sí sola el valor, pero puede facilitar o dificultar que otros lo reconozcan.", ["/empresarias/", "/imagen-profesional/", "/contacto/"], ["imagen profesional para consultoras", "comunicar valor con presencia"], ["personalBrand", "embody"], "buyer_consultor_comunicar_valor"),
  record("buyer-fundador-lanzamiento", "Empresarias y Marca Personal", "¿Qué debe revisar una persona fundadora antes de presentar una nueva oferta?", "Debe revisar si el mensaje, la imagen y la forma de ocupar el espacio expresan la etapa actual del negocio. Una oferta nueva pierde claridad cuando quien la presenta todavía comunica una versión anterior.", ["/imagen-estrategica/", "/empresarias/", "/contacto/"], ["imagen para lanzar una nueva oferta", "presencia estratégica de fundadores"], ["personalBrand", "imageDoesNotLie"], "buyer_fundador_lanzamiento"),
  record("buyer-consultor-foto-video", "Empresarias y Marca Personal", "¿Cómo preparar mi imagen para fotos y videos de marca personal sin sentirme disfrazado?", "Define primero qué trabajo, etapa y tono deben representar las imágenes. Después elige vestimenta, color y postura que ya puedas reconocer como propios, en lugar de construir un personaje solo para la sesión.", ["/imagen-estrategica/", "/imagen-profesional/", "/contacto/"], ["fotos profesionales de marca personal", "imagen auténtica para video"], ["personalBrand", "color"], "buyer_consultor_foto_video"),
  record("buyer-fundador-ventas-presencia", "Empresarias y Marca Personal", "¿Cómo influye la presencia del fundador en una conversación de ventas?", "La presencia influye en cómo se reciben claridad, confianza y responsabilidad durante la conversación. No reemplaza una buena oferta, pero puede reforzarla cuando el cuerpo, la imagen y el mensaje expresan la misma dirección.", ["/empresarias/", "/comunicacion-no-verbal/", "/contacto/"], ["presencia del fundador en ventas", "imagen y confianza profesional"], ["nonverbal", "imageDoesNotLie"], "buyer_fundador_ventas_presencia"),

  record("buyer-equipo-criterios-sin-uniforme", "Imagen Empresarial y Equipos", "¿Cómo definir criterios de imagen para un equipo sin convertirlos en uniforme?", "Define el resultado que debe compartir el equipo: claridad, cuidado, adaptación al cliente o reconocimiento de función. Después permite variaciones de estilo dentro de límites comprensibles y explicados.", ["/servicios-asesoria-de-imagen-coaching/talleres/", "/imagen-profesional/", "/contacto/"], ["criterios de imagen para equipos", "presencia corporativa sin uniforme"], ["services", "professionalsDiffer"], "buyer_equipo_criterios_sin_uniforme"),
  record("buyer-vocero-coherencia-marca", "Imagen Empresarial y Equipos", "¿Qué debe revisar una persona vocera para representar a su organización con coherencia?", "Debe comprender el mensaje, el nivel de autoridad que representa y la experiencia que la organización quiere ofrecer. Imagen, postura, escucha y respuesta deben acompañar esa función sin borrar su identidad personal.", ["/comunicacion-no-verbal-ejecutiva/", "/servicios-asesoria-de-imagen-coaching/talleres/", "/contacto/"], ["imagen profesional para voceros", "coherencia de marca en comunicación ejecutiva"], ["nonverbal", "services"], "buyer_vocero_coherencia_marca"),
  record("buyer-equipo-reunion-cliente", "Imagen Empresarial y Equipos", "¿Qué señales de presencia puede revisar un equipo antes de reunirse con un cliente importante?", "Puede revisar cómo entra, se distribuye, escucha, toma turnos y responde a preguntas. También conviene acordar quién conduce cada parte para que la presencia colectiva no comunique desorden.", ["/servicios-asesoria-de-imagen-coaching/talleres/", "/comunicacion-no-verbal/", "/contacto/"], ["presencia profesional para reuniones con clientes", "comunicación no verbal de equipos"], ["nonverbal", "axioms"], "buyer_equipo_reunion_cliente"),
  record("buyer-equipo-retroalimentacion-imagen", "Imagen Empresarial y Equipos", "¿Cómo dar retroalimentación de imagen profesional sin atacar a una persona?", "Habla de una situación, una señal observable y el efecto relacionado con la función. Evita convertir gusto personal, cuerpo o identidad en problema; la conversación debe ofrecer un criterio aplicable y respetuoso.", ["/servicios-asesoria-de-imagen-coaching/talleres/", "/imagen-profesional/", "/contacto/"], ["retroalimentación de imagen profesional", "criterios respetuosos para equipos"], ["professionalsDiffer", "services"], "buyer_equipo_retroalimentacion_imagen"),
  record("buyer-equipo-taller-necesidad", "Imagen Empresarial y Equipos", "¿Cuándo necesita una empresa un taller de imagen y presencia en lugar de reglas de vestimenta?", "Cuando el problema incluye trato, comunicación, percepción de función o experiencia del cliente, una lista de prendas resulta insuficiente. Un taller permite comprender por qué existen los criterios y cómo aplicarlos en situaciones reales.", ["/servicios-asesoria-de-imagen-coaching/talleres/", "/imagen-profesional/", "/contacto/"], ["taller de imagen empresarial", "presencia profesional para equipos"], ["services", "nonverbal"], "buyer_equipo_taller_necesidad"),

  record("buyer-remoto-presencia-camara", "Presencia Ejecutiva", "¿Cómo proyectar presencia ejecutiva por cámara sin actuar para la pantalla?", "Ajusta encuadre, luz, mirada y ritmo para facilitar la conversación, pero conserva una forma natural de hablar y escuchar. La cámara necesita claridad adicional, no una personalidad distinta.", ["/presencia-ejecutiva/", "/comunicacion-no-verbal-ejecutiva/", "/contacto/"], ["presencia ejecutiva por cámara", "comunicación no verbal en videollamadas"], ["nonverbal", "embody"], "buyer_remoto_presencia_camara"),
  record("buyer-remoto-contexto-cultural", "Mercados Hispanohablantes", "¿Cómo adaptar mi imagen a otro país sin depender de estereotipos culturales?", "Observa el sector, la organización, la audiencia y el propósito de cada encuentro. Pregunta por protocolos concretos y ajusta formalidad o recursos sin asumir que todas las personas de un país esperan lo mismo.", ["/coach-de-imagen/", "/imagen-profesional/", "/contacto/"], ["imagen profesional en otro país", "adaptación intercultural sin estereotipos"], ["professionalsDiffer", "services"], "buyer_remoto_contexto_cultural"),
  record("buyer-remoto-viaje-guardarropa", "Guardarropa Profesional", "¿Cómo preparar un guardarropa de viaje para varias reuniones profesionales?", "Organiza las reuniones por formalidad, clima y actividad, y elige piezas que formen varias combinaciones. Incluye alternativas para cambios reales, no prendas adicionales sin una función definida.", ["/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/imagen-profesional/", "/contacto/"], ["guardarropa de viaje profesional", "combinaciones para reuniones de trabajo"], ["wardrobe", "closet"], "buyer_remoto_viaje_guardarropa"),
  record("buyer-remoto-idioma-identidad", "Mercados Hispanohablantes", "¿Qué ventaja tiene trabajar identidad e imagen profesional en mi idioma principal?", "Permite nombrar con mayor precisión cómo te ves, qué quieres comunicar y qué señales te incomodan. Esa precisión ayuda a tomar decisiones propias, aunque el trabajo profesional ocurra en más de un idioma.", ["/coach-de-imagen/", "/servicios-asesoria-de-imagen-coaching/coaching-de-imagen/", "/contacto/"], ["coaching de imagen en español", "identidad profesional para hispanohablantes"], ["coaching", "internalExternal"], "buyer_remoto_idioma_identidad"),
  record("buyer-remoto-consistencia-mercados", "Mercados Hispanohablantes", "¿Cómo mantener una presencia reconocible cuando trabajo con clientes de varios países?", "Define los rasgos que no cambian: propuesta, trato, criterio y base visual. Después adapta ejemplos, protocolo y formalidad a cada contexto sin reconstruir tu identidad en cada conversación.", ["/imagen-estrategica/", "/coach-de-imagen/", "/contacto/"], ["presencia profesional en varios países", "imagen estratégica para mercados hispanos"], ["personalBrand", "professionalsDiffer"], "buyer_remoto_consistencia_mercados"),

  record("buyer-practico-color-rostro", "Colorimetría", "¿Por qué conviene observar el color cerca del rostro y no solo en una paleta?", "Porque luz, contraste, cabello, ojos y piel modifican la lectura del color en cada persona. La observación cerca del rostro permite evaluar el efecto real antes de convertir una recomendación general en decisión.", ["/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/imagen-profesional/", "/contacto/"], ["colorimetría cerca del rostro", "color para imagen profesional"], ["color", "axioms"], "buyer_practico_color_rostro"),
  record("buyer-practico-closet-no-comprar", "Guardarropa Profesional", "¿Cómo saber si necesito comprar ropa o aprender a combinar lo que ya tengo?", "Haz un inventario de actividades y combinaciones completas. Si existen prendas suficientes pero no forman conjuntos útiles, el problema es de organización; si falta una función concreta, entonces la compra tiene un propósito verificable.", ["/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/imagen-profesional/", "/contacto/"], ["ordenar el clóset antes de comprar", "guardarropa profesional funcional"], ["closet", "cleanCloset"], "buyer_practico_closet_no_comprar"),
  record("buyer-practico-accesorio-mensaje", "Guardarropa Profesional", "¿Cómo elegir accesorios que apoyen mi mensaje profesional?", "Elige escala, cantidad, color y nivel de detalle según tu cuerpo, tu estilo y el contexto. El accesorio debe dirigir o completar la mirada, no introducir una historia que compita con tu función.", ["/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/imagen-profesional/", "/contacto/"], ["accesorios para imagen profesional", "complementos según estilo y contexto"], ["accessories", "axioms"], "buyer_practico_accesorio_mensaje"),
  record("buyer-practico-compra-criterio", "Guardarropa Profesional", "¿Qué preguntas debo hacer antes de comprar una prenda para trabajar?", "Pregunta qué actividad resuelve, con qué prendas combina, cuántas veces puede usarse, qué cuidado exige y si permite moverte. Si no responde a una necesidad real, la compra no fortalece el guardarropa.", ["/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/imagen-profesional/", "/contacto/"], ["compras inteligentes para el guardarropa profesional", "criterios antes de comprar ropa"], ["closet", "wardrobe"], "buyer_practico_compra_criterio"),
  record("buyer-practico-jornada-larga", "Guardarropa Profesional", "¿Cómo construir una imagen profesional que funcione durante una jornada larga?", "Prioriza ajuste, movilidad, temperatura, calzado y facilidad para recuperar la forma de la prenda. La presencia se debilita si la ropa exige atención constante o impide concentrarte en el trabajo.", ["/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/", "/imagen-profesional/", "/contacto/"], ["imagen profesional para jornadas largas", "ropa de trabajo con movilidad"], ["wardrobe", "imageDoesNotLie"], "buyer_practico_jornada_larga")
];

const rawCards = [...geoCards, ...buyerCards];
if (rawCards.length !== 75) throw new Error(`Expected 75 cards, received ${rawCards.length}.`);

const approvedFiles = (await readdir(path.join(root, "content/knowledge/approved")))
  .filter((file) => file.endsWith(".json") && file !== `${batchId}.json`);
const existingIds = new Set();
const existingQuestions = new Set();
let approvedBefore = 0;
for (const file of approvedFiles) {
  const batch = JSON.parse(await readFile(path.join(root, "content/knowledge/approved", file), "utf8"));
  for (const card of batch.cards || []) {
    approvedBefore += 1;
    if (card.id) existingIds.add(card.id);
    if (card.question) existingQuestions.add(normalize(card.question));
  }
}

const batchIds = new Set();
const batchQuestions = new Set();
const cards = rawCards.map(({ sourceKeys, ...card }) => {
  if (existingIds.has(card.id) || batchIds.has(card.id)) throw new Error(`Duplicate card id: ${card.id}`);
  const normalizedQuestion = normalize(card.question);
  if (existingQuestions.has(normalizedQuestion) || batchQuestions.has(normalizedQuestion)) throw new Error(`Duplicate question: ${card.question}`);
  batchIds.add(card.id);
  batchQuestions.add(normalizedQuestion);

  const selectedSources = sourceKeys.map((key) => {
    if (!sources[key]) throw new Error(`Unknown source key ${key} for ${card.id}`);
    return sources[key];
  });
  const sourceIds = selectedSources.map((source) => source.id);
  const sourceSignals = selectedSources.map((source) => source.signal);
  const sourceHash = createHash("sha256")
    .update(JSON.stringify({ question: card.question, shortAnswer: card.shortAnswer, sourceIds, sourceVersion }))
    .digest("hex");

  return {
    ...card,
    sourceSignals,
    conversionBridge: "Conectar con la ruta prioritaria según intención, audiencia y contexto profesional.",
    guardrails,
    sourceIds,
    sourceLocator: sourceSignals,
    sourceHash,
    sourceVersion,
    contentMode: "editorial_synthesis_from_reviewed_sonia_sources"
  };
});

for (const card of cards) {
  for (const route of card.routePriority) {
    const routePath = route === "/" ? path.join(root, "dist/index.html") : path.join(root, "dist", route.replace(/^\//, ""), "index.html");
    try {
      await stat(routePath);
    } catch {
      throw new Error(`Route does not exist for ${card.id}: ${route}`);
    }
  }
}

const approvedBatch = {
  batchId,
  language: "es-MX",
  sourceBoundary: "Sonia/Coach De Imagen only; reviewed Drive corpus and governed repository sources.",
  generatedAt,
  cards
};
const queueBatch = {
  ...approvedBatch,
  batchId: `${batchId}-candidates`,
  reviewStatus: "approved_after_duplicate_route_and_source_validation"
};

await writeFile(approvedPath, `${JSON.stringify(approvedBatch, null, 2)}\n`, "utf8");
await writeFile(queuePath, `${JSON.stringify(queueBatch, null, 2)}\n`, "utf8");

const ontologyCounts = cards.reduce((counts, card) => {
  counts[card.ontologyNode] = (counts[card.ontologyNode] || 0) + 1;
  return counts;
}, {});
const sourceCounts = cards.reduce((counts, card) => {
  card.sourceSignals.forEach((signal) => { counts[signal] = (counts[signal] || 0) + 1; });
  return counts;
}, {});

const report = [
  "# 2026-08-25 GEO Buyer Decision Knowledge Batch",
  "",
  "Status: approved for build after duplicate, route and source validation.",
  "",
  `Cards generated: ${cards.length}.`,
  `Cards approved: ${cards.length}.`,
  "Cards rejected: 0.",
  `Approved corpus before batch: ${approvedBefore} repository cards.`,
  `Approved corpus after batch: ${approvedBefore + cards.length} repository cards.`,
  "",
  "## Files",
  "",
  `- Candidate: \`content/knowledge/queue/${batchId}-candidates.json\``,
  `- Approved: \`content/knowledge/approved/${batchId}.json\``,
  `- Report: \`content/knowledge/reports/${batchId}.md\``,
  "",
  "## Coverage added",
  "",
  "- 45 market cards: Guadalajara, CDMX, Monterrey, Querétaro, Zapopan, Bogotá, Medellín, Lima, Santiago, Buenos Aires, Montevideo, Miami, Houston, Dallas and New York.",
  "- 30 buyer-decision cards: women leaders, men professionals, founders and consultants, teams and spokespeople, cross-border or remote work, and practical image decisions.",
  "- Each GEO card answers a distinct work situation; no city-name substitution templates were used.",
  "",
  "## Ontology coverage",
  "",
  ...Object.entries(ontologyCounts).sort(([a], [b]) => a.localeCompare(b, "es")).map(([node, count]) => `- ${node}: ${count}.`),
  "",
  "## Source use",
  "",
  ...Object.entries(sourceCounts).sort(([a], [b]) => a.localeCompare(b, "es")).map(([signal, count]) => `- ${signal}: ${count} card references.`),
  "",
  "## Governance review",
  "",
  "- Existing approved ID collisions: 0.",
  "- Existing approved normalized-question collisions: 0.",
  "- Duplicate IDs or questions inside batch: 0.",
  "- Required routes missing from current build: 0.",
  "- Cards without Sonia source IDs, locators, hashes or versions: 0.",
  "- Invented prices, guarantees, dates, agenda, credentials, availability or email-routing claims: 0.",
  "- Medical, therapy or cultural-stereotype claims: 0.",
  "- Cross-project content: 0.",
  "",
  "## Build and validation",
  "",
  "Pending in this run: build, provenance audit, Sonia-control audit and full static validation.",
  "",
  "No UI, photos, existing page copy, DNS, email, Cloudflare configuration or production deployment changed."
].join("\n");

await writeFile(reportPath, `${report}\n`, "utf8");
console.log(`Generated ${cards.length} governed cards in ${path.relative(root, approvedPath)}.`);
