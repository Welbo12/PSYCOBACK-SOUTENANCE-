import { Pool } from 'pg';
import { Resource } from './resource.model.js';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function init() {
  await pool.query(`
    create extension if not exists pgcrypto;
    create table if not exists resources (
      id uuid primary key default gen_random_uuid(),
      type text not null check (type in ('text','image','video')),
      content text not null,
      author text,
      link text,
      description text,
      status text not null default 'draft' check (status in ('draft','published','archived')),
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
    create or replace function set_updated_at()
    returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
    drop trigger if exists trg_resources_updated on resources;
    create trigger trg_resources_updated before update on resources
    for each row execute function set_updated_at();
  `);
}
init().catch(console.error);

const mapRow = (r: any): Resource => ({
  id: r.id,
  type: r.type,
  content: r.content,
  author: r.author,
  link: r.link,
  description: r.description,
  status: r.status,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export class ResourceRepository {
  async create(data: Partial<Resource>): Promise<Resource> {
    const q = `insert into resources (type, content, author, link, description, status)
              values ($1,$2,$3,$4,$5, coalesce($6,'draft')) returning *`;
    const values = [data.type, data.content, data.author ?? null, data.link ?? null, data.description ?? null, data.status ?? 'draft'];
    const { rows } = await pool.query(q, values);
    return mapRow(rows[0]);
  }

  async findById(id: string): Promise<Resource | null> {
    const { rows } = await pool.query('select * from resources where id = $1', [id]);
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async findAll(params: { status?: string } = {}): Promise<Resource[]> {
    const where = params.status ? 'where status = $1' : '';
    const values = params.status ? [params.status] : [];
    const { rows } = await pool.query(`select * from resources ${where} order by created_at desc`, values);
    return rows.map(mapRow);
  }

  async update(id: string, data: Partial<Resource>): Promise<Resource | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;
    for (const [k, v] of Object.entries(data)) {
      if (['type','content','author','link','description','status'].includes(k) && v !== undefined) {
        fields.push(`${k === 'createdAt' ? 'created_at' : k === 'updatedAt' ? 'updated_at' : k} = $${i++}`);
        values.push(v);
      }
    }
    if (!fields.length) return this.findById(id);
    values.push(id);
    const { rows } = await pool.query(`update resources set ${fields.join(', ')} where id = $${i} returning *`, values);
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async delete(id: string): Promise<void> {
    await pool.query('delete from resources where id = $1', [id]);
  }
}

export default new ResourceRepository();


