/** Categorías de vídeo y el JSON que las alimenta (lo regenera la GitHub Action). */
export const CATEGORY_JSON_PATHS = {
    telenit: '/assets/data/listado_telenit.json',
    entrevistas: '/assets/data/listado_entrevistas.json',
    eventos: '/assets/data/listado_eventos.json',
} as const;

export type CategoryId = keyof typeof CATEGORY_JSON_PATHS;

export const CATEGORY_IDS = Object.keys(CATEGORY_JSON_PATHS) as CategoryId[];

export const CATEGORY_BG_COLORS: Record<CategoryId, string> = {
    telenit: 'bg-[#EAEFFF] dark:bg-[#596a7f]',
    entrevistas: 'bg-[#FFEDE9] dark:bg-[#7f595b]',
    eventos: 'bg-[#F9EFE2] dark:bg-[#726a53]',
};
