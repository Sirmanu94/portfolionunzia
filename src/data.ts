export type Media = { id: string; label: string; image?: boolean };
export type Project = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  contribution: string;
  note: string;
  instagram?: string;
  feed?: string;
  media: Media[];
};

export const projects: Project[] = [
  {
    id: 'riviera', name: 'La Riviera di Parthenope', category: 'FOOD & STORYTELLING',
    tags: ['Food Content', 'Editorial Planning', 'Video Editing'],
    description: 'Una comunicazione costruita intorno alla cucina, ai suoi dettagli e alla preparazione dei piatti. Il progetto combina contenuti verticali, storytelling visivo e continuità editoriale per valorizzare l’esperienza gastronomica attraverso un linguaggio immediato e adatto ai social.',
    contribution: 'Piano editoriale · contenuti verticali · montaggio video',
    note: 'Il gusto, prima ancora dell’assaggio.',
    instagram: 'https://www.instagram.com/larivieradiparthenopenapoli?stkn=MW9tOTZ5amNhN3VyaQ==',
    feed: 'riviera-feed',
    media: [{ id: 'video-7', label: 'Ragù di agnello' }, { id: 'video-0', label: 'Il carciofo' }, { id: 'video-8', label: 'Risotto ai gamberi' }],
  },
  {
    id: 'carbone', name: 'Carbone Meat House', category: 'FOOD & BRAND IDENTITY',
    tags: ['Food Content', 'Social Media', 'Video Editing'],
    description: 'Contenuti pensati per raccontare un’identità food più premium, valorizzando il prodotto, le lavorazioni e l’esperienza del brand. I video alternano storytelling, contenuti informativi e momenti dedicati alla preparazione, mantenendo una comunicazione riconoscibile e coerente.',
    contribution: 'Contenuti food · storytelling · montaggio video',
    note: 'Dare spazio alla qualità, in ogni dettaglio.',
    instagram: 'https://www.instagram.com/carbonemeathouse?stkn=MXg1ZWw3cnEwNGo3Mg==',
    feed: 'carbone-feed',
    media: [{ id: 'video-11', label: 'Preparazione del filetto · Parte 1' }, { id: 'video-12', label: 'Preparazione del filetto · Parte 2' }, { id: 'carbone-graphic', label: 'Comunicazione chiusura estiva', image: true }],
  },
  {
    id: 'iperboat', name: 'IperBoat', category: 'B2B & TECHNICAL CONTENT',
    tags: ['B2B Social Content', 'Video Editing', 'Graphic Content'],
    description: 'Comunicare un settore tecnico sui social significa trasformare informazioni e prodotti complessi in contenuti semplici e immediati. Per IperBoat ho lavorato su contenuti video e grafiche rivolti a un pubblico professionale, mantenendo una comunicazione più accessibile senza perdere l’identità tecnica del brand.',
    contribution: 'Contenuti B2B · grafiche · montaggio video',
    note: 'Anche la tecnica ha una storia da raccontare.',
    instagram: 'https://www.instagram.com/iperboat?stkn=eHgydTdrazU0OHJ4',
    feed: 'iperboat-feed',
    media: [{ id: 'iperboat-graphic', label: 'Sei un rivenditore?', image: true }, { id: 'video-2', label: 'La voce dell’azienda' }],
  },
  {
    id: 'arma', name: 'Arma Contact', category: 'PEOPLE & CORPORATE',
    tags: ['Corporate Content', 'Interviews', 'Social Video'],
    description: 'Un approccio più corporate alla comunicazione social, basato su persone, testimonianze e contenuti informativi. Il montaggio è pensato per rendere il messaggio immediato anche nella fruizione mobile, attraverso ritmo, sottotitoli e una struttura narrativa semplice.',
    contribution: 'Interviste · contenuti corporate · montaggio social',
    note: 'Le persone al centro del messaggio.',
    instagram: 'https://www.instagram.com/armacontact?stkn=MXdnanFybHNzNjFodg==',
    feed: 'arma-feed',
    media: [{ id: 'video-13', label: 'Opportunità e persone' }, { id: 'video-9', label: 'La comunicazione passa dalle persone' }],
  },
];

export const moreSocial = [
  { name: 'Gorillas Burger', category: 'FOOD / SOCIAL CONTENT', instagram: 'https://www.instagram.com/gorillasburger_napoli?stkn=MXU2aGhjbHIyYjZjeQ==' },
  { name: 'Serra Carni', category: 'FOOD / SOCIAL CONTENT', instagram: 'https://www.instagram.com/serra_carni?stkn=ZHY3eGI0eXZnaWxv' },
];

export const steps = [
  ['Discover', 'Ogni progetto parte da una prima fase di confronto per comprendere brand, obiettivi, pubblico e comunicazione esistente.'],
  ['Define', 'Individuo insieme al team la direzione creativa, i formati e il tipo di contenuto più adatto.'],
  ['Create', 'I contenuti vengono sviluppati attraverso shooting, materiali disponibili, grafiche e video.'],
  ['Plan', 'Organizzo i contenuti all’interno del piano editoriale, costruendo una comunicazione coerente nel tempo.'],
  ['Edit', 'Lavoro sul montaggio dei contenuti video adattandoli ai formati social.'],
  ['Publish', 'Una volta approvato il piano editoriale, i contenuti vengono programmati e pubblicati sui diversi canali.'],
] as const;

export const skills = [
  ['Social Media Management', 'Gestione coerente dei profili e della comunicazione.'],
  ['Editorial Planning', 'Una direzione chiara per contenuti e formati.'],
  ['Copywriting', 'Parole adatte alla voce di ogni brand.'],
  ['Video Editing', 'Ritmo e struttura per i formati verticali.'],
  ['Social Content Creation', 'Idee visive pensate per i canali social.'],
  ['Content Organization', 'Materiali e pubblicazioni sempre ordinati.'],
  ['Content Scheduling', 'Continuità nella programmazione dei contenuti.'],
] as const;
