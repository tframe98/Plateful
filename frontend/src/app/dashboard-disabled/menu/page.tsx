'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  isAvailable: boolean
  image?: string // base64 string
}

const categories = [
  'Appetizers', 'Salads', 'Pizza', 'Pasta', 'Main Course', 'Desserts', 'Beverages'
]

function getMenuFromStorage(): MenuItem[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem('menu-items')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveMenuToStorage(items: MenuItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('menu-items', JSON.stringify(items))
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: categories[0],
    isAvailable: true,
    image: '',
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [editModal, setEditModal] = useState<null | MenuItem>(null)
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    category: categories[0],
    isAvailable: true,
    image: '',
  })
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)

  useEffect(() => {
    setMenuItems(getMenuFromStorage())
  }, [])

  useEffect(() => {
    saveMenuToStorage(menuItems)
  }, [menuItems])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setForm(f => ({ ...f, image: reader.result as string }))
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) return
    setMenuItems(prev => [
      {
        id: Math.random().toString(36).slice(2),
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        isAvailable: form.isAvailable,
        image: form.image || undefined,
      },
      ...prev
    ])
    setForm({ name: '', description: '', price: '', category: categories[0], isAvailable: true, image: '' })
    setImagePreview(null)
    setShowAdd(false)
  }

  const handleRemove = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id))
  }

  const openEditModal = (item: MenuItem) => {
    setEditForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isAvailable: item.isAvailable,
      image: item.image || '',
    })
    setEditImagePreview(item.image || null)
    setEditModal(item)
  }
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setEditForm(f => ({ ...f, image: reader.result as string }))
      setEditImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault()
    setMenuItems(prev => prev.map(item =>
      item.id === editForm.id ? {
        ...item,
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        category: editForm.category,
        isAvailable: editForm.isAvailable,
        image: editForm.image || undefined,
      } : item
    ))
    setEditModal(null)
    setEditImagePreview(null)
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Digital Menu</h1>
        <button className="btn-primary flex items-center" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </button>
      </div>

      {showAdd && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Menu Item</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="input-field w-full"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="Menu item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  className="input-field w-full"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  className="input-field w-full"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  required
                  min={0}
                  step={0.01}
                  placeholder="$0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Available</label>
                <select
                  className="input-field w-full"
                  value={form.isAvailable ? 'yes' : 'no'}
                  onChange={e => setForm(f => ({ ...f, isAvailable: e.target.value === 'yes' }))}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="input-field w-full"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                className="input-field w-full"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Description (optional)"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" className="btn-primary">Add Item</button>
              <button type="button" className="btn-secondary" onClick={() => { setShowAdd(false); setImagePreview(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Menu Item</h2>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="input-field w-full"
                    value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                    required
                    placeholder="Menu item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    className="input-field w-full"
                    value={editForm.category}
                    onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input
                    type="number"
                    className="input-field w-full"
                    value={editForm.price}
                    onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                    required
                    min={0}
                    step={0.01}
                    placeholder="$0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Available</label>
                  <select
                    className="input-field w-full"
                    value={editForm.isAvailable ? 'yes' : 'no'}
                    onChange={e => setEditForm(f => ({ ...f, isAvailable: e.target.value === 'yes' }))}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="input-field w-full"
                  />
                  {editImagePreview && (
                    <img src={editImagePreview} alt="Preview" className="mt-2 h-24 w-24 object-cover rounded" />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="input-field w-full"
                  value={editForm.description}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description (optional)"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn-primary">Save Changes</button>
                <button type="button" className="btn-secondary" onClick={() => { setEditModal(null); setEditImagePreview(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 px-6 pt-6">Menu Items</h2>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Available</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-left py-3 px-4">Photo</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">No menu items yet. Add your first item above.</td>
                </tr>
              )}
              {menuItems.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4">{item.category}</td>
                  <td className="py-3 px-4">${item.price.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{item.isAvailable ? 'Yes' : 'No'}</span>
                  </td>
                  <td className="py-3 px-4">{item.description}</td>
                  <td className="py-3 px-4">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400">No photo</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => openEditModal(item)} className="text-primary-600 hover:text-primary-800 mr-2" title="Edit item">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleRemove(item.id)} className="text-danger-600 hover:text-danger-800" title="Remove item">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 