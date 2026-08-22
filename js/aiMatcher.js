/**
 * Quad Find — AI Multi-Factor Matching Engine
 * Compares reports across visual features, semantic descriptions, campus location, and time proximity.
 */

import { CAMPUS_LOCATIONS } from './data.js';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from',
  'of', 'is', 'it', 'my', 'i', 'left', 'found', 'lost', 'near', 'on', 'desk', 'floor',
  'table', 'area', 'room', 'section', 'side', 'has', 'have', 'had', 'this', 'that'
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

function computeJaccard(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Calculates Semantic & Description Similarity (0 - 100)
 */
function calculateSemanticScore(itemA, itemB) {
  let score = 0;

  // 1. Category alignment (critical foundation)
  if (itemA.category === itemB.category) {
    score += 35;
  } else {
    // Cross-category penalty unless generic
    if (itemA.category === 'other' || itemB.category === 'other') {
      score += 15;
    }
  }

  // 2. Brand match
  if (itemA.brand && itemB.brand) {
    if (itemA.brand.toLowerCase() === itemB.brand.toLowerCase()) {
      score += 25;
    } else if (itemA.brand.toLowerCase().includes(itemB.brand.toLowerCase()) || itemB.brand.toLowerCase().includes(itemA.brand.toLowerCase())) {
      score += 18;
    }
  }

  // 3. Title & Description Keyword Overlap
  const tokensA = [...tokenize(itemA.title), ...tokenize(itemA.description), ...(itemA.tags || [])];
  const tokensB = [...tokenize(itemB.title), ...tokenize(itemB.description), ...(itemB.tags || [])];
  const jaccard = computeJaccard(tokensA, tokensB);
  score += Math.min(30, jaccard * 60);

  // 4. Color match in text/props
  if (itemA.primaryColor && itemB.primaryColor) {
    if (itemA.primaryColor.toLowerCase() === itemB.primaryColor.toLowerCase()) {
      score += 10;
    }
  }

  return Math.min(100, Math.round(score));
}

/**
 * Calculates Visual & Photo Feature Alignment (0 - 100)
 */
function calculateVisualScore(itemA, itemB) {
  let score = 50; // base visual baseline

  // Primary color match
  if (itemA.primaryColor && itemB.primaryColor) {
    if (itemA.primaryColor.toLowerCase() === itemB.primaryColor.toLowerCase()) {
      score += 25;
    } else {
      score -= 10;
    }
  }

  // Category visual signature
  if (itemA.category === itemB.category) {
    score += 15;
  }

  // Keyword visual cues (e.g. stickers, cases, clips, bifold, slim, strap)
  const visualKeywords = ['case', 'clip', 'sticker', 'stickers', 'strap', 'dent', 'scratch', 'logo', 'pro', 'matte', 'leather', 'zipper', 'cord', 'bifold'];
  const textA = `${itemA.title} ${itemA.description} ${(itemA.tags || []).join(' ')}`.toLowerCase();
  const textB = `${itemB.title} ${itemB.description} ${(itemB.tags || []).join(' ')}`.toLowerCase();

  let matchedVisualTokens = 0;
  for (const kw of visualKeywords) {
    if (textA.includes(kw) && textB.includes(kw)) {
      matchedVisualTokens++;
    }
  }

  score += Math.min(15, matchedVisualTokens * 6);

  return Math.max(10, Math.min(100, Math.round(score)));
}

/**
 * Calculates Spatial Proximity Score (0 - 100)
 */
function calculateSpatialScore(itemA, itemB) {
  if (itemA.locationId === itemB.locationId) {
    // Exact same campus building / landmark
    return 100;
  }

  const locA = CAMPUS_LOCATIONS.find(l => l.id === itemA.locationId);
  const locB = CAMPUS_LOCATIONS.find(l => l.id === itemB.locationId);

  if (locA && locB) {
    if (locA.zone === locB.zone) {
      // Same campus zone (e.g. Central Quad)
      return 82;
    }

    // Distance calculation
    const dx = (locA.lat - locB.lat) * 111; // approx km
    const dy = (locA.lng - locB.lng) * 111;
    const distKm = Math.sqrt(dx * dx + dy * dy);

    if (distKm < 0.4) return 75;
    if (distKm < 0.8) return 60;
    if (distKm < 1.5) return 45;
    return 30;
  }

  return 50;
}

/**
 * Calculates Temporal Proximity Score (0 - 100)
 */
function calculateTemporalScore(itemA, itemB) {
  const timeA = new Date(itemA.dateTime).getTime();
  const timeB = new Date(itemB.dateTime).getTime();

  if (isNaN(timeA) || isNaN(timeB)) return 60;

  const diffHours = Math.abs(timeA - timeB) / (1000 * 60 * 60);

  // Time proximity decay curve
  if (diffHours <= 2) return 98;
  if (diffHours <= 6) return 92;
  if (diffHours <= 12) return 88;
  if (diffHours <= 24) return 80;
  if (diffHours <= 48) return 70;
  if (diffHours <= 72) return 60;
  if (diffHours <= 168) return 45; // 1 week
  return 30;
}

/**
 * Dynamic Natural-Language AI Match Explanation Generator
 */
function generateAIExplanation(itemA, itemB, scores, totalScore) {
  const locA = CAMPUS_LOCATIONS.find(l => l.id === itemA.locationId);
  const locB = CAMPUS_LOCATIONS.find(l => l.id === itemB.locationId);

  const reasons = [];

  // Item & Category match
  if (itemA.category === itemB.category) {
    if (itemA.brand && itemB.brand && itemA.brand.toLowerCase() === itemB.brand.toLowerCase()) {
      reasons.push(`matching ${itemA.brand} brand and model specifications`);
    } else {
      reasons.push(`same item type and category`);
    }
  }

  // Color & Visual
  if (itemA.primaryColor && itemB.primaryColor && itemA.primaryColor.toLowerCase() === itemB.primaryColor.toLowerCase()) {
    reasons.push(`aligned ${itemA.primaryColor.toLowerCase()} color profile`);
  }

  // Visual cues (stickers, clips, features)
  const textA = `${itemA.title} ${itemA.description}`.toLowerCase();
  const textB = `${itemB.title} ${itemB.description}`.toLowerCase();
  if ((textA.includes('sticker') && textB.includes('sticker')) || (textA.includes('clip') && textB.includes('clip')) || (textA.includes('carabiner') && textB.includes('carabiner'))) {
    reasons.push(`distinctive physical accessories & markings`);
  }

  // Spatial & Location
  let locReason = '';
  if (itemA.locationId === itemB.locationId) {
    locReason = `reported at the same building (${locA?.name || 'campus facility'})`;
  } else if (locA && locB && locA.zone === locB.zone) {
    locReason = `located within the same campus zone (${locA.zone})`;
  } else {
    locReason = `found within campus vicinity`;
  }

  // Temporal
  const diffHours = Math.round(Math.abs(new Date(itemA.dateTime).getTime() - new Date(itemB.dateTime).getTime()) / (1000 * 60 * 60) * 10) / 10;
  const timeReason = diffHours < 1 ? `within an hour of occurrence` : `within ~${diffHours} hours of reported timeframe`;

  if (totalScore >= 85) {
    return `Strong AI Match (${totalScore}%): ${reasons.join(', ')}. Discovered ${locReason} ${timeReason}.`;
  } else if (totalScore >= 65) {
    return `Moderate AI Candidate (${totalScore}%): Shares ${reasons.slice(0, 2).join(' and ')}, located ${locReason} ${timeReason}.`;
  } else {
    return `Possible Low-Confidence Match (${totalScore}%): General category overlap noted in ${locReason}.`;
  }
}

/**
 * Compare two items and return detailed AI match result
 */
export function compareItems(sourceItem, targetItem) {
  const semanticScore = calculateSemanticScore(sourceItem, targetItem);
  const visualScore = calculateVisualScore(sourceItem, targetItem);
  const spatialScore = calculateSpatialScore(sourceItem, targetItem);
  const temporalScore = calculateTemporalScore(sourceItem, targetItem);

  // Multi-factor weighted formula
  // Semantic: 38%, Visual: 27%, Spatial: 20%, Temporal: 15%
  const totalScore = Math.round(
    (semanticScore * 0.38) +
    (visualScore * 0.27) +
    (spatialScore * 0.20) +
    (temporalScore * 0.15)
  );

  const explanation = generateAIExplanation(sourceItem, targetItem, { semanticScore, visualScore, spatialScore, temporalScore }, totalScore);

  let confidenceLevel = 'low';
  let badgeColor = 'slate';
  if (totalScore >= 80) {
    confidenceLevel = 'high';
    badgeColor = 'emerald';
  } else if (totalScore >= 60) {
    confidenceLevel = 'medium';
    badgeColor = 'amber';
  }

  return {
    sourceId: sourceItem.id,
    targetId: targetItem.id,
    targetItem,
    totalScore,
    confidenceLevel,
    badgeColor,
    explanation,
    factors: {
      visual: visualScore,
      semantic: semanticScore,
      spatial: spatialScore,
      temporal: temporalScore
    }
  };
}

/**
 * Finds and ranks all opposite-type matches for a given item
 */
export function findMatchesForItem(targetItem, allItems, minScore = 30) {
  const oppositeType = targetItem.type === 'lost' ? 'found' : 'lost';
  
  const candidates = allItems.filter(item => 
    item.id !== targetItem.id &&
    item.type === oppositeType &&
    item.status !== 'resolved'
  );

  const results = candidates.map(candidate => compareItems(targetItem, candidate));
  
  return results
    .filter(res => res.totalScore >= minScore)
    .sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Scans all items and returns top match pairs across the campus database
 */
export function scanAllMatchPairs(allItems, minScore = 60) {
  const lostItems = allItems.filter(i => i.type === 'lost' && i.status === 'open');
  const foundItems = allItems.filter(i => i.type === 'found' && i.status === 'open');

  const pairs = [];
  const processedPairs = new Set();

  for (const lost of lostItems) {
    for (const found of foundItems) {
      const pairKey = `${lost.id}_${found.id}`;
      if (processedPairs.has(pairKey)) continue;
      processedPairs.add(pairKey);

      const match = compareItems(lost, found);
      if (match.totalScore >= minScore) {
        pairs.push({
          lostItem: lost,
          foundItem: found,
          ...match
        });
      }
    }
  }

  return pairs.sort((a, b) => b.totalScore - a.totalScore);
}
