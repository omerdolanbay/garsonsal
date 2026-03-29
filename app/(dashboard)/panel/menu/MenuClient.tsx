'use client'

import { useState } from 'react'
import type { MenuCategory, MenuItem } from '@/lib/supabase/types'
import { addCategory, deleteCategory, addMenuItem, toggleMenuItem, deleteMenuItem, updateMenuItem } from './actions'

export default function MenuClient({
  categories,
  items,
}: {
  categories: MenuCategory[]
  items: MenuItem[]
}) {
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items')
  const [editItem, setEditItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleAction(fn: (fd: FormData) => Promise<unknown>, fd: FormData) {
    setLoading(true)
    await fn(fd)
    setLoading(false)
    setEditItem(null)
  }

  const tabStyle = (active: boolean) => active ? {
    background: 'linear-gradient(135deg, rgba(0,119,182,0.5), rgba(0,180,216,0.3))',
    color: 'var(--color-white)',
    fontWeight: 600,
    border: '1px solid var(--color-accent-1)',
  } : {
    background: 'var(--color-tab-inactive)',
    color: 'var(--color-muted)',
    border: '1px solid var(--color-border)',
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-white)' }}>Menü Yönetimi</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>{items.length} ürün · {categories.length} kategori</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('items')} className="px-4 py-2 rounded-xl text-sm transition" style={tabStyle(activeTab === 'items')}>
            Ürünler
          </button>
          <button onClick={() => setActiveTab('categories')} className="px-4 py-2 rounded-xl text-sm transition" style={tabStyle(activeTab === 'categories')}>
            Kategoriler
          </button>
        </div>
      </div>

      {/* KATEGORİLER */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="glass-elevated p-5">
            <h2 className="font-semibold mb-3" style={{ color: 'var(--color-white)' }}>Yeni Kategori</h2>
            <form action={async (fd) => { setLoading(true); await addCategory(fd); setLoading(false) }} className="flex gap-3">
              <input
                name="name"
                required
                placeholder="Örn: Sıcak İçecekler"
                className="input-dark flex-1"
              />
              <button type="submit" disabled={loading} className="gradient-btn px-5 py-2.5 rounded-xl text-sm disabled:opacity-60">
                Ekle
              </button>
            </form>
          </div>

          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.id} className="glass-card px-5 py-3.5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm" style={{ color: 'var(--color-white)' }}>{cat.name}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--color-muted)' }}>
                    {items.filter(i => i.category_id === cat.id).length} ürün
                  </span>
                </div>
                <button
                  onClick={async () => { setLoading(true); await deleteCategory(cat.id); setLoading(false) }}
                  className="text-sm px-3 py-1 rounded-lg transition"
                  style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}
                >
                  Sil
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="glass-card text-center py-10" style={{ color: 'var(--color-muted)' }}>Henüz kategori yok</div>
            )}
          </div>
        </div>
      )}

      {/* ÜRÜNLER */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          <div className="glass-elevated p-5">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--color-white)' }}>Yeni Ürün</h2>
            <form action={async (fd) => await handleAction(addMenuItem, fd)} className="grid grid-cols-2 gap-3">
              <input name="name" required placeholder="Ürün adı" className="input-dark col-span-2" />
              <input name="description" placeholder="Açıklama (isteğe bağlı)" className="input-dark col-span-2" />
              <input name="price" type="number" step="0.01" min="0" required placeholder="Fiyat (₺)" className="input-dark" />
              <select name="category_id" className="input-dark">
                <option value="">Kategori seç (isteğe bağlı)</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="submit" disabled={loading} className="gradient-btn col-span-2 py-2.5 rounded-xl text-sm disabled:opacity-60">
                {loading ? 'Ekleniyor...' : 'Ürün Ekle'}
              </button>
            </form>
          </div>

          {categories.map(cat => {
            const catItems = items.filter(i => i.category_id === cat.id)
            if (catItems.length === 0) return null
            return (
              <div key={cat.id}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--color-muted)' }}>{cat.name}</h3>
                <div className="space-y-2">
                  {catItems.map(item => (
                    <ItemRow key={item.id} item={item} categories={categories}
                      onEdit={() => setEditItem(item)}
                      onToggle={(is_active) => toggleMenuItem(item.id, is_active)}
                      onDelete={() => deleteMenuItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {(() => {
            const uncategorized = items.filter(i => !i.category_id)
            if (uncategorized.length === 0) return null
            return (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--color-muted)' }}>Kategorisiz</h3>
                <div className="space-y-2">
                  {uncategorized.map(item => (
                    <ItemRow key={item.id} item={item} categories={categories}
                      onEdit={() => setEditItem(item)}
                      onToggle={(is_active) => toggleMenuItem(item.id, is_active)}
                      onDelete={() => deleteMenuItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            )
          })()}

          {items.length === 0 && (
            <div className="glass-card text-center py-12" style={{ color: 'var(--color-muted)' }}>Henüz ürün eklenmedi</div>
          )}
        </div>
      )}

      {/* Düzenleme modalı */}
      {editItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'var(--color-overlay)' }}>
          <div className="glass-elevated p-6 w-full max-w-md">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--color-white)' }}>Ürünü Düzenle</h2>
            <form action={async (fd) => await handleAction(updateMenuItem, fd)} className="space-y-3">
              <input type="hidden" name="id" value={editItem.id} />
              <input name="name" defaultValue={editItem.name} required className="input-dark" />
              <input name="description" defaultValue={editItem.description ?? ''} placeholder="Açıklama" className="input-dark" />
              <input name="price" type="number" step="0.01" defaultValue={editItem.price} required className="input-dark" />
              <select name="category_id" defaultValue={editItem.category_id ?? ''} className="input-dark">
                <option value="">Kategorisiz</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="hidden" name="is_active" value={String(editItem.is_active)} />
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setEditItem(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm transition"
                  style={{ border: '1px solid var(--color-border)', color: 'var(--color-muted)', background: 'transparent' }}>
                  İptal
                </button>
                <button type="submit" disabled={loading} className="gradient-btn flex-1 py-2.5 rounded-xl text-sm disabled:opacity-60">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ItemRow({
  item,
  categories: _categories, // eslint-disable-line @typescript-eslint/no-unused-vars
  onEdit,
  onToggle,
  onDelete,
}: {
  item: MenuItem
  categories: MenuCategory[]
  onEdit: () => void
  onToggle: (v: boolean) => void
  onDelete: () => void
}) {
  return (
    <div className={`glass-card px-5 py-3.5 flex items-center gap-4 transition ${!item.is_active ? 'opacity-50' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm" style={{ color: 'var(--color-white)' }}>{item.name}</div>
        {item.description && <div className="text-xs truncate mt-0.5" style={{ color: 'var(--color-muted)' }}>{item.description}</div>}
      </div>
      <div className="text-sm font-bold" style={{ color: 'var(--color-accent-2)' }}>₺{Number(item.price).toFixed(2)}</div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggle(!item.is_active)}
          className="text-xs px-2.5 py-1 rounded-lg font-medium transition"
          style={item.is_active
            ? { background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }
            : { background: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.25)' }
          }
        >
          {item.is_active ? 'Aktif' : 'Pasif'}
        </button>
        <button onClick={onEdit} className="text-xs font-medium transition" style={{ color: 'var(--color-accent-2)' }}>Düzenle</button>
        <button onClick={onDelete} className="text-xs font-medium transition" style={{ color: '#f87171' }}>Sil</button>
      </div>
    </div>
  )
}
