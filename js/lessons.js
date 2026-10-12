/**
 * Curated Curriculum for Touch Typing (Mecanografía)
 * Structured progression: Home row -> Top row -> Bottom row -> Spanish accents & punctuation -> Real texts
 */
const LESSON_CATEGORIES = [
  {
    id: 'home-row',
    title: 'Nivel 1: Fila Base (Home Row)',
    description: 'Aprende la posición de descanso de los dedos y las teclas guía.',
    icon: '🏠'
  },
  {
    id: 'top-row',
    title: 'Nivel 2: Fila Superior',
    description: 'Extiende los dedos hacia arriba: E, I, R, U, T, Y, O, P, Q, W.',
    icon: '⬆️'
  },
  {
    id: 'bottom-row',
    title: 'Nivel 3: Fila Inferior y Puntuación',
    description: 'Domina las teclas inferiores: C, M, V, N, X, B, Z, coma y punto.',
    icon: '⬇️'
  },
  {
    id: 'spanish-accents',
    title: 'Nivel 4: Mayúsculas y Acentos en Español',
    description: 'Coordinación con tecla Shift, tildes (á, é, í, ó, ú) y signos ¿ ? ¡ !.',
    icon: '✍️'
  },
  {
    id: 'mastery',
    title: 'Nivel 5: Textos Reales y Maestría',
    description: 'Práctica con citas literarias, historias y párrafos completos.',
    icon: '🏆'
  },
  {
    id: 'timed-tests',
    title: 'Retos de Velocidad (Test WPM)',
    description: 'Evalúa tu velocidad exacta de palabras por minuto contra el reloj.',
    icon: '⏱️'
  }
];

const LESSONS = [
  // --- NIVEL 1: FILA BASE ---
  {
    id: 'l1-1',
    category: 'home-row',
    title: '1.1 Teclas Guía: F y J',
    targetKeys: ['f', 'j', ' '],
    tip: 'Coloca tus índices sobre las teclas F y J (siente los pequeños relieves táctiles).',
    text: 'f j f j ff jj fj jf ff jj fj jf f j f j ff jj f f j j fj jf fj jf',
    minAccuracy: 90,
    targetWpm: 15
  },
  {
    id: 'l1-2',
    category: 'home-row',
    title: '1.2 Dedos Corazón: D y K',
    targetKeys: ['d', 'k', 'f', 'j', ' '],
    tip: 'Usa los dedos corazón para D (mano izquierda) y K (mano derecha).',
    text: 'd k d k dd kk dk kd fd jk df kj ddkk ffjj dk dk fd jk dk kd ff jj dd kk',
    minAccuracy: 90,
    targetWpm: 18
  },
  {
    id: 'l1-3',
    category: 'home-row',
    title: '1.3 Dedos Anulares: S y L',
    targetKeys: ['s', 'l', 'd', 'k', ' '],
    tip: 'Usa los dedos anulares para S (izquierda) y L (derecha). Mantén las muñecas relajadas.',
    text: 's l s l ss ll sl ls as ld sf jl ss ll sl ls dksl fksl ls sl ss ll',
    minAccuracy: 90,
    targetWpm: 18
  },
  {
    id: 'l1-4',
    category: 'home-row',
    title: '1.4 Dedos Meñiques: A y Ñ',
    targetKeys: ['a', 'ñ', 's', 'l', ' '],
    tip: 'El meñique izquierdo pulsa A; el meñique derecho pulsa Ñ. No muevas la mano entera.',
    text: 'a ñ a ñ aa ññ añ ña as lñ af jñ sa ñl fa ñj aa ññ aña ñañ a ñ a ñ',
    minAccuracy: 90,
    targetWpm: 18
  },
  {
    id: 'l1-5',
    category: 'home-row',
    title: '1.5 La Fila Base Completa',
    targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ñ', ' '],
    tip: 'Fila base: ASDF con la mano izquierda, JKLÑ con la derecha. Pulgares en el espacio.',
    text: 'asdf jklñ asdf jklñ asdf jklñ fads ñlkj fallas salada alada falta salsa fala',
    minAccuracy: 92,
    targetWpm: 20
  },
  {
    id: 'l1-6',
    category: 'home-row',
    title: '1.6 Palabras con la Fila Base',
    targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', 'ñ', ' '],
    tip: 'Escribe a ritmo constante. No te apresures; la precisión crea la velocidad.',
    text: 'la sal las alas falsas falla salsa laja faldas dalla laja alada dalla alfaja',
    minAccuracy: 93,
    targetWpm: 22
  },

  // --- NIVEL 2: FILA SUPERIOR ---
  {
    id: 'l2-1',
    category: 'top-row',
    title: '2.1 Vocales E e I',
    targetKeys: ['e', 'i', 'd', 'k', ' '],
    tip: 'Dedo corazón izquierdo sube a la E. Dedo corazón derecho sube a la I.',
    text: 'de ki de ki ded kik ede iki ese ili eje ifi deki kide de ki ded kik ede iki',
    minAccuracy: 90,
    targetWpm: 20
  },
  {
    id: 'l2-2',
    category: 'top-row',
    title: '2.2 Teclas R y U',
    targetKeys: ['r', 'u', 'f', 'j', ' '],
    tip: 'El índice izquierdo sube a la R. El índice derecho sube a la U.',
    text: 'fr ju fr ju frf juj fru jur ruf ruj rur uju fr ju fru jur rur uju fr ju',
    minAccuracy: 90,
    targetWpm: 20
  },
  {
    id: 'l2-3',
    category: 'top-row',
    title: '2.3 Teclas T e Y',
    targetKeys: ['t', 'y', 'f', 'j', ' '],
    tip: 'Estira los índices: el izquierdo llega a la T y el derecho a la Y.',
    text: 'ft jy ft jy ftf jyj fty jyt ty yt yet try tuy fit joy fty jyt ftf jyj',
    minAccuracy: 90,
    targetWpm: 20
  },
  {
    id: 'l2-4',
    category: 'top-row',
    title: '2.4 Teclas O y P',
    targetKeys: ['o', 'p', 'l', 'ñ', ' '],
    tip: 'Anular derecho sube a la O; meñique derecho sube a la P.',
    text: 'lo ñp lo ñp lol ñpñ pop opo polo sopa paso pelo peso popa palo lo ñp lol',
    minAccuracy: 90,
    targetWpm: 20
  },
  {
    id: 'l2-5',
    category: 'top-row',
    title: '2.5 Teclas Q y W',
    targetKeys: ['q', 'w', 'a', 's', ' '],
    tip: 'Meñique izquierdo sube a la Q; anular izquierdo sube a la W.',
    text: 'aq sw aq sw aqa sws que qui show web queque queso kiwi wasp aq sw aqa',
    minAccuracy: 90,
    targetWpm: 20
  },
  {
    id: 'l2-6',
    category: 'top-row',
    title: '2.6 Palabras Fila Base y Superior',
    targetKeys: ['a', 'e', 'i', 'o', 'u', ' '],
    tip: '¡Excelente! Ahora ya dominas dos filas completas del teclado.',
    text: 'pero tu suelo rio piel puerto ruta tela reloj papel puerto suelo plato queso tiro',
    minAccuracy: 92,
    targetWpm: 24
  },

  // --- NIVEL 3: FILA INFERIOR ---
  {
    id: 'l3-1',
    category: 'bottom-row',
    title: '3.1 Teclas C y M',
    targetKeys: ['c', 'm', 'd', 'j', ' '],
    tip: 'Corazón izquierdo baja a la C; índice derecho baja a la M.',
    text: 'dc jm dc jm dcd jmj cam mac cama cima como coma mico muro cama cima dc jm',
    minAccuracy: 90,
    targetWpm: 22
  },
  {
    id: 'l3-2',
    category: 'bottom-row',
    title: '3.2 Teclas V y N',
    targetKeys: ['v', 'n', 'f', 'j', ' '],
    tip: 'Índice izquierdo baja a la V; índice derecho baja a la N.',
    text: 'fv jn fv jn fvf jnj van nav vino nave vaso nido vena vino nova van nav fvf jnj',
    minAccuracy: 90,
    targetWpm: 22
  },
  {
    id: 'l3-3',
    category: 'bottom-row',
    title: '3.3 Teclas B y X',
    targetKeys: ['b', 'x', 'f', 's', ' '],
    tip: 'Índice izquierdo extiende a la B; anular izquierdo baja a la X.',
    text: 'fb sx fb sx fbf sxs box bux base bote buey taxi examen box base taxi examen',
    minAccuracy: 90,
    targetWpm: 22
  },
  {
    id: 'l3-4',
    category: 'bottom-row',
    title: '3.4 Tecla Z y Signos Coma y Punto',
    targetKeys: ['z', ',', '.', ' '],
    tip: 'Meñique izquierdo baja a la Z; corazón derecho baja a la coma; anular al punto.',
    text: 'az l, ñ. az l, ñ. zar, paz, luz. sol, mar. pez, voz. haz, vez. az l, ñ.',
    minAccuracy: 90,
    targetWpm: 20
  },
  {
    id: 'l3-5',
    category: 'bottom-row',
    title: '3.5 Todo el Alfabeto Básico',
    targetKeys: ['a-z'],
    tip: 'Párrafo completo integrando todas las letras del abecedario.',
    text: 'el veloz murcielago hindu comia feliz cardillo y kiwi bajo la choza de madera.',
    minAccuracy: 93,
    targetWpm: 25
  },

  // --- NIVEL 4: MAYÚSCULAS Y ACENTOS ---
  {
    id: 'l4-1',
    category: 'spanish-accents',
    title: '4.1 Mayúsculas con Tecla Shift',
    targetKeys: ['Shift', 'A-Z'],
    tip: 'Si la letra es con mano derecha, pulsa Shift izquierdo con el meñique y viceversa.',
    text: 'Madrid, Lima, Buenos Aires, Bogota, Santiago, Toledo, Sevilla, Valencia y Cordoba.',
    minAccuracy: 92,
    targetWpm: 22
  },
  {
    id: 'l4-2',
    category: 'spanish-accents',
    title: '4.2 Acentuación en Español',
    targetKeys: ['á', 'é', 'í', 'ó', 'ú'],
    tip: 'Pulsa la tecla de tilde (junto a la P o Ñ) y luego la vocal correspondiente.',
    text: 'árbol, canción, café, límite, brújula, rápido, fácil, música, océano y corazón.',
    minAccuracy: 92,
    targetWpm: 22
  },
  {
    id: 'l4-3',
    category: 'spanish-accents',
    title: '4.3 Puntuación y Exclamaciones',
    targetKeys: ['¿', '?', '¡', '!', ':', ';'],
    tip: 'Aprende los signos dobles propios del idioma español.',
    text: '¿Cómo estás hoy? ¡Qué gran día para aprender mecanografía! Siempre adelante; nunca te rindas.',
    minAccuracy: 92,
    targetWpm: 22
  },

  // --- NIVEL 5: TEXTOS REALES ---
  {
    id: 'l5-1',
    category: 'mastery',
    title: '5.1 Sabiduría y Proverbios',
    targetKeys: ['texto fluido'],
    tip: 'Mantén la mirada fija en la pantalla, no mires el teclado físico.',
    text: 'El que lee mucho y anda mucho, ve mucho y sabe mucho. La constancia es el puente entre las metas y los logros de cada día.',
    minAccuracy: 95,
    targetWpm: 30
  },
  {
    id: 'l5-2',
    category: 'mastery',
    title: '5.2 El Ingenioso Hidalgo',
    targetKeys: ['literatura'],
    tip: 'Escribe con suavidad y ritmo pausado, disfrutando de cada palabra.',
    text: 'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.',
    minAccuracy: 95,
    targetWpm: 32
  },
  {
    id: 'l5-3',
    category: 'mastery',
    title: '5.3 El Principito',
    targetKeys: ['literatura'],
    tip: 'Respira hondo y mantén los dedos ligeros sobre las teclas.',
    text: 'He aquí mi secreto, que no puede ser más simple: solo con el corazón se puede ver bien; lo esencial es invisible para los ojos.',
    minAccuracy: 95,
    targetWpm: 35
  },
  {
    id: 'l5-4',
    category: 'mastery',
    title: '5.4 El Arte de la Mecanografía',
    targetKeys: ['tecnología'],
    tip: 'La memoria muscular te permitirá teclear a la velocidad de tus pensamientos.',
    text: 'La mecanografía al tacto transforma la interacción humana con la computadora. Cada dedo tiene asignada una zona exacta, logrando rapidez, ergonomía y máxima precisión mental.',
    minAccuracy: 95,
    targetWpm: 38
  },

  // --- RETOS DE VELOCIDAD CRONOMETRADOS ---
  {
    id: 't-1min',
    category: 'timed-tests',
    title: 'Test Cronometrado: 1 Minuto',
    timeLimit: 60,
    tip: 'Escribe la mayor cantidad de palabras posibles en 60 segundos.',
    text: 'Aprender a escribir en el teclado sin mirar las teclas es una de las habilidades más productivas de nuestra época. Con práctica diaria constante, tus dedos volarán sobre el teclado con total precisión y fluidez natural. El secreto está en la repetición consciente y en mantener una postura relajada.',
    minAccuracy: 95,
    targetWpm: 40
  },
  {
    id: 't-2min',
    category: 'timed-tests',
    title: 'Test Cronometrado: 2 Minutos',
    timeLimit: 120,
    tip: 'Prueba de resistencia y velocidad durante 120 segundos completos.',
    text: 'La velocidad de escritura no surge de la prisa, sino de la serenidad y la precisión. Cuando eliminas los titubeos y las correcciones continuas, la velocidad promedio se duplica de manera natural. Practica diariamente unos minutos, celebra cada pequeño progreso y pronto alcanzarás marcas superiores a las cincuenta palabras por minuto con una exactitud asombrosa.',
    minAccuracy: 95,
    targetWpm: 45
  }
];

window.LESSON_CATEGORIES = LESSON_CATEGORIES;
window.LESSONS = LESSONS;
