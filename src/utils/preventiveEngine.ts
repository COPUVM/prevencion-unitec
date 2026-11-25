/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  GoogleCalendarEvent,
  PreventiveMatrixRow,
  ProfileDraft,
  RiskFactorKey,
  ScheduledPreventiveStudy,
  UserHealthProfile,
} from '../types/calendar.ts';
import { formatToIsoWithOffset, getDefaultTimeZone } from './timezone.ts';

export const RISK_FACTOR_LABELS: Record<RiskFactorKey, string> = {
  sedentary: 'Sedentarismo (< 2.5 h/sem)',
  smoking: 'Fumo',
  vaping: 'Vapeo',
  alcohol: 'Alcohol semanal',
  ultraprocessed: 'Alimentos ultraprocesados diarios',
};

export const PREVENTIVE_MATRIX: PreventiveMatrixRow[] = [
  {
    id: 'R-01',
    title: 'Mastografía bilateral',
    emoji: '🎗️',
    categoryTag: 'Imagenología',
    sex: 'Femenino',
    minAge: 35,
    maxAge: 99,
    factors: ['alcohol', 'smoking', 'sedentary', 'ultraprocessed'],
    routineByAgeSex: true,
    description:
      'Estudio de imagen que utiliza rayos X en dosis bajas para examinar el tejido mamario y detectar cambios o lesiones',
    preparation:
      'Agendar cita previa (requiere orden médica). Acudir recién bañada sin aplicar desodorante, talco, crema o perfume en axilas y pecho. Llevar estudios previos comparativos y comunicar si existe sospecha de embarazo.',
    preferredMonth: 10,
    preferredHour: 9,
    preferredMin: 0,
    durationMin: 45,
    colorId: '11',
  },
  {
    id: 'R-02',
    title: 'Citología cervical (Papanicolaou)',
    emoji: '🌸',
    categoryTag: 'Tamizaje',
    sex: 'Femenino',
    minAge: 25,
    maxAge: 99,
    factors: ['smoking'],
    routineByAgeSex: true,
    description:
      'Estudio de tamizaje que consiste en recolectar células del cuello uterino para identificar alteraciones celulares que podrían evolucionar',
    preparation:
      'Agendar cita previa (requiere valoración médica). Acudir sin estar menstruando, mantener abstinencia sexual 48 horas antes y evitar el uso de óvulos, cremas o duchas vaginales durante las 48 horas previas.',
    preferredMonth: 6,
    preferredHour: 10,
    preferredMin: 30,
    durationMin: 45,
    colorId: '11',
  },
  {
    id: 'R-03',
    title: 'Densitometría ósea',
    emoji: '🦴',
    categoryTag: 'Imagenología',
    sex: 'Femenino',
    minAge: 50,
    maxAge: 99,
    factors: ['smoking', 'sedentary', 'alcohol', 'ultraprocessed'],
    routineByAgeSex: true,
    description:
      'Estudio de imagen que utiliza una dosis baja de rayos X para medir la densidad mineral de los huesos y evaluar su resistencia',
    preparation:
      'Agendar cita previa y presentar orden médica. Suspender suplementos de calcio 24 horas antes. Acudir con ropa cómoda sin cierres ni botones metálicos, llevar estudios previos y avisar si existe embarazo.',
    preferredMonth: 12,
    preferredHour: 10,
    preferredMin: 0,
    durationMin: 40,
    colorId: '11',
  },
  {
    id: 'R-04',
    title: 'Glucosa en ayunas',
    emoji: '🩸',
    categoryTag: 'Laboratorio',
    sex: 'Ambos',
    minAge: 35,
    maxAge: 99,
    factors: ['sedentary', 'ultraprocessed'],
    routineByAgeSex: true,
    description:
      'Análisis de sangre que mide la concentración de glucosa después de un periodo de al menos 8 horas sin consumir alimentos ni bebidas calóricas.',
    preparation:
      'Agendar cita previa con orden médica. Guardar ayuno estricto de 8 a 12 horas (solo se permite tomar agua simple). Evitar fumar, mascar chicle o realizar ejercicio intenso la mañana del estudio.',
    preferredMonth: 2,
    preferredHour: 8,
    preferredMin: 0,
    durationMin: 30,
    colorId: '11',
  },
  {
    id: 'R-05',
    title: 'Evaluación antropométrica',
    emoji: '📏',
    categoryTag: 'Valoración',
    sex: 'Ambos',
    minAge: 18,
    maxAge: 99,
    factors: ['sedentary', 'ultraprocessed'],
    description:
      'Medición clínica de peso, estatura, índice de masa corporal (IMC) y circunferencia de cintura para evaluar la composición corporal y el riesgo cardiometabólico.',
    preparation:
      'Acudir con ropa ligera, sin calzado y retirar objetos pesados o metálicos (llaves, cinturón, reloj). Se recomienda realizarla en horario matutino y tras haber evacuado vejiga.',
    preferredMonth: 1,
    preferredHour: 9,
    preferredMin: 0,
    durationMin: 30,
    colorId: '5',
  },
  {
    id: 'R-06',
    title: 'Tamizaje prostático',
    emoji: '🛡️',
    categoryTag: 'Laboratorio',
    sex: 'Masculino',
    minAge: 45,
    maxAge: 99,
    factors: ['age'],
    description:
      'Análisis de sangre que cuantifica una proteína producida por la glándula prostática para detectar oportunamente inflamación, crecimiento benigno o alteraciones celulares.',
    preparation:
      'Agendar cita previa con orden médica. Evitar eyaculación, relaciones sexuales, ciclismo o ejercicio intenso durante las 48 horas previas, ya que pueden elevar temporalmente los niveles. Llevar resultados anteriores.',
    preferredMonth: 12,
    preferredHour: 8,
    preferredMin: 30,
    durationMin: 30,
    colorId: '11',
  },
  {
    id: 'R-07',
    title: 'Tamizaje de consumo de sustancias (AUDIT / Fagerström)',
    emoji: '📋',
    categoryTag: 'Valoración',
    sex: 'Ambos',
    minAge: 18,
    maxAge: 99,
    factors: ['smoking', 'vaping', 'alcohol'],
    description:
      'Evaluación clínica mediante cuestionarios estandarizados para medir el grado de dependencia al alcohol, tabaco o vapeadores e identificar riesgos respiratorios, cardiovasculares y metabólicos.',
    preparation:
      'Responder con honestidad los instrumentos de tamizaje (AUDIT para alcohol, Fagerström para nicotina o ASSIST). No requiere ayuno ni preparación física previa; sirve para definir si se requieren estudios complementarios.',
    preferredMonth: 9,
    preferredHour: 11,
    preferredMin: 0,
    durationMin: 30,
    colorId: '5',
  },
  {
    id: 'R-08',
    title: 'Pruebas de función hepática (PFH)',
    emoji: '🧪',
    categoryTag: 'Laboratorio',
    sex: 'Ambos',
    minAge: 18,
    maxAge: 99,
    factors: ['alcohol', 'ultraprocessed'],
    description:
      'Perfil sanguíneo que mide enzimas (TGO, TGP, GGT) y bilirrubinas para evaluar la salud del hígado y detectar inflamación, hígado graso o daño hepático temprano.',
    preparation:
      'Agendar cita previa con orden médica. Guardar ayuno de 8 a 12 horas (solo agua simple) y evitar el consumo de bebidas alcohólicas durante al menos 72 horas previas a la toma de muestra.',
    preferredMonth: 7,
    preferredHour: 8,
    preferredMin: 0,
    durationMin: 30,
    colorId: '11',
  },
  {
    id: 'R-09',
    title: 'Espirometría simple',
    emoji: '🫁',
    categoryTag: 'Funcional',
    sex: 'Ambos',
    minAge: 18,
    maxAge: 99,
    factors: ['smoking', 'vaping'],
    description:
      'Prueba funcional respiratoria que mide el volumen y la velocidad del aire que inhalas y exhalas, detectando obstrucción bronquial o disminución de la capacidad pulmonar.',
    preparation:
      'Agendar cita previa con orden médica. No fumar ni vapear al menos 24 horas antes. Evitar comidas abundantes, cafeína o ejercicio vigoroso 4 horas antes y acudir con ropa holgada.',
    preferredMonth: 8,
    preferredHour: 10,
    preferredMin: 0,
    durationMin: 45,
    colorId: '11',
  },
  {
    id: 'R-11',
    title: 'Revisión dental integral',
    emoji: '🦷',
    categoryTag: 'Odontología',
    sex: 'Ambos',
    minAge: 18,
    maxAge: 99,
    factors: ['smoking', 'ultraprocessed'],
    description:
      'Evaluación odontológica para revisar dientes, encías y mucosa oral, realizar limpieza profesional y prevenir caries, gingivitis, enfermedad periodontal o lesiones bucales.',
    preparation:
      'Realizar cepillado dental habitual antes de acudir a la consulta. Comunicar al odontólogo si existe embarazo, alergias a medicamentos o si se toman anticoagulantes.',
    preferredMonth: 4,
    preferredHour: 11,
    preferredMin: 0,
    durationMin: 45,
    colorId: '5',
  },
  {
    id: 'R-12',
    title: 'Esquema de vacunación',
    emoji: '💉',
    categoryTag: 'Inmunización',
    sex: 'Ambos',
    minAge: 18,
    maxAge: 99,
    factors: ['none'],
    description:
      'Revisión de cartilla y aplicación de biológicos de refuerzo (como Influenza, Tétanos-Difteria, Hepatitis B o VPH) para mantener activa la inmunidad contra enfermedades infecciosas.',
    preparation:
      'Presentar Cartilla Nacional de Salud o comprobantes previos. Acudir sin fiebre ni infecciones agudas en curso y comunicar al personal de enfermería si existe embarazo o alergias graves.',
    preferredMonth: 11,
    preferredHour: 10,
    preferredMin: 30,
    durationMin: 30,
    colorId: '11',
  },
  {
    id: 'R-13',
    title: 'Presión arterial',
    emoji: '🩺',
    categoryTag: 'Cardiovascular',
    sex: 'Ambos',
    minAge: 18,
    maxAge: 99,
    factors: ['sedentary', 'smoking', 'vaping', 'ultraprocessed'],
    routineByAgeSex: true,
    description:
      'Medición no invasiva de la fuerza que ejerce la sangre contra las paredes arteriales durante el latido y el reposo cardiaco, fundamental para detectar hipertensión silenciosa.',
    preparation:
      'Permanecer sentado y en reposo absoluto durante 5 a 10 minutos antes de la medición, con la espalda apoyada y los pies en el suelo. Evitar cafeína, fumar, vapear o hacer ejercicio 30 minutos antes.',
    preferredMonth: 5,
    preferredHour: 9,
    preferredMin: 30,
    durationMin: 25,
    colorId: '11',
  },
  {
    id: 'R-14',
    title: 'Perfil de lípidos',
    emoji: '🫀',
    categoryTag: 'Laboratorio',
    sex: 'Ambos',
    minAge: 35,
    maxAge: 99,
    factors: ['sedentary', 'smoking', 'ultraprocessed'],
    routineByAgeSex: true,
    description:
      'Análisis de sangre que cuantifica colesterol total, colesterol HDL (protector), colesterol LDL y triglicéridos para calcular el riesgo de enfermedad cardiovascular y aterosclerosis.',
    preparation:
      'Agendar cita previa con orden médica. Ayuno estricto de 9 a 12 horas (solo agua simple). Mantener la dieta habitual los días previos y evitar el consumo de alcohol 48 horas antes.',
    preferredMonth: 3,
    preferredHour: 8,
    preferredMin: 0,
    durationMin: 30,
    colorId: '11',
  },
  {
    id: 'R-15',
    title: 'Valoración y autoexploración testicular',
    emoji: '🩻',
    categoryTag: 'Prevención',
    sex: 'Masculino',
    minAge: 18,
    maxAge: 45,
    factors: ['none'],
    description:
      'Revisión clínica y guía de autoexploración mensual de los testículos para detectar de forma oportuna nódulos, inflamación, varicocele o cambios de consistencia.',
    preparation:
      'Realizar baño con agua tibia antes de la autoexploración para relajar el escroto. En caso de requerir valoración médica o ultrasonido escrotal, agendar cita previa sin preparación especial.',
    preferredMonth: 6,
    preferredHour: 11,
    preferredMin: 0,
    durationMin: 30,
    colorId: '5',
  },
];

export const DEFAULT_PROFILE: UserHealthProfile = {
  age: 35,
  gender: 'female',
  isSedentary: false,
  riskFactors: {
    smoking: false,
    vaping: false,
    alcohol: false,
    ultraprocessed: true,
  },
  timeZone: getDefaultTimeZone(),
};

export function createEmptyProfileDraft(): ProfileDraft {
  return {
    age: '',
    gender: null,
    isSedentary: null,
    riskFactors: {
      smoking: false,
      vaping: false,
      alcohol: false,
      ultraprocessed: false,
    },
    timeZone: getDefaultTimeZone(),
  };
}

export interface ProfileValidationErrors {
  age?: string;
  gender?: string;
  isSedentary?: string;
}

export function validateProfileDraft(draft: ProfileDraft): {
  profile: UserHealthProfile | null;
  errors: ProfileValidationErrors;
} {
  const errors: ProfileValidationErrors = {};
  const trimmedAge = draft.age.trim();
  const parsedAge = Number(trimmedAge);

  if (
    !trimmedAge ||
    !Number.isInteger(parsedAge) ||
    parsedAge < 18 ||
    parsedAge > 95
  ) {
    errors.age = 'Selecciona una edad entre 18 y 95 años.';
  }

  if (draft.gender !== 'female' && draft.gender !== 'male') {
    errors.gender = 'Selecciona tu sexo.';
  }

  if (draft.isSedentary === null) {
    errors.isSedentary = 'Selecciona tu nivel de actividad física semanal.';
  }

  if (Object.keys(errors).length > 0 || draft.gender === null || draft.isSedentary === null) {
    return { profile: null, errors };
  }

  return {
    profile: {
      age: parsedAge,
      gender: draft.gender,
      isSedentary: draft.isSedentary,
      riskFactors: { ...draft.riskFactors },
      timeZone: draft.timeZone,
    },
    errors: {},
  };
}

export interface RollingMonthSlot {
  year: number;
  month: number; // 1-12
  baseDay: number;
}

export function getDatePartsInTimeZone(
  date: Date,
  timeZone: string
): { year: number; month: number; day: number } {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(date);
    const year = Number(parts.find((p) => p.type === 'year')?.value);
    const month = Number(parts.find((p) => p.type === 'month')?.value);
    const day = Number(parts.find((p) => p.type === 'day')?.value);
    if (year && month && day) {
      return { year, month, day };
    }
  } catch {
    // Fallback to local Date components
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

/**
 * Computes the 12 upcoming monthly slots starting from when the user requests the plan.
 * If the current day in the user's timezone is <= 24, slot 0 starts in the current month
 * at least 3 days ahead (day = max(12, curDay + 3), <= 27). Otherwise slot 0 starts next month.
 */
export function getRollingMonths(
  referenceDate: Date = new Date(),
  timeZone: string = getDefaultTimeZone()
): RollingMonthSlot[] {
  const { year: curYear, month: curMonth, day: curDay } = getDatePartsInTimeZone(
    referenceDate,
    timeZone
  );

  const startOffset = curDay <= 24 ? 0 : 1;
  const slots: RollingMonthSlot[] = [];

  for (let i = 0; i < 12; i++) {
    const zeroBasedMonth = curMonth - 1 + startOffset + i;
    const year = curYear + Math.floor(zeroBasedMonth / 12);
    const month = (zeroBasedMonth % 12) + 1;
    const isCurrentMonth = i === 0 && startOffset === 0;
    const baseDay = isCurrentMonth ? Math.min(27, Math.max(12, curDay + 3)) : 12;
    slots.push({ year, month, baseDay });
  }

  return slots;
}

export function getActiveRiskFactorKeys(profile: UserHealthProfile): RiskFactorKey[] {
  const active: RiskFactorKey[] = [];
  if (profile.isSedentary) active.push('sedentary');
  if (profile.riskFactors.smoking) active.push('smoking');
  if (profile.riskFactors.vaping) active.push('vaping');
  if (profile.riskFactors.alcohol) active.push('alcohol');
  if (profile.riskFactors.ultraprocessed) active.push('ultraprocessed');
  return active;
}

/**
 * Evaluates which matrix studies apply to the user profile and schedules them
 * across the upcoming 12 months starting from referenceDate without saturating a single month.
 */
export function generatePreventiveStudyPlan(
  profile: UserHealthProfile,
  referenceDate: Date = new Date()
): ScheduledPreventiveStudy[] {
  const { age, gender, timeZone } = profile;
  const activeRisks = getActiveRiskFactorKeys(profile);
  const rollingMonths = getRollingMonths(referenceDate, timeZone);

  const matchingRows = PREVENTIVE_MATRIX.filter((row) => {
    const sexMatches =
      row.sex === 'Ambos' ||
      (row.sex === 'Femenino' && gender === 'female') ||
      (row.sex === 'Masculino' && gender === 'male');

    if (!sexMatches) return false;

    const ageMatches = age >= row.minAge && age <= row.maxAge;
    if (!ageMatches) return false;

    if (row.routineByAgeSex || row.factors.includes('none') || row.factors.includes('age')) {
      return true;
    }

    return row.factors.some((f) => activeRisks.includes(f as RiskFactorKey));
  });

  // Track month loads across the 12 rolling slots to guarantee balanced distribution
  const slotCounts: number[] = Array(12).fill(0);

  return matchingRows.map((row) => {
    let assignedIdx = rollingMonths.findIndex((s) => s.month === row.preferredMonth);
    if (assignedIdx === -1) assignedIdx = 0;

    if (slotCounts[assignedIdx] > 0) {
      let bestIdx = assignedIdx;
      let minCount = slotCounts[assignedIdx];
      for (let i = 0; i < 12; i++) {
        if (slotCounts[i] < minCount) {
          minCount = slotCounts[i];
          bestIdx = i;
        }
      }
      assignedIdx = bestIdx;
    }

    const slot = rollingMonths[assignedIdx];
    const slotInMonth = slotCounts[assignedIdx];
    slotCounts[assignedIdx] += 1;

    // Stagger day within the month if a second event ever shares a month
    const day = Math.min(28, slot.baseDay + slotInMonth * 10);

    const endMinutesTotal = row.preferredMin + row.durationMin;
    const endHour = row.preferredHour + Math.floor(endMinutesTotal / 60);
    const endMin = endMinutesTotal % 60;

    const startDateTime = formatToIsoWithOffset(
      slot.year,
      slot.month,
      day,
      row.preferredHour,
      row.preferredMin,
      timeZone
    );
    const endDateTime = formatToIsoWithOffset(
      slot.year,
      slot.month,
      day,
      endHour,
      endMin,
      timeZone
    );

    const matchedReasons: string[] = [];
    if (row.routineByAgeSex || row.factors.includes('none') || row.factors.includes('age')) {
      matchedReasons.push(
        row.sex === 'Ambos'
          ? `Edad (${row.minAge}-${row.maxAge} años)`
          : `${row.sex} (${row.minAge}-${row.maxAge} años)`
      );
    }

    row.factors.forEach((f) => {
      if (activeRisks.includes(f as RiskFactorKey)) {
        matchedReasons.push(RISK_FACTOR_LABELS[f as RiskFactorKey]);
      }
    });

    const calendarDescription = `${row.description}\n\nPreparación e indicaciones:\n${row.preparation}`;

    const event: GoogleCalendarEvent = {
      id: row.id,
      summary: `${row.emoji} ${row.title}`,
      description: calendarDescription,
      start: {
        dateTime: startDateTime,
        timeZone,
      },
      end: {
        dateTime: endDateTime,
        timeZone,
      },
      colorId: row.colorId,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 2880 },
          { method: 'popup', minutes: 1440 },
          { method: 'popup', minutes: 120 },
        ],
      },
    };

    return {
      matrixId: row.id,
      title: row.title,
      categoryTag: row.categoryTag,
      description: row.description,
      preparation: row.preparation,
      matchedReasons,
      event,
    };
  });
}

export function generatePreventivePlan(
  profile: UserHealthProfile,
  referenceDate: Date = new Date()
): GoogleCalendarEvent[] {
  return generatePreventiveStudyPlan(profile, referenceDate).map((item) => item.event);
}

export function filterEventsByCategory(
  events: GoogleCalendarEvent[],
  category: 'all' | 'medical' | 'lifestyle'
): GoogleCalendarEvent[] {
  if (category === 'all') return events;
  if (category === 'medical') return events.filter((e) => e.colorId === '11');
  if (category === 'lifestyle') return events.filter((e) => e.colorId === '5');
  return events;
}
