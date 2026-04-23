import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { status, type, search, id } = req.query;
      if (id) {
        const { data, error } = await supabase.from('forms').select('*').eq('id', parseInt(id)).single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      let query = supabase.from('forms').select('*').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      if (type) query = query.eq('form_type', type);
      if (search) query = query.ilike('title', `%${search}%`);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { action } = req.body;
      if (action === 'clone') {
        const { form_id } = req.body;
        const { data: original, error: fetchErr } = await supabase.from('forms').select('*').eq('id', form_id).single();
        if (fetchErr) throw fetchErr;
        const { data, error } = await supabase.from('forms').insert({
          title: `${original.title} (Copy)`, description: original.description, form_type: original.form_type,
          status: 'draft', fields: original.fields, settings: original.settings, created_by: req.body.created_by,
          created_at: new Date().toISOString(), updated_at: new Date().toISOString()
        }).select().single();
        if (error) throw error;
        return res.status(201).json(data);
      }
      const body = req.body;
      const { data, error } = await supabase.from('forms').insert({
        title: body.title, description: body.description, form_type: body.form_type || 'normal',
        status: body.status || 'draft', fields: typeof body.fields === 'string' ? body.fields : JSON.stringify(body.fields || []),
        settings: typeof body.settings === 'string' ? body.settings : JSON.stringify(body.settings || {}),
        created_by: body.created_by, expires_at: body.expires_at || null,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString()
      }).select().single();
      if (error) throw error;
      // Create version 1
      await supabase.from('form_versions').insert({ form_id: data.id, version: 1, fields_snapshot: data.fields, settings_snapshot: data.settings, changed_by: body.created_by, change_notes: 'Initial creation', created_at: new Date().toISOString() });
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      if (updates.fields && typeof updates.fields !== 'string') updates.fields = JSON.stringify(updates.fields);
      if (updates.settings && typeof updates.settings !== 'string') updates.settings = JSON.stringify(updates.settings);
      updates.updated_at = new Date().toISOString();
      const { data, error } = await supabase.from('forms').update(updates).eq('id', id).select().single();
      if (error) throw error;
      // Create new version
      const { data: versions } = await supabase.from('form_versions').select('version').eq('form_id', id).order('version', { ascending: false }).limit(1);
      const nextVersion = (versions?.[0]?.version || 0) + 1;
      await supabase.from('form_versions').insert({ form_id: id, version: nextVersion, fields_snapshot: data.fields, settings_snapshot: data.settings, changed_by: updates.updated_by || null, change_notes: updates.change_notes || 'Updated', created_at: new Date().toISOString() });
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('forms').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Forms error:', err);
    res.status(500).json({ error: err.message });
  }
}
