/**
 * useEngagement Hook
 * Loads engagement from Supabase, falls back to local engagementStore
 * Debounce-saves changes back to Supabase
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  loadEngagement,
  updateEngagement,
  loadAllEngagements,
  isSupabaseConfigured
} from '../lib/supabaseClient';
import engagementStore from '../store/engagementStore';

const SAVE_DEBOUNCE_MS = 2000;
const ENGAGEMENT_ID_KEY = 'audit_selected_engagement_id';

export default function useEngagement(engagementId) {
  const [engagement, setEngagement] = useState(null);
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const saveTimerRef = useRef(null);
  const latestDataRef = useRef(null);

  // Resolve which engagement ID to load
  const resolvedId = engagementId || localStorage.getItem(ENGAGEMENT_ID_KEY);

  // Load single engagement
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!resolvedId) {
        setEngagement(engagementStore.engagement);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (isSupabaseConfigured()) {
          const data = await loadEngagement(resolvedId);
          if (!cancelled) {
            setEngagement(data);
            localStorage.setItem(ENGAGEMENT_ID_KEY, resolvedId);
          }
        } else {
          // Offline fallback
          setEngagement(engagementStore.engagement);
        }
      } catch (err) {
        console.warn('Failed to load engagement from Supabase, using local store:', err.message);
        if (!cancelled) {
          setEngagement(engagementStore.engagement);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [resolvedId]);

  // Load all engagements list
  useEffect(() => {
    let cancelled = false;

    async function loadList() {
      if (!isSupabaseConfigured()) return;
      try {
        const data = await loadAllEngagements();
        if (!cancelled) setEngagements(data || []);
      } catch (err) {
        console.warn('Failed to load engagements list:', err.message);
      }
    }

    loadList();
    return () => { cancelled = true; };
  }, []);

  // Debounced save to Supabase
  const saveToSupabase = useCallback(async (data) => {
    if (!isSupabaseConfigured() || !data?.id) return;

    setSaveStatus('saving');
    try {
      await updateEngagement(data.id, data);
      setSaveStatus('saved');
      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to save engagement:', err.message);
      setSaveStatus('error');
    }
  }, []);

  // Update engagement with debounced save
  const updateEngagementData = useCallback((updates) => {
    setEngagement(prev => {
      const updated = { ...prev, ...updates };
      latestDataRef.current = updated;

      // Clear existing timer
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

      // Set debounced save
      saveTimerRef.current = setTimeout(() => {
        saveToSupabase(latestDataRef.current);
      }, SAVE_DEBOUNCE_MS);

      return updated;
    });
  }, [saveToSupabase]);

  // Select a different engagement
  const selectEngagement = useCallback((id) => {
    if (id) {
      localStorage.setItem(ENGAGEMENT_ID_KEY, id);
    } else {
      localStorage.removeItem(ENGAGEMENT_ID_KEY);
    }
    // Trigger reload by updating state
    window.location.reload(); // Simple approach for MVP
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        // Flush any pending save
        if (latestDataRef.current?.id && isSupabaseConfigured()) {
          updateEngagement(latestDataRef.current.id, latestDataRef.current).catch(() => {});
        }
      }
    };
  }, []);

  return {
    engagement,
    engagements,
    loading,
    error,
    saveStatus,
    updateEngagement: updateEngagementData,
    selectEngagement,
    selectedId: resolvedId
  };
}
