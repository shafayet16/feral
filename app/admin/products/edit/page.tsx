'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://thkbnqmnatphefnnllme.supabase.co';
const supabaseAnonKey = 'sb_publishable_4U7gn3gCQ3np5-Y9cD-sTQ_b0EWrYdC';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EditProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'tops',
    image: '',
    description: '',
    details: '',
    sizes: 'S,M,L,XL',
    is_bestseller: false,
    in_stock: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // File upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!productId) {
      router.push('/admin/products');
      return;
    }

    async function fetchProduct() {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) {
        setError('Product not found');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setForm({
        name: data.name || '',
        price: data.price ? String(data.price) : '',
        category: data.category || 'tops',
        image: data.image || '',
        description: data.description || '',
        details: data.details || '',
        sizes: Array.isArray(data.sizes) ? data.sizes.join(',') : 'S,M,L,XL',
        is_bestseller: data.is_bestseller ?? false,
        in_stock: data.in_stock ?? true,
      });
      setLoading(false);
    }

    fetchProduct();
  }, [productId, router]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null;
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${selectedFile.name.replace(/\s+/g, '_')}`;
      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        alert('Upload failed: ' + error.message);
        return null;
      }

      const { data: publicUrl } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return publicUrl.publicUrl;
    } catch (err: any) {
      alert('Upload error: ' + err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // If a new file is selected, upload it first
    let finalImageUrl = form.image; 
    if (selectedFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) finalImageUrl = uploadedUrl;
      else {
        setSaving(false);
        return;
      }
    }

    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      image: finalImageUrl,
      description: form.description,
      details: form.details,
      sizes: form.sizes.split(',').map(s => s.trim()).filter(s => s),
      is_bestseller: form.is_bestseller,
      in_stock: form.in_stock,
    };

    // Corrected target endpoint and aligned method type
    const res = await fetch(`/api/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/admin/products');
    } else {
      const errData = await res.json().catch(() => ({}));
      alert('Error updating product: ' + (errData.error || 'Unknown error'));
    }
    setSaving(false);
  };

  if (!productId) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-6 h-6 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <p className="text-red-400">{error}</p>
        <button onClick={() => router.push('/admin/products')} className="mt-4 text-neutral-400 underline">
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-mono">
      <h1 className="text-2xl font-bold uppercase tracking-wider mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="text-xs text-neutral-400">Name</label>
          <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white" />
        </div>
        <div>
          <label className="text-xs text-neutral-400">Price (BDT)</label>
          <input type="number" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white" />
        </div>
        <div>
          <label className="text-xs text-neutral-400">Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white">
            <option value="tops">Tops</option>
            <option value="pants">Pants</option>
            <option value="jackets">Jackets</option>
            <option value="denims">Denims</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-neutral-400">Product Image</label>
          <div className="mt-1 flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-neutral-200"
            />
            {uploading && <span className="text-xs text-neutral-400 animate-pulse">Uploading...</span>}
          </div>
          {previewUrl ? (
            <div className="mt-2 w-32 h-32 overflow-hidden border border-neutral-700">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          ) : form.image ? (
            <div className="mt-2 w-32 h-32 overflow-hidden border border-neutral-700">
              <img src={form.image} alt="Current" className="w-full h-full object-cover" />
            </div>
          ) : null}
          <p className="text-xs text-neutral-500 mt-1">or paste an image URL:</p>
          <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white" placeholder="https://..." />
        </div>

        <div>
          <label className="text-xs text-neutral-400">Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white" rows={3} />
        </div>
        <div>
          <label className="text-xs text-neutral-400">Details (care, fabric, etc.)</label>
          <textarea value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white" rows={3} />
        </div>
        <div>
          <label className="text-xs text-neutral-400">Sizes (comma‑separated)</label>
          <input type="text" value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 text-white" />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={form.is_bestseller} onChange={e => setForm({ ...form, is_bestseller: e.target.checked })} />
            Bestseller
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} />
            In Stock
          </label>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={saving || uploading} className="bg-white text-black px-6 py-2 uppercase font-bold hover:bg-neutral-200 disabled:opacity-50">
            {saving ? 'Saving...' : uploading ? 'Uploading Image...' : 'Update Product'}
          </button>
          <button type="button" onClick={() => router.push('/admin/products')} className="border border-neutral-700 px-6 py-2 uppercase text-sm hover:border-white">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}