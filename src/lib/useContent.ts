import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useContent(key: string, locale: string = 'en') {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('site_content')
      .select('content_value')
      .eq('content_key', key)
      .eq('locale', locale)
      .maybeSingle()
      .then(({ data }) => {
        setValue(data?.content_value ?? '');
        setLoading(false);
      });
  }, [key, locale]);

  const update = useCallback(
    async (newValue: string) => {
      setValue(newValue);
      const { error } = await supabase
        .from('site_content')
        .upsert({ content_key: key, locale, content_value: newValue }, { onConflict: 'content_key,locale' });
      if (error) throw error;
    },
    [key, locale]
  );

  return { value, loading, update };
}

export function useCollection<T extends { id: string }>(
  table: string,
  options: { filter?: Record<string, unknown>; order?: string; ascending?: boolean } = {}
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = supabase.from(table).select('*');
    if (options.filter) {
      for (const [key, val] of Object.entries(options.filter)) {
        query = query.eq(key, val);
      }
    }
    if (options.order) {
      query = query.order(options.order, { ascending: options.ascending ?? true });
    }
    const { data, error } = await query;
    if (error) {
      setError(error.message);
      setItems([]);
    } else {
      setItems((data ?? []) as T[]);
      setError(null);
    }
    setLoading(false);
  }, [table, JSON.stringify(options.filter), options.order, options.ascending]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = useCallback(
    async (record: Partial<T>) => {
      const { data, error } = await supabase.from(table).insert(record).select().single();
      if (error) throw error;
      await fetch();
      return data as T;
    },
    [table, fetch]
  );

  const update = useCallback(
    async (id: string, patch: Partial<T>) => {
      const { error } = await supabase.from(table).update(patch).eq('id', id);
      if (error) throw error;
      await fetch();
    },
    [table, fetch]
  );

  const remove = useCallback(
    async (id: string) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      await fetch();
    },
    [table, fetch]
  );

  return { items, loading, error, refetch: fetch, create, update, remove };
}
