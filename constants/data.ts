export const summaryStats = {
    lastWorkout: {
        date: 'Ayer',
        name: 'Push Day (Pecho/Tríceps)',
        duration: '45 min',
    },
    workoutsThisWeek: 3,
    currentRest: 'Día de descanso',
    recentExercises: ['Press de Banca', 'Fondos', 'Extensiones'],
};

export const pastWorkouts = [
    {
        id: '101',
        date: '12 Feb 2026',
        name: 'Piernas',
        duration: '60 min',
        volume: '3200 kg',
        exercises: [] // Simplified for mock
    },
];

export const exercisesData = [
    // PECHO
    {
        id: '1',
        name: 'Press de Banca',
        muscle: 'Pecho',
        secondaryMuscles: ['Tríceps', 'Hombros'],
        equipment: 'Barra',
        level: 'Intermedio',
        benefits: 'Desarrolla fuerza y masa muscular en el pectoral mayor.',
        description: 'Acuéstate en el banco, baja la barra hasta el pecho y empuja hacia arriba explosivamente.'
    },
    {
        id: '2',
        name: 'Press Inclinado con Mancuernas',
        muscle: 'Pecho',
        secondaryMuscles: ['Hombros', 'Tríceps'],
        equipment: 'Mancuernas',
        level: 'Principiante',
        benefits: 'Enfoca el trabajo en la parte superior del pecho.',
        description: 'En un banco a 30-45 grados, empuja las mancuernas hacia el techo manteniendo los codos a 45 grados.'
    },
    {
        id: '3',
        name: 'Aperturas',
        muscle: 'Pecho',
        secondaryMuscles: ['Hombros'],
        equipment: 'Mancuernas/Máquina',
        level: 'Principiante',
        benefits: 'Aísla el pectoral y mejora la flexibilidad.',
        description: 'Abre los brazos como si fueras a abrazar un árbol, manteniendo una ligera flexión en los codos.'
    },

    // ESPALDA
    {
        id: '4',
        name: 'Dominadas',
        muscle: 'Espalda',
        secondaryMuscles: ['Bíceps', 'Antebrazos'],
        equipment: 'Barra',
        level: 'Avanzado',
        benefits: 'Increíble para la anchura de espalda y fuerza relativa.',
        description: 'Cuelga de la barra y tira de tu cuerpo hasta que la barbilla pase la barra.'
    },
    {
        id: '5',
        name: 'Remo con Barra',
        muscle: 'Espalda',
        secondaryMuscles: ['Bíceps', 'Isquiotibiales'],
        equipment: 'Barra',
        level: 'Intermedio',
        benefits: 'Construye densidad y grosor en la espalda media.',
        description: 'Inclínate hacia adelante manteniendo la espalda recta y tira de la barra hacia tu cadera.'
    },
    {
        id: '6',
        name: 'Jalón al Pecho',
        muscle: 'Espalda',
        secondaryMuscles: ['Bíceps'],
        equipment: 'Polea',
        level: 'Principiante',
        benefits: 'Alternativa excelente a las dominadas para desarrollar amplitud.',
        description: 'Siéntate y tira de la barra hacia la parte superior de tu pecho, contrayendo los dorsales.'
    },

    // PIERNAS
    {
        id: '7',
        name: 'Sentadilla Tradicional',
        muscle: 'Piernas',
        secondaryMuscles: ['Glúteos', 'Core'],
        equipment: 'Barra',
        level: 'Intermedio',
        benefits: 'El rey de los ejercicios de pierna. Trabaja todo el tren inferior.',
        description: 'Con la barra en la espalda, baja cadera y rodillas como si te sentaras en una silla invisible.'
    },
    {
        id: '8',
        name: 'Peso Muerto',
        muscle: 'Piernas',
        secondaryMuscles: ['Espalda Baja', 'Trapecios'],
        equipment: 'Barra',
        level: 'Avanzado',
        benefits: 'Fuerza total. Trabaja la cadena posterior de manera brutal.',
        description: 'Levanta la barra del suelo manteniendo la espalda neutra y empujando con las piernas.'
    },
    {
        id: '9',
        name: 'Zancadas',
        muscle: 'Piernas',
        secondaryMuscles: ['Glúteos', 'Core'],
        equipment: 'Mancuernas',
        level: 'Principiante',
        benefits: 'Mejora el equilibrio y trabaja cada pierna de forma individual.',
        description: 'Da un paso largo hacia adelante y baja la rodilla trasera casi hasta tocar el suelo.'
    },
    {
        id: '10',
        name: 'Prensa de Piernas',
        muscle: 'Piernas',
        secondaryMuscles: ['Cuádriceps', 'Glúteos'],
        equipment: 'Máquina',
        level: 'Principiante',
        benefits: 'Permite mover grandes cargas con seguridad para la espalda.',
        description: 'Empuja la plataforma con los pies, evitando bloquear completamente las rodillas.'
    },

    // HOMBROS
    {
        id: '11',
        name: 'Press Militar',
        muscle: 'Hombros',
        secondaryMuscles: ['Tríceps', 'Core'],
        equipment: 'Barra/Mancuernas',
        level: 'Intermedio',
        benefits: 'Construye hombros fuertes y estables.',
        description: 'De pie o sentado, empuja el peso desde los hombros hasta estirar los brazos sobre la cabeza.'
    },
    {
        id: '12',
        name: 'Elevaciones Laterales',
        muscle: 'Hombros',
        secondaryMuscles: ['Trapecios'],
        equipment: 'Mancuernas',
        level: 'Principiante',
        benefits: 'Clave para la anchura y redondez del hombro (deltoides lateral).',
        description: 'Levanta los brazos hacia los lados hasta la altura de los hombros, con codos ligeramente flexionados.'
    },

    // BRAZOS
    {
        id: '13',
        name: 'Curl con Barra',
        muscle: 'Brazos',
        secondaryMuscles: ['Antebrazos'],
        equipment: 'Barra',
        level: 'Principiante',
        benefits: 'El mejor constructor de masa para los bíceps.',
        description: 'De pie, flexiona los codos levantando la barra hacia el pecho sin mover los hombros.'
    },
    {
        id: '14',
        name: 'Fondos en Paralelas',
        muscle: 'Brazos',
        secondaryMuscles: ['Pecho', 'Hombros'],
        equipment: 'Peso Corporal',
        level: 'Intermedio',
        benefits: 'Excelente para tríceps y pecho inferior.',
        description: 'Baja tu cuerpo flexionando los codos y empuja hasta estirar los brazos.'
    },

    // CORE
    {
        id: '15',
        name: 'Plancha (Plank)',
        muscle: 'Core',
        secondaryMuscles: ['Hombros'],
        equipment: 'Peso Corporal',
        level: 'Principiante',
        benefits: 'Fortalece todo el núcleo y mejora la estabilidad.',
        description: 'Mantén el cuerpo recto apoyado en antebrazos y puntas de los pies.'
    },
    {
        id: '16',
        name: 'Crunches',
        muscle: 'Core',
        secondaryMuscles: [],
        equipment: 'Peso Corporal',
        level: 'Principiante',
        benefits: 'Enfoca el trabajo en el recto abdominal (six-pack).',
        description: 'Tumbado, flexiona el tronco intentando llevar las costillas hacia la cadera.'
    },
    {
        id: '17',
        name: 'Elevación de Piernas',
        muscle: 'Core',
        secondaryMuscles: ['Flexores de cadera'],
        equipment: 'Barra/Suelo',
        level: 'Intermedio',
        benefits: 'Trabaja intensamente la parte inferior del abdomen.',
        description: 'Colgado o tumbado, levanta las piernas rectas o flexionadas hacia el pecho.'
    },
];

export const workoutTemplates = [
    {
        id: 't1',
        name: 'Full Body (Cuerpo Completo)',
        exercises: ['1', '7', '5', '11', '15'] // Press Banca, Sentadilla, Remo, Militar, Plancha
    },
    {
        id: 't2',
        name: 'Torso (Upper Body)',
        exercises: ['1', '5', '11', '4', '2', '13'] // Banca, Remo, Militar, Dominadas, Inclinado, Curl
    },
    {
        id: 't3',
        name: 'Pierna (Lower Body)',
        exercises: ['7', '8', '9', '10', '17'] // Sentadilla, PM, Zancadas, Prensa, Elev. Piernas
    },
    {
        id: 't4',
        name: 'Empuje (Push)',
        exercises: ['1', '11', '2', '10', '14'] // Banca, Militar, Inclinado, Prensa, Fondos
    },
    {
        id: 't5',
        name: 'Tracción (Pull)',
        exercises: ['4', '5', '8', '6', '13'] // Dominadas, Remo, PM, Jalón, Curl
    },
];
