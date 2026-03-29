'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Order, WaiterCall, OrderItem } from '@/lib/supabase/types'

const STATUS_LABELS: Record<string, string> = {
  new: 'Yeni',
  preparing: 'Hazırlanıyor',
  delivered: 'Teslim Edildi',
}

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  new:       { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.35)' },
  preparing: { bg: 'rgba(0,119,182,0.15)',  color: '#38bdf8', border: 'rgba(0,119,182,0.35)' },
  delivered: { bg: 'rgba(34,197,94,0.15)',  color: '#22c55e', border: 'rgba(34,197,94,0.35)' },
}

export default function OrdersClient({
  businessId,
  initialOrders,
  initialCalls,
}: {
  businessId: string
  initialOrders: Order[]
  initialCalls: WaiterCall[]
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [calls, setCalls] = useState<WaiterCall[]>(initialCalls)
  const supabase = createClient()

  const updateStatus = useCallback(async (orderId: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', orderId)
  }, [supabase])

  const answerCall = useCallback(async (callId: string) => {
    await supabase.from('waiter_calls').update({ status: 'answered' }).eq('id', callId)
  }, [supabase])

  useEffect(() => {
    const orderSub = supabase
      .channel('orders-channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `business_id=eq.${businessId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') setOrders(prev => [payload.new as Order, ...prev])
          else if (payload.eventType === 'UPDATE') setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new as Order : o))
          else if (payload.eventType === 'DELETE') setOrders(prev => prev.filter(o => o.id !== payload.old.id))
        }
      ).subscribe()

    const callSub = supabase
      .channel('waiter-calls-channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'waiter_calls', filter: `business_id=eq.${businessId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') setCalls(prev => [payload.new as WaiterCall, ...prev])
          else if (payload.eventType === 'UPDATE') setCalls(prev => prev.map(c => c.id === payload.new.id ? payload.new as WaiterCall : c))
        }
      ).subscribe()

    return () => { supabase.removeChannel(orderSub); supabase.removeChannel(callSub) }
  }, [businessId, supabase])

  const activeOrders = orders.filter(o => o.status !== 'delivered')
  const pendingCalls = calls.filter(c => c.status === 'pending')
  const newCount = orders.filter(o => o.status === 'new').length
  const preparingCount = orders.filter(o => o.status === 'preparing').length

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-white)' }}>Sipariş Paneli</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>Gerçek zamanlı sipariş ve garson çağrı takibi</p>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { value: newCount, label: 'Yeni Sipariş', color: '#f59e0b', icon: '🟡' },
          { value: preparingCount, label: 'Hazırlanıyor', color: 'var(--color-accent-2)', icon: '🔵' },
          { value: pendingCalls.length, label: 'Garson Çağrısı', color: '#f87171', icon: '🔴' },
        ].map(({ value, label, color, icon }) => (
          <div key={label} className="glass-card p-5 flex items-center gap-4">
            <div className="text-2xl">{icon}</div>
            <div>
              <div className="text-3xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs mt-0.5 font-medium" style={{ color: 'var(--color-muted)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Siparişler */}
        <div className="col-span-2 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-muted)' }}>
            Aktif Siparişler ({activeOrders.length})
          </h2>
          {activeOrders.length === 0 && (
            <div className="glass-card p-10 text-center" style={{ color: 'var(--color-muted)' }}>
              <div className="text-3xl mb-2">✓</div>
              <div className="text-sm">Bekleyen sipariş yok</div>
            </div>
          )}
          {activeOrders.map(order => (
            <OrderCard key={order.id} order={order} onStatusChange={updateStatus} />
          ))}
        </div>

        {/* Garson çağrıları */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-muted)' }}>
            Garson Çağrıları
          </h2>
          {pendingCalls.length === 0 && (
            <div className="glass-card p-6 text-center" style={{ color: 'var(--color-muted)' }}>
              <div className="text-2xl mb-1">🔔</div>
              <div className="text-sm">Çağrı yok</div>
            </div>
          )}
          {pendingCalls.map(call => (
            <div key={call.id} className="glass-card p-4" style={{ borderColor: 'rgba(245,158,11,0.35)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#f59e0b' }}>📢 Masa {call.table_number}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                    {new Date(call.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <button
                  onClick={() => answerCall(call.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
                >
                  Yanıtla
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OrderCard({ order, onStatusChange }: { order: Order; onStatusChange: (id: string, status: string) => void }) {
  const items = order.items as unknown as OrderItem[]
  const time = new Date(order.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  const sc = STATUS_COLORS[order.status]

  const nextStatus: Record<string, string> = { new: 'preparing', preparing: 'delivered' }
  const nextLabel: Record<string, string> = { new: 'Hazırlanıyor →', preparing: 'Teslim Edildi →' }
  const btnBg: Record<string, string> = { new: 'linear-gradient(135deg,#f59e0b,#fbbf24)', preparing: 'linear-gradient(135deg,#16a34a,#22c55e)' }

  return (
    <div className="glass-card p-4" style={order.status === 'new' ? { borderColor: 'rgba(245,158,11,0.35)' } : {}}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold" style={{ color: 'var(--color-white)' }}>Masa {order.table_number}</span>
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{time}</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
          style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="space-y-1.5 mb-3">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-sm">
            <span style={{ color: 'var(--color-white)' }}>
              <span className="font-semibold" style={{ color: 'var(--color-accent-2)' }}>{item.quantity}×</span> {item.name}
            </span>
            <span className="font-medium" style={{ color: 'var(--color-muted)' }}>₺{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {order.note && (
        <div className="text-xs rounded-xl px-3 py-2 mb-3" style={{ background: 'var(--color-note-bg)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
          💬 {order.note}
        </div>
      )}

      <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid var(--color-border)' }}>
        <span className="font-bold text-base" style={{ color: 'var(--color-accent-2)' }}>₺{Number(order.total).toFixed(2)}</span>
        {nextStatus[order.status] && (
          <button
            onClick={() => onStatusChange(order.id, nextStatus[order.status])}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white transition hover:opacity-90"
            style={{ background: btnBg[order.status] }}
          >
            {nextLabel[order.status]}
          </button>
        )}
      </div>
    </div>
  )
}
