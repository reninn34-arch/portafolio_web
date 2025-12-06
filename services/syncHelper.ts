// Utility functions to sync data with Supabase
import { savePortfolioToSupabase } from './supabaseService';

// Helper to get all current portfolio data from localStorage
export const getAllPortfolioData = () => {
  return {
    experiences: JSON.parse(localStorage.getItem('dev_portfolio_experiences') || '[]'),
    education: JSON.parse(localStorage.getItem('dev_portfolio_education') || '[]'),
    skills: JSON.parse(localStorage.getItem('dev_portfolio_skills') || '[]'),
    socials: JSON.parse(localStorage.getItem('dev_portfolio_socials') || '{}'),
    logos: JSON.parse(localStorage.getItem('dev_portfolio_logos') || '[]'),
    brands: JSON.parse(localStorage.getItem('dev_portfolio_brands') || '[]'),
    heroContent: JSON.parse(localStorage.getItem('dev_portfolio_hero_content') || '{}'),
    whatsapp: localStorage.getItem('dev_portfolio_whatsapp') || '',
    pdfData: localStorage.getItem('dev_portfolio_resume_pdf') || ''
  };
};

// Auto-sync to Supabase after updating localStorage
export const syncToSupabase = async (section: string, data: any) => {
  try {
    // Update localStorage first
    localStorage.setItem(section, typeof data === 'string' ? data : JSON.stringify(data));
    
    // Get all data and sync to Supabase
    const allData = getAllPortfolioData();
    const success = await savePortfolioToSupabase(allData);
    
    if (success) {
      console.log(`✅ ${section} sincronizado con Supabase`);
    }
    
    return success;
  } catch (error) {
    console.error(`Error syncing ${section} to Supabase:`, error);
    return false;
  }
};

// Sync function that can be called from any component
export const syncAllToSupabase = async () => {
  try {
    const allData = getAllPortfolioData();
    return await savePortfolioToSupabase(allData);
  } catch (error) {
    console.error('Error syncing all data to Supabase:', error);
    return false;
  }
};
