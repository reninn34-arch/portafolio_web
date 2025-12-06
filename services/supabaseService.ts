import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Portfolio data interface
export interface PortfolioData {
  id?: number;
  experiences: any[];
  education: any[];
  skills: any[];
  logos: any[];
  brands: any[];
  socials: any;
  heroContent: any;
  whatsapp: string;
  pdfData: string;
  updated_at?: string;
  created_at?: string;
}

// Get portfolio data from Supabase
export const fetchPortfolioFromSupabase = async (): Promise<PortfolioData | null> => {
  try {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching portfolio from Supabase:', error);
      return null;
    }

    return data;
  } catch (e) {
    console.error('Error in fetchPortfolioFromSupabase:', e);
    return null;
  }
};

// Save portfolio data to Supabase
export const savePortfolioToSupabase = async (portfolioData: Partial<PortfolioData>): Promise<boolean> => {
  try {
    // Check if record exists
    const { data: existing } = await supabase
      .from('portfolio')
      .select('id')
      .limit(1)
      .single();

    let result;

    if (existing) {
      // Update existing record
      result = await supabase
        .from('portfolio')
        .update({
          ...portfolioData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      // Insert new record
      result = await supabase
        .from('portfolio')
        .insert([{
          ...portfolioData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
    }

    if (result.error) {
      console.error('Error saving to Supabase:', result.error);
      return false;
    }

    console.log('✅ Portfolio guardado en Supabase');
    return true;
  } catch (e) {
    console.error('Error in savePortfolioToSupabase:', e);
    return false;
  }
};

// Save specific section to Supabase
export const updatePortfolioSection = async (
  section: keyof PortfolioData,
  value: any
): Promise<boolean> => {
  try {
    const { data: existing } = await supabase
      .from('portfolio')
      .select('id')
      .limit(1)
      .single();

    if (!existing) {
      console.error('No portfolio record found');
      return false;
    }

    const { error } = await supabase
      .from('portfolio')
      .update({
        [section]: value,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id);

    if (error) {
      console.error('Error updating portfolio section:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error in updatePortfolioSection:', e);
    return false;
  }
};

// Initialize portfolio data
export const initializePortfolio = async (initialData: Partial<PortfolioData>): Promise<boolean> => {
  try {
    const { data: existing } = await supabase
      .from('portfolio')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      console.log('Portfolio already initialized');
      return true;
    }

    const { error } = await supabase
      .from('portfolio')
      .insert([{
        ...initialData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error initializing portfolio:', error);
      return false;
    }

    console.log('✅ Portfolio initialized in Supabase');
    return true;
  } catch (e) {
    console.error('Error in initializePortfolio:', e);
    return false;
  }
};

// Contact form submission to Supabase
export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export const saveContactMessage = async (message: ContactMessage): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        ...message,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error saving contact message:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error in saveContactMessage:', e);
    return false;
  }
};

// Get all contact messages
export const fetchContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact messages:', error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error('Error in fetchContactMessages:', e);
    return [];
  }
};
