
import { NarratorOption } from './types';

export const NARRATORS: NarratorOption[] = [
  {
    id: 'male',
    name: 'Voz Masculina (Padrão)',
    description: 'Clara e objetiva',
    icon: 'record_voice_over',
    color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    voiceName: 'Puck'
  },
  {
    id: 'female',
    name: 'Voz Feminina (Suave)',
    description: 'Calma e relaxante',
    icon: 'female',
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
    voiceName: 'Kore'
  },
  {
    id: 'dramatic',
    name: 'Dramatizada',
    description: 'Com efeitos sonoros e música',
    icon: 'theater_comedy',
    color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    voiceName: 'Zephyr'
  }
];

export const INITIAL_SETTINGS = {
  narrator: 'male',
  readingSpeed: 1.0,
  autoPlay: true
};

export const SPEED_OPTIONS = [0.5, 1.0, 1.5, 2.0];

export interface DailyVerse {
  reference: string;
  text: string;
  originalText?: string;
  theme: string;
}

export const DAILY_VERSES: DailyVerse[] = [
  {
    reference: 'João 1:1',
    text: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.',
    originalText: 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόgος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.',
    theme: 'Cristologia e Teologia do Logos'
  },
  {
    reference: 'Efésios 2:8',
    text: 'Porque pela graça sois salvos, por meio da fé; e isso não vem de vós, é dom de Deus.',
    originalText: 'τῇ γὰρ χάριτί ἐστε σεσῳσμένοι διὰ πίστεως· καὶ τοῦτο οὐκ ἐξ ὑμῶν, θεοῦ τὸ δῶρον·',
    theme: 'Soteriologia e Graça Divina'
  },
  {
    reference: 'Hebreus 4:12',
    text: 'Porque a palavra de Deus é viva e eficaz, e mais penetrante do que qualquer espada de dois gumes.',
    originalText: 'Ζῶν γὰρ ὁ λόγος τοῦ θεοῦ καὶ ἐνεργὴς καὶ τομώτερος ὑπὲρ πᾶσαν μάχαιραν δίστομον...',
    theme: 'Bibliologia e Eficácia da Palavra'
  },
  {
    reference: 'Romanos 5:1',
    text: 'Sendo, pois, justificados pela fé, temos paz com Deus, por nosso Senhor Jesus Cristo.',
    originalText: 'Δικαιωθέντες οὖν ἐκ πίστεως εἰρήνην ἔχομεν πρὸς τὸν θεὸν διὰ τοῦ κυρίου ἡμῶν Ἰησοῦ Χριστοῦ',
    theme: 'Justificação e Paz Teológica'
  },
  {
    reference: 'Salmo 119:105',
    text: 'Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.',
    originalText: 'נֵר-לְרַגְלִי דְבָרֶךָ; וְאוֹר, לִנְתִיבָתִי.',
    theme: 'Revelação e Direção Divina'
  }
];

