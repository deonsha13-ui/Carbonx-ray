import { AppUsageItem, AppCategoryResult, MaterialItem } from '../types';

// --- Individual Calculations ---

// Professional Dark Mode Palette
const EMISSION_FACTORS_DIGITAL: Record<string, { type: 'per_hour' | 'per_minute', val: number, color: string, icon: string }> = {
  'AI Queries': { type: 'per_hour', val: 300, color: '#06b6d4', icon: '🤖' }, // Cyan 500
  '4K Streaming': { type: 'per_hour', val: 45, color: '#10b981', icon: '📺' }, // Emerald 500
  'Social Media': { type: 'per_minute', val: 1.5, color: '#d946ef', icon: '📱' }, // Fuchsia 500
  'Gaming': { type: 'per_hour', val: 30, color: '#f59e0b', icon: '🎮' }, // Amber 500
  'Video Calls': { type: 'per_hour', val: 30, color: '#f97316', icon: '📞' }, // Orange 500
  'Other': { type: 'per_minute', val: 0.5, color: '#64748b', icon: '📁' }  // Slate 500
};

export const calculateDigitalFootprint = (apps: AppUsageItem[]): AppCategoryResult[] => {
  const categoryMap: Record<string, AppCategoryResult> = {};

  apps.forEach(app => {
    // Normalize category name to match keys partially or default to Other
    let catKey = 'Other';
    const inputCat = app.category || ''; // Safety check for null/undefined category
    
    if (inputCat.includes('AI') || inputCat.includes('GPT') || inputCat.includes('Gemini')) catKey = 'AI Queries';
    else if (inputCat.includes('Stream') || inputCat.includes('Netflix') || inputCat.includes('YouTube')) catKey = '4K Streaming';
    else if (inputCat.includes('Social') || inputCat.includes('Instagram') || inputCat.includes('TikTok')) catKey = 'Social Media';
    else if (inputCat.includes('Game') || inputCat.includes('Gaming')) catKey = 'Gaming';
    else if (inputCat.includes('Call') || inputCat.includes('Zoom') || inputCat.includes('Teams')) catKey = 'Video Calls';

    // Safety fallback: Ensure we always have valid factor data
    const factorData = EMISSION_FACTORS_DIGITAL[catKey] || EMISSION_FACTORS_DIGITAL['Other'];
    
    const totalMinutes = (app.hours * 60) + app.minutes;
    
    let emissions = 0;
    if (factorData.type === 'per_hour') {
      emissions = (totalMinutes / 60) * factorData.val;
    } else {
      emissions = totalMinutes * factorData.val;
    }

    if (!categoryMap[catKey]) {
      categoryMap[catKey] = {
        category: catKey,
        totalMinutes: 0,
        co2Emissions: 0,
        color: factorData.color,
        icon: factorData.icon
      };
    }

    categoryMap[catKey].totalMinutes += totalMinutes;
    categoryMap[catKey].co2Emissions += emissions;
  });

  return Object.values(categoryMap).sort((a, b) => b.co2Emissions - a.co2Emissions);
};


// --- Enterprise Calculations ---

const MATERIAL_FACTORS: Record<string, number> = {
  'steel': 1.85,
  'iron': 1.85,
  'cement': 0.9,
  'aluminum': 8.5,
  'copper': 4.2,
  'plastic': 6.0,
  'glass': 0.85,
  'wood': 0.45,
  'paper': 1.3
};

export const enrichMaterialData = (materials: MaterialItem[]): MaterialItem[] => {
  return materials.map(mat => {
    const lowerName = mat.name.toLowerCase();
    let factor = 2.0; // Default fallback

    for (const [key, val] of Object.entries(MATERIAL_FACTORS)) {
      if (lowerName.includes(key)) {
        factor = val;
        break;
      }
    }

    const co2 = mat.weight * factor;
    const transport = mat.weight * 0.1;

    return {
      ...mat,
      factor,
      co2,
      transport
    };
  });
};