import type { Take } from '../types';

// Configuration for all 7 takes
export const TAKES: Take[] = [
    {
        id: 1,
        videoPath: 'Video/toma_1.MOV',
        audioPath: 'Audio/toma_1.m4a',
        transcription: 'En el 2024, Warren Buffett logró un 22%.',
        images: ['Images/warren_buffet.jpg'],
        enableZoom: false,
        audioStartFrom: 1.20,  // Skip first 1.20 seconds
        videoStartFrom: 1.20,  // Skip first 1.20 seconds
    },
    {
        id: 2,
        videoPath: 'Video/toma_2.MOV',
        audioPath: 'Audio/toma_2.m4a',
        transcription:
            'siendo uno de los inversores más importantes del planeta y teniendo todo un equipo de egresados de Harvard trabajando para él.',
        images: ['Images/warren_buffet_2.png'],
        enableZoom: false,
    },
    {
        id: 3,
        videoPath: 'Video/toma_3.MOV',
        audioPath: 'Audio/toma_3.m4a',
        transcription: 'Él solo logró un 22%. ¿Pero sabes quién logró 35%?',
        images: ['Images/warren_buffet_3.webp'],
        enableZoom: false,
    },
    {
        id: 4,
        videoPath: 'Video/toma_4.MOV',
        audioPath: 'Audio/toma_4.m4a',
        transcription:
            'el Congreso de Estados Unidos. Personas que en su mayoría tienen de sesenta a ochenta años, compran acciones desde su teléfono y no tienen ni idea ni un equipo detrás de analistas, como lo tendría Warren Buffett.',
        images: ['Images/capitolio.jpg'],
        enableZoom: true, // Longer take needs zoom
    },
    {
        id: 5,
        videoPath: 'Video/toma_5.MOV',
        audioPath: 'Audio/toma_5.m4a',
        transcription:
            'Nancy Pelosi logró un 103% con Google. Marjorie Taylor Greene logró un 117% con AMD, resultados que Warren Buffett solo podría haber soñado.',
        images: [
            'Images/nancy_pelosi.avif',
            'Images/google.png',
            'Images/marjorie_taylor.webp',
            'Images/amd.webp',
            'Images/stock_market.webp',
        ],
        enableZoom: true, // Longer take needs zoom
    },
    {
        id: 6,
        videoPath: 'Video/toma_6.MOV',
        audioPath: 'Audio/toma_6.m4a',
        transcription:
            'Inversores como Warren Buffett tienen que enfrentarse a la incertidumbre del mercado. Los políticos ya saben qué va a pasar, y por eso nosotros seguimos a los políticos.',
        images: ['Images/stock_market.webp', 'Images/warren_buffet_4.jpg'],
        enableZoom: true, // Longer take needs zoom
    },
    {
        id: 7,
        videoPath: 'Video/toma_7.MOV',
        audioPath: 'Audio/toma_7.m4a',
        transcription: '¿Si quieres saber cómo lo hacemos? Síguenos!',
        images: ['Images/cash_piles.jpg'],
        enableZoom: false,
    },
];

// Keywords to trigger image overlays
export const IMAGE_KEYWORDS: Record<string, string[]> = {
    'Images/warren_buffet.jpg': ['Warren Buffett', 'Buffett', 'inversores'],
    'Images/warren_buffet_2.png': ['Warren Buffett', 'Buffett', 'inversores'],
    'Images/warren_buffet_3.webp': ['Warren Buffett', 'Buffett', '22%', '35%'],
    'Images/warren_buffet_4.jpg': ['Warren Buffett', 'Buffett'],
    'Images/capitolio.jpg': ['Congreso'],
    'Images/nancy_pelosi.avif': ['Nancy Pelosi', 'Pelosi'],
    'Images/marjorie_taylor.webp': ['Marjorie Taylor Greene', 'Greene'],
    'Images/amd.webp': ['AMD'],
    'Images/google.png': ['Google', '35%'],
    'Images/stock_market.webp': ['mercado', 'acciones'],
    'Images/cash_piles.jpg': ['quieres saber', 'cómo lo hacemos'],
};

