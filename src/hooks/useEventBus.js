/**
 * React hooks for the Agent Event Bus
 * useEventBus() — access bus methods
 * useEventSubscription(type, cb) — auto-subscribe/unsubscribe on mount/cleanup
 */

import { useEffect, useRef, useCallback } from 'react';
import { agentEventBus } from '../services/agentEventBus';

/**
 * Access the event bus singleton
 * @returns {{ publish, subscribe, subscribeAll, getRecentEvents }}
 */
export function useEventBus() {
  return {
    publish: useCallback((type, payload) => agentEventBus.publish(type, payload), []),
    subscribe: useCallback((type, cb) => agentEventBus.subscribe(type, cb), []),
    subscribeAll: useCallback((cb) => agentEventBus.subscribeAll(cb), []),
    getRecentEvents: useCallback((count, filterType) => agentEventBus.getRecentEvents(count, filterType), [])
  };
}

/**
 * Subscribe to a specific event type with automatic cleanup
 * Callback ref ensures latest callback is always used without re-subscribing
 * @param {string} type - Event type from EVENT_TYPES
 * @param {Function} cb - Event handler
 */
export function useEventSubscription(type, cb) {
  const cbRef = useRef(cb);
  useEffect(() => { cbRef.current = cb; });

  useEffect(() => {
    const handler = (event) => cbRef.current(event);
    const unsubscribe = agentEventBus.subscribe(type, handler);
    return unsubscribe;
  }, [type]);
}

/**
 * Subscribe to all events with automatic cleanup
 * @param {Function} cb - Event handler
 */
export function useWildcardSubscription(cb) {
  const cbRef = useRef(cb);
  useEffect(() => { cbRef.current = cb; });

  useEffect(() => {
    const handler = (event) => cbRef.current(event);
    const unsubscribe = agentEventBus.subscribeAll(handler);
    return unsubscribe;
  }, []);
}
