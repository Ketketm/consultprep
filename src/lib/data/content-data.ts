import type { Flashcard, SessionItem, ContentItem } from '@/lib/types';
import type { Language } from '@/lib/store/language-store';

// Content item from JSON structure
export interface ContentPack {
  packId: string;
  title: { fr: string; en: string };
  pillarSlug: string;
  items: ContentPackItem[];
}

export interface ContentPackItem {
  q: { fr: string; en: string };
  a: string;
  explanation: { fr: string; en: string };
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'flashcard' | 'drill' | 'formula' | 'definition';
  inputType?: 'typing' | 'reveal'; // typing = user types answer, reveal = flip card
}

// Convert JSON content to session items
function createSessionItem(
  packId: string,
  item: ContentPackItem,
  index: number,
  lang: Language = 'fr'
): SessionItem {
  const contentItemId = `${packId}-${index}`;
  const xpValue = item.difficulty === 'Easy' ? 5 : item.difficulty === 'Medium' ? 10 : 15;

  const contentItem: ContentItem = {
    id: contentItemId,
    lessonId: packId,
    contentType: 'flashcard',
    difficulty: item.difficulty === 'Easy' ? 1 : item.difficulty === 'Medium' ? 2 : 3,
    tags: [packId],
    estimatedSeconds: 30,
    xpValue,
    displayOrder: index,
  };

  // Store inputType in tags for the flashcard component to access
  if (item.inputType === 'typing') {
    contentItem.tags.push('typing');
  }

  const flashcard: Flashcard = {
    contentItemId,
    frontContent: item.q[lang],
    frontImageUrl: null,
    backContent: item.a,
    backImageUrl: null,
    explanation: item.explanation[lang],
    formula: item.type === 'formula' ? item.a : null,
    mnemonic: null,
    relatedFlashcardIds: [],
  };

  return { contentItem, detail: flashcard };
}

// Maths & Tools content packs
export const MATHS_TOOLS_CONTENT: ContentPack[] = [
  {
    packId: 'squares_1_25',
    title: { fr: 'Carrés 1–25', en: 'Squares 1–25' },
    pillarSlug: 'maths_tools',
    items: [
      { q: { fr: 'Carré de 1 ?', en: 'Square of 1?' }, a: '1', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 2 ?', en: 'Square of 2?' }, a: '4', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 3 ?', en: 'Square of 3?' }, a: '9', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 4 ?', en: 'Square of 4?' }, a: '16', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 5 ?', en: 'Square of 5?' }, a: '25', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 6 ?', en: 'Square of 6?' }, a: '36', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 7 ?', en: 'Square of 7?' }, a: '49', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 8 ?', en: 'Square of 8?' }, a: '64', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 9 ?', en: 'Square of 9?' }, a: '81', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 10 ?', en: 'Square of 10?' }, a: '100', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 11 ?', en: 'Square of 11?' }, a: '121', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 12 ?', en: 'Square of 12?' }, a: '144', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 13 ?', en: 'Square of 13?' }, a: '169', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 14 ?', en: 'Square of 14?' }, a: '196', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 15 ?', en: 'Square of 15?' }, a: '225', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 16 ?', en: 'Square of 16?' }, a: '256', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 17 ?', en: 'Square of 17?' }, a: '289', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 18 ?', en: 'Square of 18?' }, a: '324', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 19 ?', en: 'Square of 19?' }, a: '361', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 20 ?', en: 'Square of 20?' }, a: '400', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 21 ?', en: 'Square of 21?' }, a: '441', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 22 ?', en: 'Square of 22?' }, a: '484', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 23 ?', en: 'Square of 23?' }, a: '529', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Hard', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 24 ?', en: 'Square of 24?' }, a: '576', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Hard', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Carré de 25 ?', en: 'Square of 25?' }, a: '625', explanation: { fr: 'Un nombre au carré est le produit du nombre par lui-même.', en: 'A squared number is the product of a number by itself.' }, difficulty: 'Hard', type: 'flashcard', inputType: 'typing' },
    ],
  },
  {
    packId: 'cubes_1_20',
    title: { fr: 'Cubes 1–20', en: 'Cubes 1–20' },
    pillarSlug: 'maths_tools',
    items: [
      { q: { fr: 'Cube de 1 ?', en: 'Cube of 1?' }, a: '1', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 2 ?', en: 'Cube of 2?' }, a: '8', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 3 ?', en: 'Cube of 3?' }, a: '27', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 4 ?', en: 'Cube of 4?' }, a: '64', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 5 ?', en: 'Cube of 5?' }, a: '125', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 6 ?', en: 'Cube of 6?' }, a: '216', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 7 ?', en: 'Cube of 7?' }, a: '343', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 8 ?', en: 'Cube of 8?' }, a: '512', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 9 ?', en: 'Cube of 9?' }, a: '729', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 10 ?', en: 'Cube of 10?' }, a: '1000', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Easy', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 11 ?', en: 'Cube of 11?' }, a: '1331', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 12 ?', en: 'Cube of 12?' }, a: '1728', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 13 ?', en: 'Cube of 13?' }, a: '2197', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 14 ?', en: 'Cube of 14?' }, a: '2744', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 15 ?', en: 'Cube of 15?' }, a: '3375', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Medium', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 16 ?', en: 'Cube of 16?' }, a: '4096', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Hard', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 17 ?', en: 'Cube of 17?' }, a: '4913', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Hard', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 18 ?', en: 'Cube of 18?' }, a: '5832', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Hard', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 19 ?', en: 'Cube of 19?' }, a: '6859', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Hard', type: 'flashcard', inputType: 'typing' },
      { q: { fr: 'Cube de 20 ?', en: 'Cube of 20?' }, a: '8000', explanation: { fr: "Le cube d'un nombre est n×n×n.", en: 'The cube of a number is n×n×n.' }, difficulty: 'Hard', type: 'flashcard', inputType: 'typing' },
    ],
  },
  {
    packId: 'mental_multiplication',
    title: { fr: 'Astuces de multiplication', en: 'Multiplication Tricks' },
    pillarSlug: 'maths_tools',
    items: [
      { q: { fr: 'Astuce multiplication par 4 (ex: 4 × 7) ?', en: 'Trick for multiplying by 4 (e.g., 4 × 7)?' }, a: '28', explanation: { fr: 'Doublez le nombre deux fois : 7 × 2 = 14, puis 14 × 2 = 28.', en: 'Double the number twice: 7 × 2 = 14, then 14 × 2 = 28.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Astuce multiplication par 8 (ex: 8 × 5) ?', en: 'Trick for multiplying by 8 (e.g., 8 × 5)?' }, a: '40', explanation: { fr: 'Doublez trois fois : 5 × 2 = 10, 10 × 2 = 20 et 20 × 2 = 40.', en: 'Double three times: 5 × 2 = 10, 10 × 2 = 20, and 20 × 2 = 40.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Astuce multiplication par 5 (ex: 5 × 13) ?', en: 'Trick for multiplying by 5 (e.g., 5 × 13)?' }, a: '65', explanation: { fr: 'Multipliez par 10 puis divisez par 2 : 13 × 10 = 130 et 130 ÷ 2 = 65.', en: 'Multiply by 10 then divide by 2: 13 × 10 = 130 and 130 ÷ 2 = 65.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Astuce multiplication par 11 (ex: 11 × 23) ?', en: 'Trick for multiplying by 11 (e.g., 11 × 23)?' }, a: '253', explanation: { fr: 'Séparez les chiffres 2 et 3, insérez leur somme (2+3=5) au milieu : 253.', en: 'Separate digits 2 and 3, insert their sum (2+3=5) in the middle: 253.' }, difficulty: 'Medium', type: 'flashcard' },
      { q: { fr: 'Astuce multiplication par 25 (ex: 17 × 25) ?', en: 'Trick for multiplying by 25 (e.g., 17 × 25)?' }, a: '425', explanation: { fr: 'Multipliez par 100 puis divisez par 4 : 1700 ÷ 4 = 425.', en: 'Multiply by 100 then divide by 4: 1700 ÷ 4 = 425.' }, difficulty: 'Medium', type: 'flashcard' },
      { q: { fr: 'Astuce multiplication par 9 (ex: 9 × 7) ?', en: 'Trick for multiplying by 9 (e.g., 9 × 7)?' }, a: '63', explanation: { fr: 'Pliez le 7ᵉ doigt ; à gauche 6 doigts et à droite 3 doigts → 63.', en: 'Fold down the 7th finger; 6 fingers left and 3 right → 63.' }, difficulty: 'Medium', type: 'flashcard' },
    ],
  },
  {
    packId: 'fractions_pourcentages',
    title: { fr: 'Conversions pourcentages & fractions', en: 'Percentage & Fraction Conversions' },
    pillarSlug: 'maths_tools',
    items: [
      { q: { fr: 'Fraction 1/2 en pourcentage ?', en: '1/2 as a percentage?' }, a: '50%', explanation: { fr: 'Pour convertir en pourcentage, divisez puis multipliez par 100.', en: 'To convert to percentage, divide then multiply by 100.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Fraction 1/3 en pourcentage ?', en: '1/3 as a percentage?' }, a: '33.33%', explanation: { fr: 'Pour convertir en pourcentage, divisez puis multipliez par 100.', en: 'To convert to percentage, divide then multiply by 100.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Fraction 1/4 en pourcentage ?', en: '1/4 as a percentage?' }, a: '25%', explanation: { fr: 'Pour convertir en pourcentage, divisez puis multipliez par 100.', en: 'To convert to percentage, divide then multiply by 100.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Fraction 1/5 en pourcentage ?', en: '1/5 as a percentage?' }, a: '20%', explanation: { fr: 'Pour convertir en pourcentage, divisez puis multipliez par 100.', en: 'To convert to percentage, divide then multiply by 100.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Fraction 2/3 en pourcentage ?', en: '2/3 as a percentage?' }, a: '66.67%', explanation: { fr: 'Pour convertir en pourcentage, divisez puis multipliez par 100.', en: 'To convert to percentage, divide then multiply by 100.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Fraction 3/4 en pourcentage ?', en: '3/4 as a percentage?' }, a: '75%', explanation: { fr: 'Pour convertir en pourcentage, divisez puis multipliez par 100.', en: 'To convert to percentage, divide then multiply by 100.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Pourcentage 10% en fraction ?', en: '10% as a fraction?' }, a: '1/10', explanation: { fr: 'Pour convertir un pourcentage en fraction, divisez par 100 puis simplifiez.', en: 'To convert percentage to fraction, divide by 100 then simplify.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Pourcentage 12.5% en fraction ?', en: '12.5% as a fraction?' }, a: '1/8', explanation: { fr: 'Pour convertir un pourcentage en fraction, divisez par 100 puis simplifiez.', en: 'To convert percentage to fraction, divide by 100 then simplify.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Pourcentage 25% en fraction ?', en: '25% as a fraction?' }, a: '1/4', explanation: { fr: 'Pour convertir un pourcentage en fraction, divisez par 100 puis simplifiez.', en: 'To convert percentage to fraction, divide by 100 then simplify.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Pourcentage 75% en fraction ?', en: '75% as a fraction?' }, a: '3/4', explanation: { fr: 'Pour convertir un pourcentage en fraction, divisez par 100 puis simplifiez.', en: 'To convert percentage to fraction, divide by 100 then simplify.' }, difficulty: 'Easy', type: 'flashcard' },
    ],
  },
  {
    packId: 'interet_compose',
    title: { fr: 'Intérêt composé & valeur future', en: 'Compound Interest & Future Value' },
    pillarSlug: 'maths_tools',
    items: [
      { q: { fr: 'Formule de la valeur future avec intérêts composés ?', en: 'Future value formula with compound interest?' }, a: 'FV = PV × (1 + r)^n', explanation: { fr: 'FV = valeur future, PV = valeur actuelle, r = taux annuel, n = années.', en: 'FV = future value, PV = present value, r = annual rate, n = years.' }, difficulty: 'Medium', type: 'formula' },
      { q: { fr: "Formule de l'intérêt simple ?", en: 'Simple interest formula?' }, a: 'I = P × r × t', explanation: { fr: 'I = intérêt, P = principal, r = taux (décimal), t = temps.', en: 'I = interest, P = principal, r = rate (decimal), t = time.' }, difficulty: 'Easy', type: 'formula' },
      { q: { fr: 'Règle de 72 pour estimer le temps de doublement ?', en: 'Rule of 72 for estimating doubling time?' }, a: '72 / rate (%)', explanation: { fr: 'La règle de 72 estime rapidement le temps de doublement.', en: 'The rule of 72 quickly estimates doubling time.' }, difficulty: 'Easy', type: 'formula' },
      { q: { fr: 'Calculer la valeur future de 1000€ à 6% sur 5 ans.', en: 'Calculate future value of €1000 at 6% over 5 years.' }, a: '≈ €1338', explanation: { fr: 'On applique FV = PV × (1 + r)^n = 1000 × (1.06)^5.', en: 'Apply FV = PV × (1 + r)^n = 1000 × (1.06)^5.' }, difficulty: 'Medium', type: 'drill' },
      { q: { fr: "Combien d'années pour doubler à 9% (règle de 72) ?", en: 'How many years to double at 9% (rule of 72)?' }, a: '8 years', explanation: { fr: 'On divise 72 par le taux: 72 / 9 = 8.', en: 'Divide 72 by the rate: 72 / 9 = 8.' }, difficulty: 'Medium', type: 'drill' },
    ],
  },
  {
    packId: 'npv_roi',
    title: { fr: 'NPV & ROI', en: 'NPV & ROI' },
    pillarSlug: 'maths_tools',
    items: [
      { q: { fr: 'Formule du ROI ?', en: 'ROI formula?' }, a: 'ROI = (Gain - Cost) / Cost × 100%', explanation: { fr: "Le ROI mesure le rendement par rapport à l'investissement initial.", en: 'ROI measures return relative to initial investment.' }, difficulty: 'Easy', type: 'formula' },
      { q: { fr: 'Formule de la VAN (NPV) ?', en: 'NPV formula?' }, a: 'NPV = Σ [CF_t / (1 + r)^t] - Initial Investment', explanation: { fr: 'La VAN actualise tous les flux futurs au taux r.', en: 'NPV discounts all future cash flows at rate r.' }, difficulty: 'Medium', type: 'formula' },
      { q: { fr: "Calculer le ROI pour un investissement de 500€ → 800€.", en: 'Calculate ROI for investment €500 → €800.' }, a: '60%', explanation: { fr: "On calcule le gain relatif à l'investissement: (800-500)/500.", en: 'Calculate gain relative to investment: (800-500)/500.' }, difficulty: 'Medium', type: 'drill' },
      { q: { fr: 'Formule du seuil de rentabilité (break-even) ?', en: 'Break-even formula?' }, a: 'Fixed Costs / (Unit Price - Variable Cost)', explanation: { fr: 'Le point mort est atteint quand les revenus couvrent tous les coûts.', en: 'Break-even is when revenues cover all costs.' }, difficulty: 'Medium', type: 'formula' },
    ],
  },
];

// Business Sense content packs
export const BUSINESS_SENSE_CONTENT: ContentPack[] = [
  {
    packId: 'profitability_analysis',
    title: { fr: 'Analyse de profitabilité', en: 'Profitability Analysis' },
    pillarSlug: 'business_sense',
    items: [
      { q: { fr: 'Formule de la marge brute ?', en: 'Gross margin formula?' }, a: 'Gross Margin = (Revenue - COGS) / Revenue × 100%', explanation: { fr: 'La marge brute mesure la rentabilité après coûts directs.', en: 'Gross margin measures profitability after direct costs.' }, difficulty: 'Easy', type: 'formula' },
      { q: { fr: 'Formule de la marge opérationnelle ?', en: 'Operating margin formula?' }, a: 'Operating Margin = EBIT / Revenue × 100%', explanation: { fr: "Mesure la rentabilité après tous les coûts d'exploitation.", en: 'Measures profitability after all operating costs.' }, difficulty: 'Easy', type: 'formula' },
      { q: { fr: 'Un retailer a +22% CAGR revenue, marge brute 28%→24%, profit stable. Explication ?', en: 'Retailer has +22% CAGR revenue, gross margin 28%→24%, stable profit. Explanation?' }, a: 'OpEx reduction offset margin decline', explanation: { fr: 'Si la marge baisse mais le profit reste stable avec +CA, les coûts ont dû baisser.', en: 'If margin drops but profit stays stable with +revenue, costs must have decreased.' }, difficulty: 'Hard', type: 'drill' },
      { q: { fr: 'Différence entre marge brute et marge nette ?', en: 'Difference between gross and net margin?' }, a: 'Gross = after COGS only. Net = after all costs and taxes.', explanation: { fr: 'La marge nette est le "bottom line" après toutes les charges.', en: 'Net margin is the "bottom line" after all expenses.' }, difficulty: 'Easy', type: 'definition' },
    ],
  },
  {
    packId: 'unit_economics',
    title: { fr: 'Unit Economics', en: 'Unit Economics' },
    pillarSlug: 'business_sense',
    items: [
      { q: { fr: 'Formule du LTV (Lifetime Value) ?', en: 'LTV (Lifetime Value) formula?' }, a: 'LTV = ARPU × Gross Margin × Customer Lifetime', explanation: { fr: "Le LTV représente la valeur totale d'un client sur sa durée de vie.", en: 'LTV represents total customer value over their lifetime.' }, difficulty: 'Medium', type: 'formula' },
      { q: { fr: 'Ratio LTV/CAC sain pour une startup ?', en: 'Healthy LTV/CAC ratio for a startup?' }, a: '>3x is excellent, 2-3x is healthy, <1x is problematic', explanation: { fr: "Un ratio >3 signifie que chaque client rapporte 3× son coût d'acquisition.", en: 'A ratio >3 means each customer returns 3× their acquisition cost.' }, difficulty: 'Medium', type: 'flashcard' },
      { q: { fr: 'CAC=80€, AOV=40€/mois, marge=60%, durée=8 mois. Augmenter ou réduire le marketing ?', en: 'CAC=€80, AOV=€40/mo, margin=60%, lifetime=8mo. Increase or decrease marketing?' }, a: 'Increase. LTV=€192, LTV/CAC=2.4x, healthy.', explanation: { fr: 'LTV = 40 × 0.6 × 8 = 192€. Ratio 2.4x permet la croissance.', en: 'LTV = 40 × 0.6 × 8 = €192. 2.4x ratio allows growth.' }, difficulty: 'Hard', type: 'drill' },
      { q: { fr: 'Formule du payback period ?', en: 'Payback period formula?' }, a: 'Payback = CAC / (ARPU × Margin)', explanation: { fr: "Le temps pour récupérer le coût d'acquisition d'un client.", en: 'Time to recover customer acquisition cost.' }, difficulty: 'Medium', type: 'formula' },
    ],
  },
  {
    packId: 'revenue_decomposition',
    title: { fr: 'Décomposition du revenu', en: 'Revenue Decomposition' },
    pillarSlug: 'business_sense',
    items: [
      { q: { fr: 'Décomposition basique du revenu ?', en: 'Basic revenue decomposition?' }, a: 'Revenue = Volume × Price', explanation: { fr: 'La formule de base pour analyser les variations de CA.', en: 'The basic formula for analyzing revenue changes.' }, difficulty: 'Easy', type: 'formula' },
      { q: { fr: 'Décomposition du revenu SaaS ?', en: 'SaaS revenue decomposition?' }, a: 'MRR = Customers × ARPU', explanation: { fr: 'Le revenu récurrent mensuel dépend du nombre de clients et du revenu moyen.', en: 'Monthly recurring revenue depends on customer count and average revenue.' }, difficulty: 'Easy', type: 'formula' },
      { q: { fr: 'Un QSR a SSS +3%, trafic -8%, ticket +12%. Hypothèse la plus probable ?', en: 'QSR has SSS +3%, traffic -8%, ticket +12%. Most likely hypothesis?' }, a: 'Delivery mix shift (higher tickets, fewer visits)', explanation: { fr: 'La livraison a des tickets 20-30% plus élevés mais moins de transactions.', en: 'Delivery has 20-30% higher tickets but fewer transactions.' }, difficulty: 'Hard', type: 'drill' },
      { q: { fr: "Revenue SaaS +15%, clients +5%. Que s'est-il passé ?", en: 'SaaS revenue +15%, customers +5%. What happened?' }, a: 'Upselling to existing customers (ARPU increased ~10%)', explanation: { fr: "Si clients +5% et revenue +15%, l'ARPU a forcément augmenté.", en: 'If customers +5% and revenue +15%, ARPU must have increased.' }, difficulty: 'Medium', type: 'drill' },
    ],
  },
];

// Industry Insights content packs
export const INDUSTRY_INSIGHTS_CONTENT: ContentPack[] = [
  {
    packId: 'pharma_healthcare',
    title: { fr: 'Pharma & Healthcare', en: 'Pharma & Healthcare' },
    pillarSlug: 'industry_insights',
    items: [
      { q: { fr: 'Marge brute typique dans la pharma ?', en: 'Typical gross margin in pharma?' }, a: '65-80%', explanation: { fr: 'Protection par brevets et faibles coûts de production.', en: 'Patent protection and low production costs.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'R&D en % du CA typique pharma ?', en: 'Typical pharma R&D as % of revenue?' }, a: '15-25%', explanation: { fr: 'Investissements massifs en recherche pour nouveaux médicaments.', en: 'Massive research investments for new drugs.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Marge opérationnelle typique pharma ?', en: 'Typical pharma operating margin?' }, a: '15-30%', explanation: { fr: 'Après R&D et SG&A, la marge op est plus faible que la marge brute.', en: 'After R&D and SG&A, operating margin is lower than gross margin.' }, difficulty: 'Medium', type: 'flashcard' },
      { q: { fr: "Durée moyenne d'un brevet pharma ?", en: 'Average pharma patent duration?' }, a: '20 years (but ~10-12 years effective)', explanation: { fr: 'Les essais cliniques prennent 8-10 ans, réduisant la protection effective.', en: 'Clinical trials take 8-10 years, reducing effective protection.' }, difficulty: 'Medium', type: 'flashcard' },
    ],
  },
  {
    packId: 'retail_consumer',
    title: { fr: 'Retail & Consumer', en: 'Retail & Consumer' },
    pillarSlug: 'industry_insights',
    items: [
      { q: { fr: 'Marge nette typique grocery ?', en: 'Typical grocery net margin?' }, a: '2-3%', explanation: { fr: 'Très faible marge mais volume élevé.', en: 'Very low margin but high volume.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Rotation des stocks grocery (turns/an) ?', en: 'Grocery inventory turnover (turns/year)?' }, a: '~20x', explanation: { fr: 'Produits périssables = rotation très rapide.', en: 'Perishables = very fast turnover.' }, difficulty: 'Medium', type: 'flashcard' },
      { q: { fr: 'Marge brute typique luxe ?', en: 'Typical luxury gross margin?' }, a: '65-75%', explanation: { fr: 'Pricing power et positionnement premium.', en: 'Pricing power and premium positioning.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Marge brute typique apparel ?', en: 'Typical apparel gross margin?' }, a: '50-55%', explanation: { fr: 'Markup important sur les vêtements.', en: 'Significant markup on clothing.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Inventory days typique apparel ?', en: 'Typical apparel inventory days?' }, a: '80-90 days', explanation: { fr: 'Saisonnalité et collections créent du stock.', en: 'Seasonality and collections create inventory.' }, difficulty: 'Medium', type: 'flashcard' },
    ],
  },
  {
    packId: 'tech_saas',
    title: { fr: 'Tech & SaaS', en: 'Tech & SaaS' },
    pillarSlug: 'industry_insights',
    items: [
      { q: { fr: 'Marge brute typique SaaS ?', en: 'Typical SaaS gross margin?' }, a: '70-85%', explanation: { fr: 'Coûts marginaux quasi nuls après développement.', en: 'Near-zero marginal costs after development.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'S&M en % du CA typique SaaS mature ?', en: 'Typical mature SaaS S&M as % of revenue?' }, a: '20-30%', explanation: { fr: 'Les entreprises SaaS matures optimisent leur acquisition.', en: 'Mature SaaS companies optimize acquisition.' }, difficulty: 'Medium', type: 'flashcard' },
      { q: { fr: 'Rule of 40 en SaaS ?', en: 'Rule of 40 in SaaS?' }, a: 'Growth (%) + EBITDA Margin (%) ≥ 40', explanation: { fr: "Benchmark pour évaluer la santé d'une entreprise SaaS.", en: 'Benchmark for evaluating SaaS company health.' }, difficulty: 'Medium', type: 'flashcard' },
      { q: { fr: 'Net Revenue Retention (NRR) excellent ?', en: 'Excellent Net Revenue Retention (NRR)?' }, a: '>120%', explanation: { fr: "Les clients existants génèrent plus de revenus qu'avant (expansion).", en: 'Existing customers generate more revenue than before (expansion).' }, difficulty: 'Medium', type: 'flashcard' },
      { q: { fr: 'SaaS mature avec 45% S&M. Problème ?', en: 'Mature SaaS with 45% S&M. Problem?' }, a: 'Yes, highly competitive market or weak differentiation', explanation: { fr: "Le benchmark est 20-30%, 45% indique une inefficacité.", en: 'Benchmark is 20-30%, 45% indicates inefficiency.' }, difficulty: 'Hard', type: 'drill' },
    ],
  },
  {
    packId: 'education_business',
    title: { fr: 'Éducation & Formation', en: 'Education Business' },
    pillarSlug: 'industry_insights',
    items: [
      { q: { fr: 'Marge brute typique EdTech B2C ?', en: 'Typical B2C EdTech gross margin?' }, a: '60-75%', explanation: { fr: 'Contenu digital avec coûts marginaux faibles, mais CAC élevé.', en: 'Digital content with low marginal costs, but high CAC.' }, difficulty: 'Easy', type: 'flashcard' },
      { q: { fr: 'Marge opérationnelle typique université privée ?', en: 'Typical private university operating margin?' }, a: '5-15%', explanation: { fr: 'Coûts fixes élevés (campus, professeurs) et régulation des frais.', en: 'High fixed costs (campus, faculty) and tuition regulation.' }, difficulty: 'Medium', type: 'flashcard' },
      { q: { fr: 'Taux de rétention annuel pour cours en ligne ?', en: 'Annual retention rate for online courses?' }, a: '30-50%', explanation: { fr: 'Taux de complétion faible, mais revenus récurrents avec abonnements.', en: 'Low completion rates, but recurring revenue with subscriptions.' }, difficulty: 'Medium', type: 'flashcard' },
      { q: { fr: 'CAC typique pour EdTech B2C ?', en: 'Typical B2C EdTech CAC?' }, a: '$50-150', explanation: { fr: 'Marketing digital intensif pour acquisition utilisateurs.', en: 'Intensive digital marketing for user acquisition.' }, difficulty: 'Medium', type: 'flashcard' },
      { q: { fr: 'LTV/CAC ratio sain pour EdTech ?', en: 'Healthy EdTech LTV/CAC ratio?' }, a: '>3x (ideally 4-5x)', explanation: { fr: 'Besoin de ratio élevé car churn important dans le secteur.', en: 'Need high ratio due to significant churn in the sector.' }, difficulty: 'Medium', type: 'flashcard' },
      { q: { fr: 'Taille du marché EdTech global (2024) ?', en: 'Global EdTech market size (2024)?' }, a: '~$400B', explanation: { fr: 'Croissance de 15-20% CAGR, accélérée post-COVID.', en: '15-20% CAGR growth, accelerated post-COVID.' }, difficulty: 'Hard', type: 'flashcard' },
    ],
  },
];

// All content organized by pillar
export const ALL_CONTENT_PACKS: Record<string, ContentPack[]> = {
  maths_tools: MATHS_TOOLS_CONTENT,
  business_sense: BUSINESS_SENSE_CONTENT,
  industry_insights: INDUSTRY_INSIGHTS_CONTENT,
  case_resolution: [],
  general_knowledge: [],
};

// Get content packs for a pillar
export function getContentPacksForPillar(pillarSlug: string): ContentPack[] {
  return ALL_CONTENT_PACKS[pillarSlug] || [];
}

// Get a specific content pack
export function getContentPack(packId: string): ContentPack | undefined {
  for (const packs of Object.values(ALL_CONTENT_PACKS)) {
    const found = packs.find((p) => p.packId === packId);
    if (found) return found;
  }
  return undefined;
}

// Get session items for a content pack
export function getSessionItemsForPack(
  packId: string,
  limit?: number,
  lang: Language = 'fr'
): SessionItem[] {
  const pack = getContentPack(packId);
  if (!pack) return [];

  const items = pack.items.map((item, index) => createSessionItem(packId, item, index, lang));

  if (limit) {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }

  return items;
}

// Get random session items for a pillar
export function getSessionItemsForPillar(
  pillarSlug: string,
  limit = 10,
  lang: Language = 'fr'
): SessionItem[] {
  const packs = getContentPacksForPillar(pillarSlug);
  if (packs.length === 0) return [];

  const allItems: SessionItem[] = [];
  for (const pack of packs) {
    const packItems = pack.items.map((item, index) =>
      createSessionItem(pack.packId, item, index, lang)
    );
    allItems.push(...packItems);
  }

  const shuffled = allItems.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

// Check if a flashcard is typing-based
export function isTypingFlashcard(contentItem: ContentItem): boolean {
  return contentItem.tags.includes('typing');
}
